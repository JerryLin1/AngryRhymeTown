import React from "react";
import io from "socket.io-client";
import $ from "jquery";

export default class Client extends React.Component {

    constructor(props) {
        super(props);
        this.socket = io();
        this.name = "";

        // this.room is actually clients (rooms[roomId].clients)
        this.room = [];
        this.roomSettings = {};

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

        // ANCHOR: Game state handlers
        this.socket.on("startGame", () => {
            this.props.switchState(true);
            // TODO: Do some animations
        })
        this.socket.on("startPairPhase", () => {
            this.switchPhase("Pairing");
        })
        this.socket.on("startWritePhase", () => {
            this.switchPhase("Writing");

            this.socket.emit("requestWords");
        })
        this.socket.on("startRapPhase", () => {
            this.switchPhase("Rapping");
        })
        // Clientside timer should end about the same time as they receive startVotePhase from server
        this.socket.on("startVotePhase", () => {
            this.switchPhase("Voting");
        })
        this.socket.on("startRoundResultsPhase", () => {
            this.switchPhase("RoundResults");
        })
        this.socket.on("startGameResultsPhase", () => {
            this.switchPhase("GameResults");
        })
        this.socket.on("returnToLobby", () => {
            // TODO: Return to the lobby
        })

        this.socket.on("receiveRoomSettings", roomSettings => {
            this.roomSettings = roomSettings;
        })

    }

    setNick = (nickname) => {
        // if (nickname.trim() === "" || nickname.trim().length <= 12) {
        //     if (Object.values(this.room).map(client => client.name).includes(name)) {
        //         // TODO: HANDLE IF NAME IS ALREADY TAKEN HERE. Already functional but an alert would be good
        //     } else {
        //         this.name = name;
        //         this.socket.emit("updateNickname", name);
        //     }
        //     this.name = nickname;
        //     localStorage.setItem("nickname", nickname)
        // }
        this.name = nickname;
        localStorage.setItem("nickname", nickname)
    }

    sendMessage = (msg) => {
        if (msg != "") {
            this.socket.emit("sendMessage", msg);
        }
    }

    createRoom = () => {
        this.socket.emit("createRoom");
    }

    joinRoom = (roomId) => {
        let nickname = localStorage.getItem("nickname");
        let avatar = JSON.parse(localStorage.getItem("avatar"));
        this.socket.emit("joinRoom", { roomId: roomId, nickname: nickname, avatar: avatar });
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