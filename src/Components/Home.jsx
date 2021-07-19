import React from "react";
import io from "socket.io-client";
import $ from "jquery";


export default class Home extends React.Component {

  constructor(props) {
    super(props);
  }
  

  render() {
    return (
      <div className="App">
        ANGRY RHYME TOWN
        <div>
          <button onClick={this.props.createRoom}>Create lobby</button>
        </div>
        <div>
          <input id="inputRoomID" type="text" />
          <button
            onClick={() => {
              this.props.redirect($("#inputRoomID").val());
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

}

