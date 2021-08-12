// ============== Magic =================
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// ======================================

const wordFunctions = require("./server/wordFunctions.js");
const gameState = require("./server/gameState.js");
const hf = require("./server/helperFunctions.js");
const DEFAULT_ROOM_SETTINGS = require("./server/defaultRoomSettings.js");
const { Callbacks } = require('jquery');
const { getRandomInt } = require('./server/helperFunctions.js');
const sheetInfo = require('./src/Components/Avatar/SheetInfo.json');

const port = process.env.PORT || 6567;
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

const rooms = {};

// Whenever a client connects
io.on('connection', socket => {
    console.log(`${socket.id} has connected.`);
    socket.room = undefined;
    socket.nickname = `Player # ${socket.id.substring(0, 4).toUpperCase()}`;

    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected.`);
        if (socket.room in rooms) {
            sendToChat(`${socket.nickname} has left.`, "SERVER_RED");

            // If host disconnects, transfer host to the next client
            let transferHost = false;
            if (rooms[socket.room].clients[socket.id].isHost === true && numberOfClientsInRoom(socket.room) > 1) {
                transferHost = true;
            }

            // Increment disconnected so that skip options work correctly
            // Go to next phase if everyone is ready
            if (rooms[socket.room].gameState !== gameState.LOBBY) {
                rooms[socket.room].disconnected += 1;
                rooms[socket.room].clients[socket.id].disconnected = true;
                rooms[socket.room].clients[socket.id].name = rooms[socket.room].clients[socket.id].name + " (dc'd)";
                if (rooms[socket.room].gameState === gameState.WRITING) {
                    if (rooms[socket.room].finishedSpittin === numberOfClientsInRoom(socket.room) - rooms[socket.room].disconnected) {
                        startVotePhase();
                    }
                } else if (rooms[socket.room].gameState === gameState.VOTING) {
                    if (rooms[socket.room].votesCast === numberOfClientsInRoom(socket.room) - rooms[socket.room].disconnected) {
                        startNext();
                    }
                }
            } else {
                delete rooms[socket.room].clients[socket.id];
            }

            // Transfer host
            if (numberOfClientsInRoom(socket.room) > 0) {
                if (transferHost) {
                    Object.values(rooms[socket.room].clients)[0].isHost = true;
                }
                io.to(socket.room).emit("updateClientList", rooms[socket.room].clients);
            }

            // TODO: Delete room when empty
        }
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let roomId = hf.RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", roomId);
        rooms[roomId] = {};
        rooms[roomId].clients = {};
        rooms[roomId].chatHistory = [];
        rooms[roomId].rounds = [];
        rooms[roomId].pairings = {};
        rooms[roomId].battle = 0;
        rooms[roomId].currentRound = -1;
        rooms[roomId].votesCast = 0;
        rooms[roomId].finishedSpittin = 0;
        rooms[roomId].finishedListenin = 0;
        rooms[roomId].nextPhase = null;
        rooms[roomId].rapper1 = "";
        rooms[roomId].rapper2 = "";
        rooms[roomId].settings = DEFAULT_ROOM_SETTINGS;
        rooms[roomId].gameState = gameState.LOBBY;
        rooms[roomId].disconnected = 0;
        console.log(`Room ${roomId} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", info => {
        let roomId = info.roomId;
        // If room exists, join client to room
        if (roomId in rooms && rooms[roomId].gameState === gameState.LOBBY) {
            socket.join(roomId);
            if (info.nickname !== undefined && info.nickname && info.nickname.trim() !== "" && info.nickname.length <= 12) {
                socket.nickname = info.nickname;
            }
            rooms[roomId].clients[socket.id] = {};
            rooms[roomId].clients[socket.id].disconnected = false;
            rooms[roomId].clients[socket.id].name = socket.nickname;

            //TODO: Authenticate this is a real avatar. If not, set a random one
            if (info.avatar === null) {
                info.avatar = {
                    bodyNum: -1,
                    eyesNum: -1,
                    hairNum: -1,
                    mouthNum: -1,
                    shirtNum: -1
                }
            }
            rooms[roomId].clients[socket.id].avatar = info.avatar;

            if (!isValidComponent(info.avatar.bodyNum, sheetInfo.NUM_OF_BODY))
                rooms[roomId].clients[socket.id].avatar.bodyNum = getRandomInt(0, sheetInfo.NUM_OF_BODY);

            if (!isValidComponent(info.avatar.eyesNum, sheetInfo.NUM_OF_EYES))
                rooms[roomId].clients[socket.id].avatar.eyesNum = getRandomInt(0, sheetInfo.NUM_OF_EYES);

            if (!isValidComponent(info.avatar.hairNum, sheetInfo.NUM_OF_HAIR))
                rooms[roomId].clients[socket.id].avatar.hairNum = getRandomInt(0, sheetInfo.NUM_OF_HAIR);

            if (!isValidComponent(info.avatar.mouthNum, sheetInfo.NUM_OF_MOUTH))
                rooms[roomId].clients[socket.id].avatar.mouthNum = getRandomInt(0, sheetInfo.NUM_OF_MOUTH);

            if (!isValidComponent(info.avatar.shirtNum, sheetInfo.NUM_OF_SHIRT))
                rooms[roomId].clients[socket.id].avatar.shirtNum = getRandomInt(0, sheetInfo.NUM_OF_SHIRT);

            if (numberOfClientsInRoom(roomId) === 1) {
                rooms[roomId].clients[socket.id].isHost = true;
            }
            else {
                rooms[roomId].clients[socket.id].isHost = false;
            }
            // hf.logObj(rooms);
            socket.room = roomId;
            io.to(socket.room).emit("joinedLobby");
            io.to(socket.room).emit("updateClientList", rooms[roomId].clients);

            // Update chat history. 
            for (chatMsg of rooms[roomId].chatHistory) {
                io.to(socket.id).emit("receiveMessage", chatMsg);
            }
            sendToChat(`${socket.nickname} has joined.`, "SERVER");
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })

    // LEGACY CODE: Nickname is now in home screen and cannot be changed in lobby
    // Update's client's nickname and updates client list on client side for all clients
    // socket.on("updateNickname", name => {
    //     if (rooms[socket.room].gameState === gameState.LOBBY) {
    //         sendToChat(`${socket.nickname} has been renamed to ${name}.`, "SERVER");
    //         socket.nickname = name;
    //         rooms[socket.room].clients[socket.id].name = socket.nickname;
    //         io.to(socket.room).emit("updateClientList", rooms[socket.room].clients);
    //     }
    // })

    // Receives and sends message to all clients in a room
    socket.on("sendMessage", (msg) => {
        sendToChat(msg, "USER", socket.nickname, socket.id);
    })
    function sendToChat(msg, type, senderNickname, senderId) {
        let chatMsg = { msg: msg, type: type, nickname: senderNickname, id: senderId };
        rooms[socket.room].chatHistory.push(chatMsg);
        io.to(socket.room).emit("receiveMessage", chatMsg);
    }
    socket.on("startGame", () => {
        if (rooms[socket.room].gameState === gameState.LOBBY && rooms[socket.room].clients[socket.id].isHost === true) {
            // TODO: if (rooms[socket.room].length %% 2 === 0) Must be even number of players. unless we code bot?
            // TODO: Emit room settings whenever they are changed by host (once that is implemented)
            io.to(socket.room).emit("receiveRoomSettings", rooms[socket.room].settings);
            io.to(socket.room).emit("startGame");

            rooms[socket.room].rounds = [];

            // Set player scores to 0
            for (let client of Object.values(rooms[socket.room].clients)) {
                client.score = 0;
                client.wordBonuses = 0;
            }
            startRound();
        }
    });

    function startRound() {
        rooms[socket.room].currentRound += 1;
        rooms[socket.room].battle = 0;
        rooms[socket.room].rounds.push({});


        for (let client of Object.keys(rooms[socket.room].clients)) {
            rooms[socket.room].rounds[rooms[socket.room].currentRound][client] = {};
            rooms[socket.room].rounds[rooms[socket.room].currentRound][client].presented = false;
            rooms[socket.room].rounds[rooms[socket.room].currentRound][client].bars = [];
        }

        startPairPhase();
    }

    function startPairPhase() {
        io.to(socket.room).emit("startPairPhase");
        setGameState(socket.room, gameState.PAIRING);
        let t = rooms[socket.room].settings.pairingTime;
        rooms[socket.room].nextPhase = setTimeout(() => { startWritePhase() }, t);

        let pairings = hf.GeneratePairs(Object.keys(rooms[socket.room].clients));
        rooms[socket.room].pairings = pairings;

        // TODO: Remove undefined check when bot is ready or when odd number of players check is ready
        let pairingsOfNames = Object.entries(pairings).map(([k, v]) => {
            let newK = (k === "filler") ? "filler" : rooms[socket.room].clients[k].name;
            let newV = (v === "filler") ? "filler" : rooms[socket.room].clients[v].name;
            return [newK, newV];
        });

        io.to(socket.room).emit("sendPairings", pairingsOfNames);

        for (let rapper of Object.keys(pairings)) {

            // TODO: Remove undefined check when bot is ready or when odd number of players check is ready
            if (rapper === "filler") continue;

            rooms[socket.room]
                .rounds[rooms[socket.room].currentRound][rapper]
                .opponent = pairings[rapper];

            rooms[socket.room]
                .rounds[rooms[socket.room].currentRound][pairings[rapper]]
                .opponent = rapper;
        }
    }

    function startWritePhase() {
        io.to(socket.room).emit("startWritePhase");
        setGameState(socket.room, gameState.WRITING);
        let t = rooms[socket.room].settings.writingTime;
        rooms[socket.room].nextPhase = setTimeout(() => { startVotePhase() }, t);
    };

    socket.on("finishedSpittin", () => {
        // TODO: Verification: a hacker could finish spitting more than once
        rooms[socket.room].finishedSpittin += 1;
        if (rooms[socket.room].finishedSpittin === numberOfClientsInRoom(socket.room) - rooms[socket.room].disconnected) {

            rooms[socket.room].finishedSpittin = 0;
            startVotePhase();
        }
    })

    function startRapPhase() {
        // if (rooms[socket.room].nextPhase !== null) clearTimeout(rooms[socket.room].nextPhase);
        // io.to(socket.room).emit("startRapPhase");
        // setGameState(socket.room, gameState.RAPPING);
        // startBattle();
    }

    socket.on("finishedListenin", () => {
        // Goes to next phase if tts on host machine is done
        // rooms[socket.room].finishedListenin += 1;
        // if (rooms[socket.room].finishedListenin === numberOfClientsInRoom(socket.room)) {
        //     clearTimeout(rooms[socket.room].nextPhase);
        //     rooms[socket.room].finishedListenin = 0;
        //     startVotePhase();
        // }
    })

    function startVotePhase() {
        io.to(socket.room).emit("startVotePhase");
        clearTimeout(rooms[socket.room].nextPhase);
        setGameState(socket.room, gameState.VOTING);
        startBattle();
    }

    function startBattle() {
        let t = rooms[socket.room].settings.votingTime;
        if (rooms[socket.room].gameState == gameState.VOTING) {
            rooms[socket.room].nextPhase = setTimeout(() => { startNext() }, t)
        }
        const battles = Object.keys(rooms[socket.room].pairings);
        rooms[socket.room].rapper1 = battles[rooms[socket.room].battle];
        rooms[socket.room].rapper2 =
            rooms[socket.room]
                .rounds[rooms[socket.room].currentRound][battles[rooms[socket.room].battle]]
                .opponent;


        const matchup = [
            {
                nickname: rooms[socket.room]
                    .clients[rooms[socket.room].rapper1]
                    .name,
                bars: rooms[socket.room]
                    .rounds[rooms[socket.room].currentRound][rooms[socket.room].rapper1]
                    .bars
            },
            {
                nickname: rooms[socket.room]
                    .clients[rooms[socket.room].rapper2]
                    .name,
                bars: rooms[socket.room]
                    .rounds[rooms[socket.room].currentRound][rooms[socket.room].rapper2]
                    .bars
            }
        ]

        // Go to next battle and check if all battles in the round are over
        // If so, go to next round 
        if (rooms[socket.room].gameState == gameState.VOTING) {
            rooms[socket.room].battle += 1;
            io.to(socket.room).emit("receiveBattleVoting", matchup);
        } else {
            io.to(socket.room).emit("receiveBattleRapping", matchup);
        }


    }

    socket.on("receiveVote", (rapper) => {
        // TODO: vote verification. a hacker could vote more than once 
        rooms[socket.room].votesCast += 1;
        (rapper === 1) ?
            rooms[socket.room]
                .clients[rooms[socket.room].rapper1]
                .score += 250
            :
            rooms[socket.room]
                .clients[rooms[socket.room].rapper2]
                .score += 250;
        io.to(socket.room).emit("numVotedSoFar", rooms[socket.room].votesCast);

        // Check if all votes have been submitted
        let disconnectedVoters = 0;
        for (let client of Object.keys(rooms[socket.room].clients)) {
            console.log(client, rooms[socket.room].rapper1, rooms[socket.room].rapper2);
            if (client !== rooms[socket.room].rapper1 && client !== rooms[socket.room].rapper2) {
                if (rooms[socket.room].clients[client].disconnected) {
                    disconnectedVoters += 1;
                }
            }
        }
        console.log(disconnectedVoters);
        if (rooms[socket.room].votesCast === (numberOfClientsInRoom(socket.room) - 2 - disconnectedVoters)) {

            // Check if the next round or the next battle should start
            startNext();
        }
    })

    // Check if the next round or the next battle should start, or end game
    function startNext() {
        rooms[socket.room].votesCast = 0;
        clearTimeout(rooms[socket.room].nextPhase);

        // If all battles have completed:
        if (Object.keys(rooms[socket.room].pairings).length === rooms[socket.room].battle) {
            rooms[socket.room].battle = 0;
            if (rooms[socket.room].currentRound === rooms[socket.room].settings.numberOfRounds - 1) {
                startGameResultsPhase();
            }
            else {
                startRoundResultsPhase();
            }
        } else if (Object.keys(rooms[socket.room].pairings).length > rooms[socket.room].battle) {
            startBattle();
        }
    }

    // Get, sort, and return results
    function getResults() {
        let results = [];
        for (let client of Object.keys(rooms[socket.room].clients)) {
            let name = rooms[socket.room].clients[client].name;
            let score = rooms[socket.room].clients[client].score;
            let wordBonuses = rooms[socket.room].clients[client].wordBonuses;
            results.push({ name: name, score: score, wordBonuses: wordBonuses });
        }
        results.sort((a, b) => (a.score > b.score) ? -1 : 1);
        return results;
    }

    function startRoundResultsPhase() {
        io.to(socket.room).emit("startRoundResultsPhase");
        setGameState(socket.room, gameState.ROUND_RESULTS);
        let t = rooms[socket.room].settings.roundResultsTime;

        io.to(socket.room).emit("sendRoundResults", getResults(), rooms[socket.room].rounds.length);

        // Start next round (which starts at pairing phase)
        setTimeout(() => { startRound() }, t);
    }
    function startGameResultsPhase() {
        io.to(socket.room).emit("startGameResultsPhase");
        setGameState(socket.room, gameState.GAME_RESULTS);

        io.to(socket.room).emit("sendGameResults", getResults());

        // remove all disconnected clients
        for (let client of Object.keys(rooms[socket.room].clients)) {
            if (rooms[socket.room].clients[client].disconnected) {
                delete rooms[socket.room].clients[client];
            }
        }
        // TODO: In addition to or instead of these timeouts, 
        // have a button to go immediately to the next phase
        setTimeout(() => { returnToLobby() }, 5000);
    }
    function returnToLobby() {
        io.to(socket.room).emit("returnToLobby");
        setGameState(socket.room, gameState.LOBBY);
        // TODO: reset stuff like round data?
    }

    // Callback is the response: it returns the generated words to the client
    socket.on("requestWords", () => {
        let words = [];
        for (let i = 0; i < 4; i++) {
            words.push(wordFunctions.getRandomWords());
        }
        rooms[socket.room].clients[socket.id].words = words;
        socket.emit("receiveWritingInfo", words, rooms[socket.room].clients[rooms[socket.room]
            .rounds[rooms[socket.room].currentRound][socket.id]
            .opponent].name);
    })


    // Receive bars and calculate bonuses from using words
    socket.on("sendBars", (bars) => {

        rooms[socket.room]
            .rounds[rooms[socket.room].currentRound][socket.id]
            .bars.push(bars);

        let wordBonuses = wordFunctions.calculatePoints(bars,
            rooms[socket.room]
                .clients[socket.id]
                .words[rooms[socket.room]
                    .rounds[rooms[socket.room].currentRound][socket.id]
                    .bars.length - 1]);

        rooms[socket.room]
            .clients[socket.id]
            .score += wordBonuses;

        rooms[socket.room]
            .clients[socket.id]
            .wordBonuses += wordBonuses;
    })

    socket.on("receiveOpponent", callback => {
        callback({
            name: rooms[socket.room].clients[rooms[socket.room]
                .rounds[rooms[socket.room].currentRound][socket.id]
                .opponent].name
        })
    })
});

// Server debug messages
// setInterval(() => {
//     console.log(`${io.engine.clientsCount} clients.`);
//     hf.logObj(rooms)
// }, 1000)

function numberOfClientsInRoom(roomId) {
    return Object.keys(rooms[roomId].clients).length;
}
function setGameState(roomId, gameState) {
    if (rooms[roomId] != undefined) {
        rooms[roomId].gameState = gameState;
    }
}
function isValidComponent(num, numCom) {
    if (num === undefined || num === null) return false;
    if (num >= 0 && num < numCom) return true;
    else return false;
}