import React from "react";
import io from "socket.io-client";
import $ from "jquery";
import { Card } from "react-bootstrap";

export default class Client extends React.Component {

    constructor(props) {
        super(props);

        this.socket = io();
        this.name = "";
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
            $('#lobbyList').html("");
            this.name = room.clients[this.socket.id].name;

            this.room = room;

            for (let client of Object.values(room.clients)) {
                $("#lobbyList").append("<div>" + client.name + "</div>");
            }

            // Im like infinite% sure using map like this is bad programming practice
            // this.room = Object.keys(room).map(function (key) {
            //     $("#lobbyList").append("<div>" + room[key].name + "</div>");

            //     return room[key].name;
            // });
        })

        // Update the chat 
        this.socket.on("receiveMessage", (chatInfo) => {
            console.log(chatInfo);

            // Autoscroll chat if scroll is already at bottom
            // Otherwise we assume they are reading chat and so do not scroll
            let autoScroll = false;
            let jsele = $("#chat")[0];
            if (jsele.scrollHeight - jsele.scrollTop === jsele.clientHeight) autoScroll = true;

            $("#chat").append("<div>" + chatInfo["sender"] + ": " + chatInfo["msg"] + "</div>");

            if (autoScroll === true) jsele.scrollTo(0, jsele.scrollHeight);
        })

        // ANCHOR: Game state handlers
        this.socket.on("startGame", () => {
            this.props.switchState(true);
            // TODO: Do some animations
        })
        this.socket.on("setUpGame", pairs => {
            this.switchPhase("Pairing");
            setTimeout(() => { this.socket.emit("startWritePhase") }, 5000);
        })
        this.socket.on("startWritePhase", () => {
            // TODO: Start a timer
            // Response is called when the server responds
            this.switchPhase("Writing");
            setTimeout(() => { this.socket.emit("startVotePhase") }, 5000);

            this.socket.emit("requestWords", (response) => {
                // the words should be returned as response.words
                // Display the words
                console.log("You got: " + response.words)
            });
            // TODO: Text input box and submit button
            // Submit button emits line and words to server, then request more words
        })
        // Clientside timer should end about the same time as they receive startVotePhase from server
        this.socket.on("startVotePhase", () => {
            this.switchPhase("Voting");
            // Start a timer
        })
    }

    setNick = (name) => {
        if (Object.values(this.room.clients).map(client => client.name).includes(name)) {
            // TODO: HANDLE IF NAME IS ALREADY TAKEN HERE. Already functional but an alert would be good
        } else {
            this.name = name;
            this.socket.emit("updateNickname", name);
        }
    }

    sendMessage = (msg) => {
        console.log(msg + " " + this.name);
        if (msg != "") {
            this.socket.emit("sendMessage", { "msg": msg, "sender": this.name });
        }
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