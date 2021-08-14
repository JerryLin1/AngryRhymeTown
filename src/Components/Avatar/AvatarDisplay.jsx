import React from "react";
import avatarDisplay from "./AvatarDisplay.module.css";
import { isValidComponent, getRandomInt } from "./avatarFunctions";
import sheetInfo from "./SheetInfo.json";
import hairSheet from "../../assets/avatar/hair.gif";
import eyesSheet from "../../assets/avatar/eye.gif";
import bodySheet from "../../assets/avatar/body.gif";
import mouthSheet from "../../assets/avatar/mouth.gif";
import shirtSheet from "../../assets/avatar/shirt.gif";
import Sketch from "react-p5";

export default class AvatarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(
      sheetInfo.COMPONENT_DIMENSIONS.x * this.props.size,
      sheetInfo.COMPONENT_DIMENSIONS.y * this.props.size
    ).parent(canvasParentRef);
    if (window.sheets!= undefined || window.sheets != null) {
      this.bodySheet = window.sheets.bodySheet;
      this.shirtSheet = window.sheets.shirtSheet;
      this.mouthSheet = window.sheets.mouthSheet;
      this.eyesSheet = window.sheets.eyesSheet;
      this.hairSheet = window.sheets.hairSheet;
    }
    window.sheets.bodySheet.reset();
    window.sheets.shirtSheet.reset();
    window.sheets.mouthSheet.reset();
    window.sheets.eyesSheet.reset();
    window.sheets.hairSheet.reset();
    
  };
  preload = (p5) => {
    if (window.sheets === undefined || window.sheets === null) {
      window.sheets = {};
      window.sheets.bodySheet = p5.loadImage(bodySheet);
      window.sheets.shirtSheet = p5.loadImage(shirtSheet);
      window.sheets.mouthSheet = p5.loadImage(mouthSheet);
      window.sheets.eyesSheet = p5.loadImage(eyesSheet);
      window.sheets.hairSheet = p5.loadImage(hairSheet);
    }
  };
  draw = (p5) => {
    let w = sheetInfo.COMPONENT_DIMENSIONS.x;
    let h = sheetInfo.COMPONENT_DIMENSIONS.y;
    p5.clear();
    p5.image(
      window.sheets.bodySheet,
      0,
      0,
      w * this.props.size,
      h * this.props.size,
      this.state.bodyPos.x,
      this.state.bodyPos.y,
      w,
      h
    );
    p5.image(
      window.sheets.shirtSheet,
      0,
      0,
      w * this.props.size,
      h * this.props.size,
      this.state.shirtPos.x,
      this.state.shirtPos.y,
      w,
      h
    );
    p5.image(
      window.sheets.mouthSheet,
      0,
      0,
      w * this.props.size,
      h * this.props.size,
      this.state.mouthPos.x,
      this.state.mouthPos.y,
      w,
      h
    );
    p5.image(
      window.sheets.eyesSheet,
      0,
      0,
      w * this.props.size,
      h * this.props.size,
      this.state.eyesPos.x,
      this.state.eyesPos.y,
      w,
      h
    );
    p5.image(
      window.sheets.hairSheet,
      0,
      0,
      w * this.props.size,
      h * this.props.size,
      this.state.hairPos.x,
      this.state.hairPos.y,
      w,
      h
    );
  };
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
    return (
      <div
        className={avatarDisplay.avatarContainer}
        style={{
          width: `${sheetInfo.COMPONENT_DIMENSIONS.x * this.props.size}px`,
          height: `${sheetInfo.COMPONENT_DIMENSIONS.y * this.props.size}px`,
          transform: this.props.flipped ? "scaleX(-1)" : "scaleX(1)",
        }}
      >
        <Sketch setup={this.setup} draw={this.draw} preload={this.preload} />
      </div>
    );
  }
  getCoords(num, numCom) {
    let cols = sheetInfo.SHEET_DIMENSIONS.x / sheetInfo.COMPONENT_DIMENSIONS.x;
    let x = sheetInfo.COMPONENT_DIMENSIONS.x * num;
    let row = 0;
    let y = 0;
    while (x >= sheetInfo.SHEET_DIMENSIONS.x) {
      row++;
      y = sheetInfo.COMPONENT_DIMENSIONS.y * row;
      x -= sheetInfo.SHEET_DIMENSIONS.x;
    }
    return { x: x, y: y };
  }
}
AvatarDisplay.defaultProps = {
  size: 1,
};
