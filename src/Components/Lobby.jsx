import React from "react";

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);
    this.client = props.client;
    this.room = props.room;
    
  }

  render() {
    return (
      <div>
        <div id = "lobbyList"></div>

      </div>
    );
  }
}

