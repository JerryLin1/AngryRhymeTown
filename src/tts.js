export default {
    rap(strings) {
        for (let b = 0; b < strings.length; b++) {
            setTimeout(this.speak(strings[b]), b * 3000);
        }
    },
    speak(string) {
        let ssu = new SpeechSynthesisUtterance()
        ssu.text = string;
        ssu.rate = 0.9;
        window.speechSynthesis.speak(ssu);
    }
}