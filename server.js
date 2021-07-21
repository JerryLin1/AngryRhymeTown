// ============== Magic =================
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// ======================================

const wm = require("./server/wm.js");

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
            delete rooms[socket.room].clients[socket.id];
            io.to(socket.room).emit("updateClientList", rooms[socket.room]);
        }
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let roomId = RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", roomId);
        rooms[roomId] = {};
        console.log(`Room ${roomId} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", roomId => {
        // If room exists, join client to room
        if (roomId in rooms) {
            socket.join(roomId);
            if (rooms[roomId].clients === undefined) rooms[roomId].clients = {};
            rooms[roomId].clients[socket.id] = {};
            rooms[roomId].clients[socket.id].name = socket.name;
            CLRooms();
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
        // TODO: if (socket.host === true)
        // TODO: if (rooms[socket.room].length %% 2 === 0) Must be even number of players. unless we code bot?
        io.to(socket.room).emit("startGame");
        // TODO: Set player scores to 0

        io.to(socket.room).emit("startPairPhase", GeneratePairs(rooms.clients));

        // After X seconds start writing phase
        setTimeout(io.to(socket.room).emit("startWritePhase"), 5000);
        // After X seconds start vote phase
        setTimeout(io.to(socket.room).emit("startVotePhase"), 180000);
    });
    // i have no idea if this callback works
    socket.on("requestWords", callback => {
        words: wm.getRandomWords();
    })
});

// Server debug messages
setInterval(() => {
    console.log(`${io.engine.clientsCount} clients.`);
    CLRooms();
}, 10000)

// Pairs clients against each other. Pass in room clients)
// TODO: this doesn't work. it is probably very easy to do but i cant figure it out
// I think it may 
function GeneratePairs(clients) {
    // TODO: Pair based on points? Make sure pairs arent repeated?
    let remainingClients = Object.values(clients).map(client => client.name);
    let pairings = {};
    if (remainingClients.length % 2 === 1) {
        remainingClients.push(undefined);
    }
    shuffleArray(remainingClients);
    for (let i = 0; i < remainingClients.length; i += 2) {
        pairings[remainingClients[i]] = remainingClients[i + 1];
    }
    return pairings
}

// Room id generator
function RandomId(length) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
}

function CLRooms() {
    console.dir(rooms, { depth: null });
}

// https://stackoverflow.com/a/12646864/8280780
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}