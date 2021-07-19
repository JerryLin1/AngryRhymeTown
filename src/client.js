import io from "socket.io-client";

export default function client() {
    const socket = io();

    this.createRoom = function () {
        socket.emit("createRoom");
    }

    this.joinRoom = function (roomId) {
        socket.emit("joinRoom", roomId);
    }

    this.redirect = function (id) {
        window.location.href = id;
    }

    // At start, attempt to join the room ID from the URL
    let roomId = window.location.pathname + window.location.search;
    roomId = roomId.substring(1);
    if (roomId.length > 1) {
        this.joinRoom(roomId);
    }

    // For debug
    socket.on("log", (msg) => {
        console.log(msg);
    });

    // Redirect URL (e.g. when client creates room)
    socket.on("redirect", (id) => {
        this.redirect(id);
    });
}

