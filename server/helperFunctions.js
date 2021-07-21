module.exports = {
    // https://stackoverflow.com/a/12646864/8280780
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    // Room id generator
    RandomId(length) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    },
    // Pairs clients against each other. Pass in room.clients
    GeneratePairs(clients) {
        // TODO: Pair based on points? Make sure pairs arent repeated?
        let remainingClients = Object.values(clients).map(client => client.name);
        let pairings = {};
        // If odd number of players, pair someone with undefined
        if (remainingClients.length % 2 === 1) {
            remainingClients.push(undefined);
        }
        this.shuffleArray(remainingClients);
        for (let i = 0; i < remainingClients.length; i += 2) {
            pairings[remainingClients[i]] = remainingClients[i + 1];
        }
        return pairings
    },
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
        //The maximum is exclusive and the minimum is inclusive
    }
}
