import React from "react";

// displays text that counts down. I figured someone would need to do it eventually
export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.startingTime = Date.now();
    this.secondsLeft = parseInt(this.props.time);
    this.interval = setInterval(() => {
      // deltaTime is in milliseconds
      this.deltaTime = Date.now() - this.startingTime;
      this.secondsLeft = Math.round(this.props.time - this.deltaTime / 1000);
      if (this.secondsLeft <= 0) {
        clearInterval(this.interval);
        this.props.onCountdownEnd(this.props.nextPhase);
        this.secondsLeft = 0;
      }

      this.forceUpdate();
    }, 60 / 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div className="countdown">{this.secondsLeft}</div>;
  }
}
