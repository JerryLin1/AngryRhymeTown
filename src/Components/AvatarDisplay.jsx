import React from "react";
import avatarDisplay from "./AvatarDisplay.module.css";

export default class AvatarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.NUM_OF_BODY = 3;
    this.NUM_OF_EYES = 3;
    this.NUM_OF_HAIR = 2;
    this.NUM_OF_MOUTH = 3;
    this.NUM_OF_SHIRT = 2;
    this.COMPONENT_DIMENSIONS = { x: 128, y: 128 };
    this.SHEET_DIMENSIONS = { x: 1024, y: 1024 };
    this.state = {
        bodyNum: 0,
        eyesNum: 0,
        hairNum: 0,
        mouthNum: 0,
        shirtNum: 0,
        bodyPos: "0px 0px",
        eyesPos: "0px 0px",
        hairPos: "0px 0px",
        mouthPos: "0px 0px",
        shirtPos: "0px 0px",
      };
    if (props.avatar === undefined) {
        this.state.bodyNum = this.getRandomInt(0, this.NUM_OF_BODY);
        this.state.eyesNum = this.getRandomInt(0, this.NUM_OF_EYES);
        this.state.hairNum = this.getRandomInt(0, this.NUM_OF_HAIR);
        this.state.mouthNum = this.getRandomInt(0, this.NUM_OF_MOUTH);
        this.state.shirtNum = this.getRandomInt(0, this.NUM_OF_SHIRT);
    }
    else {
        this.state.bodyNum = props.avatar.bodyNum;
        this.state.eyesNum = props.avatar.eyesNum;
        this.state.hairNum = props.avatar.hairNum;
        this.state.mouthNum = props.avatar.mouthNum;
        this.state.shirtNum = props.avatar.shirtNum;
    }
  }
  componentDidMount() {
    this.setState({
      bodyPos: this.getCoords(this.state.bodyNum, this.NUM_OF_BODY),
    });
    this.setState({
      eyesPos: this.getCoords(this.state.eyesNum, this.NUM_OF_EYES),
    });
    this.setState({
      hairPos: this.getCoords(this.state.hairNum, this.NUM_OF_HAIR),
    });
    this.setState({
      mouthPos: this.getCoords(this.state.mouthNum, this.NUM_OF_MOUTH),
    });
    this.setState({
      shirtPos: this.getCoords(this.state.shirtNum, this.NUM_OF_SHIRT),
    });
  }
  render() {
    return (
      <div className={avatarDisplay.avatarContainer}>
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarBody}`}
          style={{ backgroundPosition: this.state.bodyPos }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarShirt}`}
          style={{ backgroundPosition: this.state.shirtPos }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarMouth}`}
          style={{ backgroundPosition: this.state.mouthPos }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarEyes}`}
          style={{ backgroundPosition: this.state.eyesPos }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarHair}`}
          style={{ backgroundPosition: this.state.hairPos }}
        />
      </div>
    );
  }
  getCoords(num, numCom) {
    let x = -this.COMPONENT_DIMENSIONS.x * num;
    let row = 0;
    let y = 0;
    while (x < -this.SHEET_DIMENSIONS.x) {
      row++;
      y = -this.COMPONENT_DIMENSIONS.y * row;
      x += this.COMPONENT_DIMENSIONS.x;
    }
    console.log(`${x} ${y}`);
    return `${x}px ${y}px`;
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}