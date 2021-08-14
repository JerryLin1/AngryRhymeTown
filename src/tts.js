export default {
    // async rap(strings) {
    //     for (let b = 0; b < strings.length; b++) {
    //         await this.getNextAudio(strings[b]);
    //         // await this.timeout(3000);
    //     }
    // },
    // TODO: Pass in voice parameters
    newSSU() {
        let ssu = new SpeechSynthesisUtterance();
        ssu.rate = 0.9;
        return ssu;
    },
    async speak(ssu, string) {
        // ssu is SpeechSynthesisUtterance()
        ssu.text = string;
        if (!document.hidden) ssu.volume = 1;
        else ssu.volume = 0;
        window.speechSynthesis.speak(ssu);

        return new Promise(resolve => {
            ssu.onend = resolve;
        })
    },
    async speakResponsiveVoice(string) {
        let v;
        if (!document.hidden) v = 1;
        else v = 0;
        return new Promise(resolve => {
            window.responsiveVoice.speak(string, "UK English Male", {volume: v, onend: resolve})
        })
    },
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}