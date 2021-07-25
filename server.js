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
let rapper1 = "", rapper2 = "";
let currentRound = 0;
let currentBattle = 0;
let pairings = {};

// Whenever a client connects
io.on('connection', socket => {
    console.log(`${socket.id} has connected.`);
    socket.room = undefined;
    socket.name = "New Player #" + socket.id.substring(0, 4).toUpperCase();

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
        rooms[socket.room].rounds.push({});
        for (let client of Object.keys(rooms[socket.room].clients)) {
            rooms[socket.room].rounds[currentRound][client] = {};
            rooms[socket.room].rounds[currentRound][client].presented = false;
            rooms[socket.room].rounds[currentRound][client].bars = [];
        }

        startPairPhase();
    }

    function startPairPhase() {
        pairings = hf.GeneratePairs(Object.keys(rooms[socket.room].clients));

        // TODO: Remove undefined check when bot is ready or when odd number of players check is ready
        let pairingsOfNames = Object.entries(pairings).map(([k, v]) => {
            let newK = (k === "filler") ? "filler" : rooms[socket.room].clients[k].name;
            let newV = (v === "filler") ? "filler" : rooms[socket.room].clients[v].name;
            return [newK, newV];
        });
        for (let rapper of Object.keys(pairings)) {

            // TODO: Remove undefined check when bot is ready or when odd number of players check is ready
            if (rapper === "filler") continue;
            rooms[socket.room].rounds[currentRound][rapper].opponent = pairings[rapper];
            rooms[socket.room].rounds[currentRound][pairings[rapper]].opponent = rapper;
        }
        io.to(socket.room).emit("startPairPhase", pairings, pairingsOfNames);
        setGameState(socket.room, gameState.PAIRING);
        let t = rooms[socket.room].settings.pairingTime;
        setTimeout(() => { startWritePhase() }, t);
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
        // TODO: end voting phase on rap presentation finish
        // setTimeout(() => { startVoteResultsPhase() }, t);
    }

    socket.on("getBattle", () => {
        if (rooms[socket.room].clients[socket.id].isHost) {
            const battles = Object.keys(pairings);
            rapper1 = battles[currentBattle];
            rapper2 = rooms[socket.room].rounds[currentRound][rapper1].opponent;
            currentBattle += 1;
            if (currentBattle > battles.length) {
                io.to(socket.room).emit("receiveBattle", "finished");
                currentBattle = 0;
            }

            const matchup = [
                {
                    nickname: rooms[socket.room].clients[rapper1].name,
                    bars: rooms[socket.room].rounds[currentRound][rapper1].bars
                },
                {
                    nickname: rooms[socket.room].clients[rapper2].name,
                    bars: rooms[socket.room].rounds[currentRound][rapper2].bars
                }
            ]

            io.to(socket.room).emit("receiveBattle", matchup);
        }

    })

    socket.on("receiveVote", rapper => {
        (rapper === 1) ? rooms[socket.room].clients[rapper1].score += 1 : rooms[socket.room].clients[rapper2].score += 1;
    })

    function startVoteResultsPhase() {
        io.to(socket.room).emit("startVoteResultsPhase");
        setGameState(socket.room, gameState.VOTING_RESULTS)
        let t = rooms[socket.room].settings.votingResultsTime;
        // TODO: if last round, go to gameresults. Otherwise go to roundresults
        setTimeout(() => { startGameResultsPhase() }, t);
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
        rooms[socket.room].rounds[currentRound][socket.id].bars.push(bars);
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