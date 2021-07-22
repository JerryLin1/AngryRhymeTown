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
            // rooms[socket.room].gameState = gameState.START; ??

            // Set player scores to 0
            for (let client of Object.values(rooms[socket.room].clients)) {
                client.score = 0;
            }

            io.to(socket.room).emit("setUpGame", hf.GeneratePairs(rooms[socket.room].clients));
            rooms[socket.room].gameState = gameState.PAIRING;            
        }
    });

    socket.on("startWritePhase", () => {
        io.to(socket.room).emit("startWritePhase");
        rooms[socket.room].gameState = gameState.WRITING;
    })

    socket.on("startVotePhase", () => {
        io.to(socket.room).emit("startVotePhase");
        rooms[socket.room].gameState = gameState.VOTING;
    })


    // Callback is the response: it returns the generated words to the client
    socket.on("requestWords", (callback) => {
        callback({
            words: wordFunctions.getRandomWords()
        })
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