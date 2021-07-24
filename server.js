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
            else {
                delete rooms[socket.room];
            }
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
        startPairPhase();
    }

    function startPairPhase() {
        io.to(socket.room).emit("startPairPhase", hf.GeneratePairs(rooms[socket.room].clients));
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
        setTimeout(() => { startVoteResultsPhase() }, t);
    }

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