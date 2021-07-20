import React from "react";
import io from "socket.io-client";
import $ from "jquery";

export default class Client extends React.Component {

    constructor(props) {
        super(props);

        this.socket = io();
        this.room = [];

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

        this.socket.on("updateRoom", (rooms) => {
            this.room = rooms[roomId];
            $("#lobbyList").text(rooms[roomId])
        })

        this.socket.on("startGame", () => {
            // TODO: Do some animations
        })
        this.socket.on("startPairPhase", pairs => {
            // TODO: Display round pairs (who is vs. who)
        })
        this.socket.on("startWritePhase", () => {
            // TODO: Start a timer
            // Theoretically, response should call after receiving callback from server
            this.socket.emit("requestWords", (response) => {
                // document.write(response.words)
            });
            // TODO: Create button that submits line and words to server, then request more words
        })
        // Clientside timer should end same time as they receive startVotePhase from server
        this.socket.on("startVotePhase", () => {
            // Start a timer
        })
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

    // Set to a button only visible to host
    startGame = () => {
        this.socket.emit("startGame");
    }

}
