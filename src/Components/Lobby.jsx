import React from "react";
import $ from "jquery";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
<<<<<<< HEAD

import lobby from "./Lobby.module.css";
=======
import lobby from "./Lobby.module.css"
>>>>>>> e2a75605e8999afc6d36f11ebbeb6e3d1c3989dc

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
<<<<<<< HEAD
  render() {
    return (
      <div className={`${lobby.lobby}`}>
        <Row>
          <Col>
            <h3>Room code: (SOCKET ID)</h3>
          </Col>
        </Row>

        <Row>
          <Col xs="5" id={`${lobby.left}`}>
            Players:
          </Col>
        </Row>
=======

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

>>>>>>> e2a75605e8999afc6d36f11ebbeb6e3d1c3989dc
      </div>
    );
  }
}
<<<<<<< HEAD
=======



>>>>>>> e2a75605e8999afc6d36f11ebbeb6e3d1c3989dc
