import React from "react";
import { Card, Col, Row } from "react-bootstrap";

import game from "./Game.module.css";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return (
      <div className="game">
        <Row>
          {/* Main Game */}
          <Col>
            <h1>GAME :D</h1>
          </Col>

          {/* Matchup List */}
          <Col xs="2">
            <Card variant="dark">
              <Card.Title>GET READY</Card.Title>
              <Card.Body>I dont know how to do this</Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}