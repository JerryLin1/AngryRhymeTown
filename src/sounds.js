import select from "./assets/select.mp3";
import home from "./assets/home.mp3";

const button = new Audio(select);
button.preload =true;

const menu = new Audio(home);
menu.loop = true;
menu.autoplay = true;
menu.volume = 0.25;

const sounds = {
    "button": button,
    "menu": menu
}

export default {
    play(sound) {
        sounds[sound].play();
    },

    stop(sound) {
        sounds[sound].pause();
        sounds[sound].currentTime = 0;
    }
}