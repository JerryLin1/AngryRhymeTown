const NAMES = {
    first: [
        "Da",
        "Lil",
        "Little",
        "Big",
        "Biggy",
        "VeryScalding",
        "The",
        "Tha",
        "Giant",
        "Wealthy",
        "NotPoor",
        "Hyper",
        "Giga",
        "Affluent",
        "WellOff",
        "Prosperous",
        "Loaded",
        "Packing"
    ],
    last: [
        "Baloney",
        "Baby",
        "Fire",
        "Spitta",
        "Lord",
        "King",
        "Creator",
        "Man",
        "Star",
        "Money",
        "Wielder"
    ]
}
export function GenerateName() {
    return `${NAMES.first[getRandomInt(0, NAMES.first.length)]}${NAMES.last[getRandomInt(0, NAMES.last.length)]}`;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    //The maximum is exclusive and the minimum is inclusive
}