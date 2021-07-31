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
        window.speechSynthesis.speak(ssu);

        return new Promise(resolve => {
            ssu.onend = resolve
        })
    },
    // timeout(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
}