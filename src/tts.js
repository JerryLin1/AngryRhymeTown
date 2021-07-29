export default {
    async rap(strings) {
        for (let b = 0; b < strings.length; b++) {
            await this.getNextAudio(strings[b]);
            // await this.timeout(3000);
        }
    },
    async getNextAudio(string) {
        if (document.hasFocus()) {
            let ssu = new SpeechSynthesisUtterance()
            ssu.text = string;
            ssu.rate = 0.9;
            window.speechSynthesis.speak(ssu);

            return new Promise(resolve => {
                ssu.onend = resolve
            })
        }
    },
    speak(string) {
        if (document.hasFocus()) {
            let ssu = new SpeechSynthesisUtterance()
            ssu.text = string;
            ssu.rate = 0.9;
            window.speechSynthesis.speak(ssu);
        }
    },
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}