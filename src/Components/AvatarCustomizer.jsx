import React from "react";
import AvatarDisplay from "./AvatarDisplay";
import avatarCustomizer from "./AvatarCustomizer.module.css";

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
  render() {
    return (
      <div className={avatarCustomizer.customizerWrapper}>
        <div className={avatarCustomizer.buttonsWrapper}>
            <div className={avatarCustomizer.leftButtons}></div>
            <div className={avatarCustomizer.rightButtons}></div>
        </div>
        <AvatarDisplay
          avatar={{
            bodyNum: this.state.bodyNum,
            eyesNum: this.state.eyesNum,
            hairNum: this.state.hairNum,
            mouthNum: this.state.mouthNum,
            shirtNum: this.state.shirtNum,
          }}
        />
      </div>
    );
  }
}
