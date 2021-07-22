import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
import Game from "./Components/Game"
import reportWebVitals from "./reportWebVitals";
import Client from './client.js';
import tts from "./tts";
import 'bootstrap/dist/css/bootstrap.min.css';


class Director extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inGame: false };
    this.switchState = this.switchState.bind(this);
    this.client = new Client({ switchState: this.switchState });
  }

  switchState = (inGame) => {
    this.setState({ inGame: inGame });
  }

  displayState = () => {
    if (window.location.pathname + window.location.search === "/") {
      return <Home client={this.client} />;
    } else {
      if (this.state.inGame) {
        return <Game client={this.client} />;
      } else {
        return <Lobby client={this.client} switchState={this.switchState} />;
      }
    }
  }

  render() {
    return (
      <div>
        {this.displayState()}
      </div>
    );
  }
}

ReactDOM.render(
  <Director />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
