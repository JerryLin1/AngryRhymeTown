import React from "react";
import io from "socket.io-client";

export default class Client extends React.Component {

    constructor(props) {
        super(props);
        this.socket = io();
        this.nickname = "";

        this.roomSettings = {};
        this.startDates = {};

        // For debug
        this.socket.on("log", (msg) => {
            console.log(msg);
        });
        console.log(props)
        // Redirect URL (e.g. when client creates room)
        this.socket.on("redirect", (id) => {
            this.pushURL(id);
        });

        this.socket.on("joinedLobby", name => {
            this.nickname = name;
        })

        // ANCHOR: Game state handlers
        this.socket.on("startGame", () => {
            // TODO: Do some animations
        })
        this.socket.on("startPairPhase", startDate => {
            this.startDates.pairPhase = startDate
            this.redirectURL(`${this.roomId}/pairing`);
        })
        this.socket.on("startWritePhase", startDate => {
            this.startDates.writePhase = startDate
            this.redirectURL(`${this.roomId}/writing`)
        })
        this.socket.on("startRapPhase", startDate => {
            this.startDates.rapPhase = startDate
            this.redirectURL(`${this.roomId}/rapping`)
        })
        // Clientside timer should end about the same time as they receive startVotePhase from server
        this.socket.on("startVotePhase", startDate => {
            this.startDates.votePhase = startDate
            this.redirectURL(`${this.roomId}/voting`)
        })
        this.socket.on("startRoundResultsPhase", startDate => {
            this.startDates.roundResultsPhase = startDate
            this.redirectURL(`${this.roomId}/roundresults`)
        })
        this.socket.on("startGameResultsPhase", startDate => {
            this.startDates.gameResultsPhase = startDate
            this.redirectURL(`${this.roomId}/gameresults`)
        })
        this.socket.on("returnToLobby", () => {
            this.redirectURL(`${this.roomId}`)
        })

        this.socket.on("receiveRoomSettings", roomSettings => {
            this.roomSettings = roomSettings;
        })

    }
    redirectURL = (id) => {
        this.props.match.history.replace(`/${id}`);
    }

    pushURL = (id) => {
        this.props.match.history.push(`/${id}`);
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
        let defaultNickname = localStorage.getItem("defaultNickname")
        this.roomId = roomId;
        this.socket.emit("joinRoom", {
            roomId: roomId,
            nickname: nickname,
            avatar: avatar,
            defaultNickname: defaultNickname,
        });
    };

    // This should be an onClick button only available to the host
    startGame = () => {
        this.socket.emit("startGame");
        // TODO: instead of an empty emit, emit an object that contains all the game options
        // E.g. Writing time, voting time, number of rounds, etc.
    }

    render() {
        return null;
    }
}