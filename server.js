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

            if (transferHost === true) {
                Object.values(rooms[socket.room].clients)[0].isHost = true;
            }

            io.to(socket.room).emit("updateClientList", rooms[socket.room]);
        }
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let roomId = hf.RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", roomId);
        rooms[roomId] = {};
        rooms[roomId].gameState = gameState.LOBBY;
        console.log(`Room ${roomId} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", roomId => {
        // If room exists, join client to room
        if (roomId in rooms) {
            socket.join(roomId);
            if (rooms[roomId].clients === undefined) {
                rooms[roomId].clients = {};
            }
            rooms[roomId].clients[socket.id] = {};
            rooms[roomId].clients[socket.id].name = socket.name;

            if (numberOfClientsInRoom(roomId) === 1) {
                rooms[roomId].clients[socket.id].isHost = true;
            }
            else {
                rooms[roomId].clients[socket.id].isHost = false;
            }
            logRooms();
            socket.room = roomId;
            io.to(socket.room).emit("updateClientList", rooms[roomId]);

            console.log(hf.GeneratePairs(rooms[roomId].clients))
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })

    // Update's client's nickname and updates client list on client side for all clients
    socket.on("updateNickname", name => {
        socket.name = name;
        rooms[socket.room].clients[socket.id].name = socket.name;
        io.to(socket.room).emit("updateClientList", rooms[socket.room]);
    })

    // Receives and sends message to all clients in a room
    socket.on("sendMessage", (chatInfo) => {
        io.to(socket.room).emit("receiveMessage", { "msg": chatInfo["msg"], "sender": chatInfo["sender"] });
    })

    socket.on("startGame", () => {
        if (rooms[socket.room].clients[socket.id].isHost === true) {
            // TODO: if (rooms[socket.room].length %% 2 === 0) Must be even number of players. unless we code bot?
            io.to(socket.room).emit("startGame");
            // TODO: Set player scores to 0

            io.to(socket.room).emit("startPairPhase", hf.GeneratePairs(rooms.clients));

            // After X seconds start writing phase
            setTimeout(io.to(socket.room).emit("startWritePhase"), 5000);
            // After X seconds start vote phase
            setTimeout(io.to(socket.room).emit("startVotePhase"), 180000);
        }
    });
    // i have no idea if this callback works
    socket.on("requestWords", callback => {
        words: wordFunctions.getRandomWords();
    })
});

// Server debug messages
setInterval(() => {
    console.log(`${io.engine.clientsCount} clients.`);
    logRooms();
}, 10000)

function logRooms() {
    // this prints out full object instead of [Object object]
    console.dir(rooms, { depth: null });
}

function numberOfClientsInRoom(roomId) {
    return Object.keys(rooms[roomId].clients).length;
}