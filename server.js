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
    socket.name = "New Player " + socket.id.substring(0,3);

    socket.on('disconnect', () => {
        console.log(`ID: ${socket.id} has disconnected.`);
        if (socket.room in rooms) {
            delete rooms[socket.room][socket.id];
            io.to(socket.room).emit("updateClientList", rooms[socket.room]);
        }
    });

    // When client creates lobby
    socket.on("createRoom", () => {
        let gid = RandomId(8);
        // Redirect client to new URL
        socket.emit("redirect", gid);
        rooms[gid] = {};
        console.log(`Room ${gid} created.`);
    });

    // Joins client to room
    socket.on("joinRoom", id => {
        // If room exists, join client to room
        if (id in rooms) {
            socket.join(id);
            rooms[id][socket.id] = socket.name;
            console.log(`Current players in ${id}: ${rooms[id]}`);
            socket.room = id;
            io.to(socket.room).emit("updateClientList", rooms[id]);
        }
        // Else redirect them back to home
        else {
            socket.emit("redirect", "/");
        }
    })

    // When client updates their nickname
    socket.on("updateNickname", name => {
        socket.name = name;
        rooms[socket.room][socket.id] = socket.name;
        io.to(socket.room).emit("updateClientList", rooms[socket.room]);
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

