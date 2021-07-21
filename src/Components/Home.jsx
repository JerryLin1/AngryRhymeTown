import React from "react";
import $ from "jquery";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import home from "./Home.module.css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
  }
  render() {
    return (
      <div className={`${home.App}`}>
        <h1 id="title">ANGRY RHYME TOWN</h1>

        <Row>
          <Col>
            <Button
              variant="outline-dark"
              id={`${home.createLobby}`}
              onClick={this.client.createRoom}
            >
              Create lobby
            </Button>
            <input
              placeholder="Lobby Code"
              type="text"
              id={`${home.inputRoomID}`}
            />
            <Button
              variant="outline-dark"
              onClick={() => {
                this.client.redirect($(`#${home.inputRoomID}`).val());
              }}
              id={`${home.joinRoom}`}
            >
              Join Room
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
