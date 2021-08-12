import React from "react";
import $ from "jquery";
import anime from "animejs";
import home from "./Home.module.css";
import sounds from "../sounds.js";
import { Row, Col, Button, Form } from "react-bootstrap";
import AvatarCustomizer from "./Avatar/AvatarCustomizer";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
  }

  render() {
    return (
      <div className={`${home.Home}`}>
        <h1 id="title">ANGRY RHYME TOWN</h1>

        <Row>
          <Form.Group as={Col}>
            <Button
              variant="outline-dark"
              id={`${home.createLobby}`}
              onClick={() => {
                sounds.play("button");
                this.client.createRoom();
              }}
            >
              Create lobby
            </Button>
            <Form.Control
              inline
              placeholder="Lobby Code"
              id={`${home.inputRoomID}`}
              xs="3"
            />
            <Button
              variant="outline-dark"
              onClick={() => {
                sounds.play("button");
                this.client.redirect($(`#${home.inputRoomID}`).val());
              }}
              id={`${home.joinRoom}`}
            >
              Join Lobby
            </Button>
          </Form.Group>
        </Row>
        <div style={{ marginTop: "5%", fontSize: "1.5em" }}>
          Hi there {"(name)"}!
        </div>

        <Form
          onSubmit={(event) => {
            sounds.play("button");
            event.preventDefault();
            const nickname = $(`#${home.inputNickname}`).val();
            // animation that flash red and black when the player tries to submit an invalid name
            if ($(`#${home.nameWarning}`).css("display") !== "none") {
              anime({
                targets: `#${home.nameWarning}`,
                keyframes: [
                  { color: "rgb(255,255,255)" },
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(255,255,255)" },
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(255,255,255)" },
                ],
                duration: 750,
              });
            } else if (nickname === "") {
              $(`#${home.nameWarning}`).text("Nickname cannot be empty");
              $(`#${home.nameWarning}`).show();
              anime({
                targets: `#${home.nameWarning}`,
                keyframes: [
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(255,255,255)" },
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(255,255,255)" },
                  { color: "rgb(255,0,0)" },
                ],
                duration: 750,
              });
            } else {
              this.client.setNick(nickname);
              localStorage.setItem("nickname", nickname);
              $(`#${home.inputNickname}`).val("");
            }
          }}
        >
          <Row id={`${home.nicknameRow}`}>
            <Col xs="auto">
              <Form.Control
                placeholder="Nickname"
                id={`${home.inputNickname}`}
                autoComplete="off"
                onChange={() => {
                  let input = $(`#${home.inputNickname}`);
                  // if statements to check if nickname is empty or too long
                  if (
                    (input.val().length === 13 || input.val().trim() === "") &&
                    $(`#${home.nameWarning}`).css("display") === "none"
                  ) {
                    if (input.val().trim() === "") {
                      $(`#${home.nameWarning}`).text(
                        "Nickname cannot be empty"
                      );
                      $(`#${home.nameWarning}`).show();
                    } else {
                      $(`#${home.nameWarning}`).text(
                        "Nickname is too long. Your nickname cannot have any more than 12 characters."
                      );
                      $(`#${home.nameWarning}`).show();
                    }
                  } else if (input.val().length > 12) {
                    return;
                  } else if (input.val().trim() === "") {
                    $(`#${home.nameWarning}`).text("Nickname cannot be empty");
                    return;
                  } else {
                    $(`#${home.nameWarning}`).hide();
                  }
                }}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-dark"
                type="submit"
                id={`${home.setName}`}
              >
                Set Nickname
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Flashing name warning */}
        <div id={`${home.nameWarning}`}></div>

        <div>
          <AvatarCustomizer />
        </div>

        <div id={home.credits}>
          <Row>
            <Col>
              <h4>Game created by: Tom Han, Jerry Lin, and Roseak Lin</h4>
            </Col>
          </Row>
          <div
            id={`${home.repoLink}`}
            onClick={() => {
              sounds.play("button");
              window.open("https://github.com/JerryLin1/AngryRhymeTown");
            }}
          >
            Github Repository{" "}
            <svg
              id={`${home.gitIcon}`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
