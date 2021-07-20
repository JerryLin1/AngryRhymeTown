import React from "react";
import io from "socket.io-client";
import $ from "jquery";

export default class Client extends React.Component {

    constructor(props) {
        super(props);

        this.socket = io();
        this.name = "";
        this.room = {};

        
        // At start, attempt to join the room ID from the URL
        let roomId = window.location.pathname + window.location.search;
        roomId = roomId.substring(1);
        if (roomId.length > 1) {
            this.joinRoom(roomId);
        }

        // For debug
        this.socket.on("log", (msg) => {
            console.log(msg);
        });

        // Redirect URL (e.g. when client creates room)
        this.socket.on("redirect", (id) => {
            this.redirect(id);
        });

        // Update the player list in the client's room
        this.socket.on("updateRoom", (rooms) => {
            this.room = rooms[roomId];
            $("#lobbyList").text(rooms[roomId])

        })

        // Set the player's name to their ID after their ID loads in
        this.socket.on("connect", () => {this.name = this.socket.id});
    }

    setNick = (name) => {
        let index = this.room.indexOf(this.name);
        this.room[index] = name;
        this.name = name;
        $("#lobbyList").text(this.room);
    }

    createRoom = () => {
        this.socket.emit("createRoom");
    }

    joinRoom = (roomId) => {
        this.socket.emit("joinRoom", roomId);
    }

    redirect = (id) => {
        window.location.href = id;
    }


}
