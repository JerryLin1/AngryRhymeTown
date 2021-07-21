// TODO: EXTREMELY LOW PRIO! LIKE LITERALLY LAST THING TO DO: There are a ton of JSON files of words 
// in the data file. Go through them and give a  general screening to make sure they will fit into our game.
// Eventually combine into pools of words that we can take from easily.
// Also comb through words to make sure they aren't too obscure and add some. Also phrases would be good
// Make separate word lists for nouns, adjectives, verbs, etc.

// TODO: Some words should have bonuses attached (words would be object instead of array then)
// e.g. End with this word, use these words in order, use both of these words
// Additionally, you could get bonuses/powerups other than points
// e.g. Extra time next round, reroll words once
const hf = require("./helperFunctions.js");
module.exports = {
    WORD_LIST: require("../data/words/nouns.json"),
    calculatePoints(sentence, words) {
        sentence = sentence.toLowerCase();
        let points = 0;

        // Get points for every word used
        let countUsed = 0;
        for (word of words) {
            word = word.toLowerCase();
            if (sentence.includes(word)) {
                points += 250;
            }
            countUsed++;
        }
        // Get bonus points if all words are used
        if (countUsed === words.length) {
            points += 250;
        }

        return points;
    },
    getRandomWords() {
        let words = []
        // TODO: Choose words smarter (but still random): e.g. You get at least 1 verb, 1 noun, 1 adjective
        for (let i = 0; i < 4; i++) {
            word = this.getRandomWord();
            while (words.includes(word)) {
                word = this.getRandomWord();
            }
            words.push(word);
        }
        return words;
    },
    getRandomWord() {
        // TODO: Specify in parameter which pool of words to pick from?
        return this.WORD_LIST[hf.getRandomInt(0, Object.keys(this.WORD_LIST).length)];
    }
}