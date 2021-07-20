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
                // the words should be returned as response.words
                // Display the words
            });
            // TODO: Text input box and submit button
            // Submit button emits line and words to server, then request more words
        })
        // Clientside timer should end same time as they receive startVotePhase from server
        this.socket.on("startVotePhase", () => {
            // Start a timer
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

    // This should be an onClick button only available to the host
    startGame = () => {
        this.socket.emit("startGame");
        // TODO: instead of an empty emit, emit an object that contains all the game options
        // E.g. Writing time, voting time, number of rounds, etc.
    }

}
