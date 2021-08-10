import React from "react";
import AvatarDisplay from "./AvatarDisplay";
import avatarCustomizer from "./AvatarCustomizer.module.css";
import { getRandomInt, sheetInfo } from "./SheetInfo";

export default class AvatarCustomizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyNum: 0,
      eyesNum: 0,
      hairNum: 0,
      mouthNum: 0,
      shirtNum: 0,
    };
  }
  randomize() {
    this.setState({
      bodyNum: getRandomInt(0, sheetInfo.NUM_OF_BODY),
      eyesNum: getRandomInt(0, sheetInfo.NUM_OF_EYES),
      hairNum: getRandomInt(0, sheetInfo.NUM_OF_HAIR),
      mouthNum: getRandomInt(0, sheetInfo.NUM_OF_MOUTH),
      shirtNum: getRandomInt(0, sheetInfo.NUM_OF_SHIRT),
    });
  }
  nextComponent(add, num, comNum) {
    let t = num + add;
    if (t >= 0 && t < comNum) {
      console.log(t);
      return t;
    } else if (t < 0) {
      console.log(comNum - 1);
      return comNum - 1;
    } else if (t >= comNum) {
      console.log(0);
      return 0;
    }
  }
  render() {
    return (
      <div className={avatarCustomizer.customizerWrapper}>
        <div className={avatarCustomizer.buttonsWrapper}>
          <div
            className={`${avatarCustomizer.buttons} ${avatarCustomizer.leftButtons}`}
          >
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  hairNum: this.nextComponent(
                    -1,
                    this.state.hairNum,
                    sheetInfo.NUM_OF_HAIR
                  ),
                });
              }}
            >
              👈
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  eyesNum: this.nextComponent(
                    -1,
                    this.state.eyesNum,
                    sheetInfo.NUM_OF_EYES
                  ),
                });
              }}
            >
              👈
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  mouthNum: this.nextComponent(
                    -1,
                    this.state.mouthNum,
                    sheetInfo.NUM_OF_MOUTH
                  ),
                });
              }}
            >
              👈
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  shirtNum: this.nextComponent(
                    -1,
                    this.state.shirtNum,
                    sheetInfo.NUM_OF_SHIRT
                  ),
                });
              }}
            >
              👈
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  bodyNum: this.nextComponent(
                    -1,
                    this.state.bodyNum,
                    sheetInfo.NUM_OF_BODY
                  ),
                });
              }}
            >
              👈
            </div>
          </div>
          <div
            className={`${avatarCustomizer.buttons} ${avatarCustomizer.rightButtons}`}
          >
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  hairNum: this.nextComponent(
                    1,
                    this.state.hairNum,
                    sheetInfo.NUM_OF_HAIR
                  ),
                });
              }}
            >
              👉
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  eyesNum: this.nextComponent(
                    1,
                    this.state.eyesNum,
                    sheetInfo.NUM_OF_EYES
                  ),
                });
              }}
            >
              👉
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  mouthNum: this.nextComponent(
                    1,
                    this.state.mouthNum,
                    sheetInfo.NUM_OF_MOUTH
                  ),
                });
              }}
            >
              👉
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  shirtNum: this.nextComponent(
                    -1,
                    this.state.shirtNum,
                    sheetInfo.NUM_OF_SHIRT
                  ),
                });
              }}
            >
              👉
            </div>
            <div
              className={`${avatarCustomizer.button}`}
              onClick={() => {
                this.setState({
                  bodyNum: this.nextComponent(
                    1,
                    this.state.bodyNum,
                    sheetInfo.NUM_OF_BODY
                  ),
                });
              }}
            >
              👉
            </div>
          </div>
        </div>
        <div className={avatarCustomizer.avatarWrapper}>
          <AvatarDisplay
            avatar={{
              bodyNum: this.state.bodyNum,
              eyesNum: this.state.eyesNum,
              hairNum: this.state.hairNum,
              mouthNum: this.state.mouthNum,
              shirtNum: this.state.shirtNum,
            }}
          />
          <div
            className={avatarCustomizer.random}
            onClick={() => {
              this.randomize();
            }}
          >
            🎲
          </div>
        </div>
      </div>
    );
  }
}
