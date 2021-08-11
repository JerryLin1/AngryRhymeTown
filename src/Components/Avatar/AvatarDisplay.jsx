import React from "react";
import avatarDisplay from "./AvatarDisplay.module.css";
import { isValidComponent, getRandomInt } from "./avatarFunctions";
import sheetInfo from "./SheetInfo.json";

export default class AvatarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps != this.props) this.verifyComponentsInfo();
  }
  componentDidMount() {
    this.verifyComponentsInfo();
  }
  verifyComponentsInfo() {
    if (
      this.props.avatar !== undefined &&
      isValidComponent(this.props.avatar.bodyNum, sheetInfo.NUM_OF_BODY) &&
      isValidComponent(this.props.avatar.eyesNum, sheetInfo.NUM_OF_EYES) &&
      isValidComponent(this.props.avatar.hairNum, sheetInfo.NUM_OF_HAIR) &&
      isValidComponent(this.props.avatar.mouthNum, sheetInfo.NUM_OF_MOUTH) &&
      isValidComponent(this.props.avatar.shirtNum, sheetInfo.NUM_OF_SHIRT)
    ) {
      this.state.bodyNum = this.props.avatar.bodyNum;
      this.state.eyesNum = this.props.avatar.eyesNum;
      this.state.hairNum = this.props.avatar.hairNum;
      this.state.mouthNum = this.props.avatar.mouthNum;
      this.state.shirtNum = this.props.avatar.shirtNum;
    } else {
      this.setState({
        bodyNum: 0,
        eyesNum: 0,
        hairNum: 0,
        mouthNum: 0,
        shirtNum: 0,
      });
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
          MozTransformOrigin: "0 0",
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
