export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
export function isValidComponent(num, numCom) {
    if (num === undefined || num === null) return false;
    if (num >= 0 && num < numCom) return true;
    else return false;
}