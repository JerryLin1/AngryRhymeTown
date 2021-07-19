import React from "react";
import $ from "jquery";
import cclient from '../client.js';

const client = new cclient();

export default class Home extends React.Component {

  render() {
    return (
      <div className="App">
        ANGRY RHYME TOWN
        <div>
          <button onClick={client.createRoom}>Create lobby</button>
        </div>
        <div>
          <input id="inputRoomID" type="text" />
          <button
            onClick={() => {
              client.redirect($("#inputRoomID").val());
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

}

