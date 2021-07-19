import React from "react";
import io from "socket.io-client";
import $ from "jquery";

const socket = io();

export default class Home extends React.Component {
  componentDidMount() {
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

  render() {
    return (
      <div className="App">
        ANGRY RHYME TOWN
        <div>
          <button onClick={this.createRoom}>Create lobby</button>
        </div>
        <div>
          <input id="inputRoomID" type="text" />
          <button
            onClick={() => {
              this.redirect($("#inputRoomID").val());
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }
  createRoom = () => {
    socket.emit("createRoom");
  };
  joinRoom = (roomId) => {
    socket.emit("joinRoom", roomId);
  };

  redirect = (id) => {
    window.location.href = id;
  };
}

// Create the room, then redirect URL to that room
