import React from "react";
import $ from "jquery";

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.client = props.client;
  }


  render() {
    return (
      <div className="App">
        ANGRY RHYME TOWN
        <div>
          <button onClick={this.client.createRoom}>Create lobby</button>
        </div>
        <div>
          <input id="inputRoomID" type="text" />
          <button
            onClick={() => {
              this.client.redirect($("#inputRoomID").val());
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

}

