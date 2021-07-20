import React from "react";
import io from "socket.io-client";
import $ from "jquery";

export default class Client extends React.Component {

    constructor(props) {
        super(props);

        this.socket = io();
        this.room = [];

        
        // At start, attempt to join the room ID from the URL
        this.roomId = (window.location.pathname + window.location.search).substring(1);

        if (this.roomId.length > 1) {
            this.joinRoom(this.roomId);
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
        this.socket.on("updateClientList", (room) => {
            this.room = []
            for (let key in room) {
                this.room.push(room[key]);
            }
            $("#lobbyList").text(this.room);
        })

    }

    setNick = (name) => {
        // TODO: HANDLE IF NAME IS ALREADY TAKEN HERE

        this.socket.emit("updateNickname", name);
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
