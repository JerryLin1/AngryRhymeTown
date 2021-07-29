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
const DEFAULT_ROOM_SETTINGS = require("./server/defaultRoomSettings.js")

const port = process.env.PORT || 6567;
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

const rooms = {};

// Whenever a client connects
io.on('connection', socket => {
    console.log(`${socket.id} has connected.`);
    socket.room = undefined;
    socket.name = "Player #" + socket.id.substring(0, 4).toUpperCase();

    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected.`);
        if (socket.room in rooms) {
            // If host disconnects, transfer host to the next client
            let transferHost = false;
            if (rooms[socket.room].clients[socket.id].isHost === true && numberOfClientsInRoom(socket.room) > 1) {
                transferHost = true;
            }

            delete rooms[socket.room].clients[socket.id];

            if (numberOfClientsInRoom(socket.room) > 0) {
                if (transferHost === true) {
                    Object.values(rooms[socket.room].clients)[0].isHost = true;
                }

                io.to(socket.room).emit("updateClientList", rooms[socket.room]);
            }
            // TODO: Delete room when empty. Currently, just this will cause errors
            // else {
            //     delete rooms[socket.room];
            // }
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
        rooms[roomId].rapper1 = "";
        rooms[roomId].rapper2 = "";
        rooms[roomId].settings = DEFAULT_ROOM_SETTINGS;
        rooms[roomId].gameState = gameState.LOBBY;
        console.log(`Room ${roomId} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", roomId => {
        // If room exists, join client to room
        if (roomId in rooms) {
            socket.join(roomId);
            rooms[roomId].clients[socket.id] = {};
            rooms[roomId].clients[socket.id].name = socket.name;

            if (numberOfClientsInRoom(roomId) === 1) {
                rooms[roomId].clients[socket.id].isHost = true;
            }
            else {
                rooms[roomId].clients[socket.id].isHost = false;
            }
            hf.logObj(rooms);
            socket.room = roomId;
            io.to(socket.room).emit("updateClientList", rooms[roomId]);
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })

    // Update's client's nickname and updates client list on client side for all clients
    socket.on("updateNickname", name => {
        if (rooms[socket.room].gameState === gameState.LOBBY) {
            socket.name = name;
            rooms[socket.room].clients[socket.id].name = socket.name;
            io.to(socket.room).emit("updateClientList", rooms[socket.room]);
        }
    })

    // Receives and sends message to all clients in a room
    socket.on("sendMessage", (chatInfo) => {
        let chatMsg = { "msg": chatInfo["msg"], "sender": chatInfo["sender"] };
        rooms[socket.room].chatHistory.push(chatMsg);
        io.to(socket.room).emit("receiveMessage", chatMsg);
    })

    socket.on("startGame", () => {
        if (rooms[socket.room].gameState === gameState.LOBBY && rooms[socket.room].clients[socket.id].isHost === true) {
            // TODO: if (rooms[socket.room].length %% 2 === 0) Must be even number of players. unless we code bot?
            io.to(socket.room).emit("receiveRoomSettings", rooms[socket.room].settings);
            io.to(socket.room).emit("startGame");
            // rooms[socket.room].gameState = gameState.START; ??

            // Set player scores to 0
            for (let client of Object.values(rooms[socket.room].clients)) {
                client.score = 0;
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
        setTimeout(() => { startWritePhase() }, t);

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
        setTimeout(() => { startVotePhase() }, t);
    };

    function startVotePhase() {
        io.to(socket.room).emit("startVotePhase");
        setGameState(socket.room, gameState.VOTING);
        let t = rooms[socket.room].settings.votingTime;
        startBattle();
        // TODO: end voting phase on rap presentation finish
        // setTimeout(() => { startVoteResultsPhase() }, t);
    }

    function startBattle() {
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
        rooms[socket.room].battle += 1;
        io.to(socket.room).emit("receiveBattle", matchup);


    }

    socket.on("receiveVote", rapper => {
        rooms[socket.room].votesCast += 1;
        (rapper === 1) ?
            rooms[socket.room]
                .clients[rooms[socket.room].rapper1]
                .score += 1
            :
            rooms[socket.room]
                .clients[rooms[socket.room].rapper2]
                .score += 1;

        // Check if all votes have been submitted
        if (rooms[socket.room].votesCast == Object.keys(rooms[socket.room].clients).length - 2) {
            rooms[socket.room].votesCast = 0;

            // TODO: Display results of voting, wait X seconds

            // Check if the next round or the next battle should start
            StartNext();
        }
    })

    // Check if the next round or the next battle should start, or end game
    function StartNext() {
        if (Object.keys(rooms[socket.room].pairings).length === rooms[socket.room].battle) {
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

    function startRoundResultsPhase() {
        io.to(socket.room).emit("startRoundResultsPhase");
        setGameState(socket.room, gameState.ROUND_RESULTS);
        let t = rooms[socket.room].settings.roundResultsTime;
        // Start next round (which starts at pairing phase)
        setTimeout(() => { startRound() }, t);
    }
    function startGameResultsPhase() {
        io.to(socket.room).emit("startGameResultsPhase");
        setGameState(socket.room, gameState.GAME_RESULTS);

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
        socket.emit("receiveWords", words);
    })

    socket.on("sendBars", (bars) => {
        rooms[socket.room].rounds[rooms[socket.room].currentRound][socket.id].bars.push(bars);
    })
});

// Server debug messages
setInterval(() => {
    console.log(`${io.engine.clientsCount} clients.`);
    hf.logObj(rooms)
}, 10000)

function numberOfClientsInRoom(roomId) {
    return Object.keys(rooms[roomId].clients).length;
}
function setGameState(roomId, gameState) {
    if (rooms[roomId] != undefined) {
        rooms[roomId].gameState = gameState;
    }
}