import React from "react";
import $ from "jquery";
import cclient from "../client.js";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

import lobby from "./Lobby.module.css"

const client = new cclient();

export default class Lobby extends React.Component {
   render() {
    return (
      <div className={`${lobby.lobby}`}>
        <Row>
          <Col>
            <h3>Room code: (SOCKET ID)</h3>
          </Col>
        </Row>
      </div>
    );
  }
}