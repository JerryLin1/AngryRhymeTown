import React from "react";
import avatarDisplay from "./AvatarDisplay.module.css";
import { isValidComponent, getRandomInt } from "./avatarFunctions";
import sheetInfo from "./SheetInfo.json";

export default class AvatarDisplay extends React.Component {
  constructor(props) {
    super(props);
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
  }
  componentDidUpdate(prevProps) {
    if (prevProps != this.props) this.verifyComponentsInfo();
  }
  componentDidMount() {
    this.verifyComponentsInfo();
  }
  verifyComponentsInfo() {
    if (this.props.avatar === undefined) {
      this.setState({
        bodyNum: getRandomInt(0, sheetInfo.NUM_OF_BODY),
        eyesNum: getRandomInt(0, sheetInfo.NUM_OF_EYES),
        hairNum: getRandomInt(0, sheetInfo.NUM_OF_HAIR),
        mouthNum: getRandomInt(0, sheetInfo.NUM_OF_MOUTH),
        shirtNum: getRandomInt(0, sheetInfo.NUM_OF_SHIRT),
      });
    } else {
      if (isValidComponent(this.props.avatar.bodyNum, sheetInfo.NUM_OF_BODY))
        this.state.bodyNum = this.props.avatar.bodyNum;
      else this.state.bodyNum = 0;

      if (isValidComponent(this.props.avatar.eyesNum, sheetInfo.NUM_OF_EYES))
        this.state.eyesNum = this.props.avatar.eyesNum;
      else this.state.eyesNum = 0;

      if (isValidComponent(this.props.avatar.hairNum, sheetInfo.NUM_OF_HAIR))
        this.state.hairNum = this.props.avatar.hairNum;
      else this.state.hairNum = 0;

      if (isValidComponent(this.props.avatar.mouthNum, sheetInfo.NUM_OF_MOUTH))
        this.state.mouthNum = this.props.avatar.mouthNum;
      else this.state.mouthNum = 0;

      if (isValidComponent(this.props.avatar.shirtNum, sheetInfo.NUM_OF_SHIRT))
        this.state.shirtNum = this.props.avatar.shirtNum;
      else this.state.shirtNum = 0;
    }
    this.setState({
      bodyPos: this.getCoords(this.state.bodyNum, sheetInfo.NUM_OF_BODY),
      eyesPos: this.getCoords(this.state.eyesNum, sheetInfo.NUM_OF_EYES),
      hairPos: this.getCoords(this.state.hairNum, sheetInfo.NUM_OF_HAIR),
      mouthPos: this.getCoords(this.state.mouthNum, sheetInfo.NUM_OF_MOUTH),
      shirtPos: this.getCoords(this.state.shirtNum, sheetInfo.NUM_OF_SHIRT),
    });
  }
  render() {
    return (
      <div
        className={avatarDisplay.avatarContainer}
        style={{
          zoom: this.props.size,
          MozTransform: `scale(${this.props.size})`,
          MozTransformOrigin: "0 0"
        }}
      >
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
    let x = -sheetInfo.COMPONENT_DIMENSIONS.x * num;
    let row = 0;
    let y = 0;
    while (x < -sheetInfo.SHEET_DIMENSIONS.x) {
      row++;
      y = -sheetInfo.COMPONENT_DIMENSIONS.y * row;
      x += sheetInfo.COMPONENT_DIMENSIONS.x;
    }
    return `${x}px ${y}px`;
  }
}
