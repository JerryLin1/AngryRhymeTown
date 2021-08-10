export const sheetInfo = {
    NUM_OF_BODY: 3,
    NUM_OF_EYES: 3,
    NUM_OF_HAIR: 2,
    NUM_OF_MOUTH: 3,
    NUM_OF_SHIRT: 2,
    COMPONENT_DIMENSIONS: { x: 128, y: 128 },
    SHEET_DIMENSIONS: { x: 1024, y: 1024 },
}
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
export function isValidComponent(num, numCom) {
    if (num >= 0 && num < numCom) return true;
    else return false;
}