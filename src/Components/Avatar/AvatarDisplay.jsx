import React from "react";
import avatarDisplay from "./AvatarDisplay.module.css";
import { isValidComponent, getRandomInt } from "./avatarFunctions";
import sheetInfo from "./SheetInfo.json";
import hairSheet from "../../assets/avatar/hair.gif";
import eyesSheet from "../../assets/avatar/eye.gif";
import bodySheet from "../../assets/avatar/body.gif";
import mouthSheet from "../../assets/avatar/mouth.gif";
import shirtSheet from "../../assets/avatar/shirt.gif";

export default class AvatarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log(bodySheet);
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) this.verifyComponentsInfo();
  }
  componentDidMount() {
    this.verifyComponentsInfo();
  }

  verifyComponentsInfo() {
    // console.log("===========props=========")
    // console.log(this.props)
    if (
      this.props.avatar !== undefined &&
      isValidComponent(this.props.avatar.bodyNum, sheetInfo.NUM_OF_BODY) &&
      isValidComponent(this.props.avatar.eyesNum, sheetInfo.NUM_OF_EYES) &&
      isValidComponent(this.props.avatar.hairNum, sheetInfo.NUM_OF_HAIR) &&
      isValidComponent(this.props.avatar.mouthNum, sheetInfo.NUM_OF_MOUTH) &&
      isValidComponent(this.props.avatar.shirtNum, sheetInfo.NUM_OF_SHIRT)
    ) {
      // console.log("bodyNum: "+this.props.avatar.bodyNum)

      this.state.bodyNum = this.props.avatar.bodyNum;
      this.state.eyesNum = this.props.avatar.eyesNum;
      this.state.hairNum = this.props.avatar.hairNum;
      this.state.mouthNum = this.props.avatar.mouthNum;
      this.state.shirtNum = this.props.avatar.shirtNum;

      // this.setState({
      //   bodyNum: this.props.avatar.bodyNum,
      //   eyesNum: this.props.avatar.eyesNum,
      //   hairNum: this.props.avatar.hairNum,
      //   mouthNum: this.props.avatar.mouthNum,
      //   shirtNum: this.props.avatar.shirtNum,
      // });
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
    // console.log("===============state==============")
    // console.log(this.state)
  }
  render() {
    let size = this.props.size || 1;
    return (
      <div
        className={avatarDisplay.avatarContainer}
        style={{
          width: `${sheetInfo.COMPONENT_DIMENSIONS.x * size}px`,
          height: `${sheetInfo.COMPONENT_DIMENSIONS.y * size}px`,
          transform: this.props.flipped ? "scaleX(-1)" : "scaleX(1)"
        }}
      >
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarBody}`}
          style={{
            backgroundPosition: this.state.bodyPos,
            backgroundImage: `url(${bodySheet})`,
          }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarShirt}`}
          style={{
            backgroundPosition: this.state.shirtPos,
            backgroundImage: `url(${shirtSheet})`,
          }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarMouth}`}
          style={{
            backgroundPosition: this.state.mouthPos,
            backgroundImage: `url(${mouthSheet})`,
          }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarEyes}`}
          style={{
            backgroundPosition: this.state.eyesPos,
            backgroundImage: `url(${eyesSheet})`,
          }}
        />
        <div
          className={`${avatarDisplay.avatarComponent} ${avatarDisplay.avatarHair}`}
          style={{
            backgroundPosition: this.state.hairPos,
            backgroundImage: `url(${hairSheet})`,
          }}
        />
      </div>
    );
  }
  getCoords(num, numCom) {
    let x = -100 * num;
    let row = 0;
    let y = 0;
    while (
      x <
      (-100 * sheetInfo.SHEET_DIMENSIONS.x) / sheetInfo.COMPONENT_DIMENSIONS.x
    ) {
      row++;
      y = -100 * row;
      x += 100;
    }
    return `${x}% ${y}%`;
  }
  //   let x = -sheetInfo.COMPONENT_DIMENSIONS.x * num;
  //   let row = 0;
  //   let y = 0;
  //   while (x < -sheetInfo.SHEET_DIMENSIONS.x) {
  //     row++;
  //     y = -sheetInfo.COMPONENT_DIMENSIONS.y * row;
  //     x += sheetInfo.COMPONENT_DIMENSIONS.x;
  //   }
  //   return `${x}px ${y}px`;
  // }
}
