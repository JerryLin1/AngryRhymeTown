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
            $("#chat").append("<div> From " + chatInfo["sender"] + ": " + chatInfo["msg"] + "</div>");
        })

        // ANCHOR: Game state handlers
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
        if (Object.values(this.room.clients).map(client=>client.name).includes(name)) {
            // TODO: HANDLE IF NAME IS ALREADY TAKEN HERE. Already functional but an alert would be good
        } else {
            this.name = name;
            this.socket.emit("updateNickname", name);
        }
    }

    sendMessage = (msg) => {
        console.log(msg + " " + this.name);
        if (msg != "") {
            this.socket.emit("sendMessage", {"msg": msg, "sender": this.name});
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