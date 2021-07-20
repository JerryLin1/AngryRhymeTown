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
var rooms = [];

// Whenever a client connects
io.on('connection', socket => {
    console.log(`ID: ${socket.id} has joined.`);
    socket.on('disconnect', () => {
        console.log(`ID: ${socket.id} has disconnected.`);
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let gid = RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", gid);
        rooms.push(gid);
        console.log(`Room ${gid} created.`);
    });
    
    // Joins client to room
    socket.on("joinRoom", id => {
        // If room exists, join client to room
        if (rooms.includes(id)) {
            socket.join(id);
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })
    //TODO: Remove ID from rooms when empty
});

// Server debug messages
setInterval(() => {
    console.log(`${io.engine.clientsCount} clients.`);
    console.log(rooms);
}, 10000)

// Room id generator
function RandomId(length) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
}