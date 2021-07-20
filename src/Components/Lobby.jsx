import React from "react";
import $ from "jquery";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import lobby from "./Lobby.module.css"

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);
    this.client = props.client;
    this.room = props.room;
    
  }

  render() {
    return (
      <div className={`${lobby.lobby}`}>
      <Row>
        <Col>
          <h3>Room code: (SOCKET ID)</h3>
        </Col>
      </Row>
        <div id = "lobbyList"></div>

      </div>
    );
  }
}



