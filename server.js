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
    console.log(`ID: ${socket.id} has joined.`);
    socket.room = undefined;
    socket.on('disconnect', () => {
        console.log(`ID: ${socket.id} has disconnected.`);
        if (socket.room in rooms) {
            let index = rooms[socket.room].indexOf(socket.id);
            rooms[socket.room].splice(index, 1);
            // socket.emit("updateRooms", rooms);
        }
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let gid = RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", gid);
        rooms[gid] = [];
        console.log(`Room ${gid} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", id => {
        // If room exists, join client to room
        if (id in rooms) {
            socket.join(id);
            rooms[id].push(socket.id);
            console.log(`Current players in ${id}: ${rooms[id]}`);
            socket.room = id;
            io.to(socket.room).emit("updateRoom", rooms);
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })
    //TODO: Remove ID from rooms when empty

    socket.on("startGame", () => {
        // TODO: if (socket.host === true)
        // TODO: if (rooms[socket.room].length %% 2 === 0) Must be even number of players. unless we code bot?
        io.to(socket.room).emit("startGame");
        // TODO: Set player scores to 0

        io.to(socket.room).emit("roundPairs", GeneratePairs(rooms[socket.room]));

        // After X seconds start writing phase
        setTimeout(io.to(socket.room).emit("startWritePhase"), 5000);
        // After X seconds start vote phase
        setTimeout(io.to(socket.room).emit("startVotePhase"), 180000);
    });
    // i have no idea if this works
    socket.on("requestWords", callback => {
        status: wm.getRandomWords();
    })
});

// Server debug messages
setInterval(() => {
    console.log(`${io.engine.clientsCount} clients.`);
    console.log(rooms);
}, 10000)

// Pairs clients against each other. Pass in array of sockets in a room (rooms[roomId])
function GeneratePairs(sockets) {
    // TODO: make sure no repeat pairs in immediate rounds? Pair based on points?
    let remainingClients = sockets;
    let pairings;
    while (remainingClients.length > 0) {
        let int1 = wm.getRandomInt(0, remainingClients.length);
        let cl1 = remainingClients[int1];
        remainingClients.splice(int1);

        let int2 = wm.getRandomInt(0, remainingClients.length);
        let cl2 = remainingClients[int2];
        remainingClients.splice(int2);

        pairings.cl1 = cl2;
    }
    return pairings;
}

// Room id generator
function RandomId(length) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
}

