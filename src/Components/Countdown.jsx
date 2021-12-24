import React from "react";
import anime from "animejs";
import game from "./Game.module.css";

// displays text that counts down. I figured someone would need to do it eventually

export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(() => {
      const animation = anime.timeline({
        targets: `.${game.Countdown}`,
        loop: true,
        duration: 1000,
      });

      animation
        .add({
          color: "rgb(255,0,0)",
        })
        .add({
          color: "rgb(0,0,0)",
        });
    }, Math.max(this.props.time * 1000 - 14500, 0));

    this.startDate = this.props.startDate || Date.now();
    this.secondsLeft = parseInt(this.props.time);
    this.interval = setInterval(() => {
      // deltaTime is in milliseconds
      this.deltaTime = Date.now() - this.startDate;
      this.secondsLeft = Math.round(this.props.time - this.deltaTime / 1000);
      if (this.secondsLeft <= 0) {
        clearInterval(this.interval);
        this.secondsLeft = 0;
      }

      this.forceUpdate();
    }, 60 / 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { before, after } = this.props;

    return (
      <div className={`${game.Countdown}`}>
        {before} {this.secondsLeft} seconds {after}
      </div>
    );
  }
}
