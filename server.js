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

