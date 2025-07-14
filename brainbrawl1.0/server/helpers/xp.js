const BASE_XP = 100;
const EXPONENT = 1.5;

function xpForLevel(level, baseXP = BASE_XP, exponent = EXPONENT) {
    return Math.floor(baseXP * Math.pow(level, exponent));
}

function getLevelFromXP(xp ,baseXP = BASE_XP, exponent = EXPONENT) {
    let level = 1;
    let xpNeeded = xpForLevel(level, baseXP, exponent);
    let totalxp = 0;

    while (xp >= totalxp + xpNeeded) {
        totalxp += xpNeeded;
        level++;
        xpNeeded = xpForLevel(level, baseXP, exponent);
    }

    return level;
}

function getXPProgress(xp, baseXP = BASE_XP, exponent = EXPONENT) {
    const level = getLevelFromXP(xp, baseXP, exponent);
    let xpForCurrent = 0;

    for (let i = 1; i < level; i++) {
        xpForCurrent += xpForLevel(i, baseXP, exponent);
    }

    const xpForNext = xpForLevel(level, baseXP, exponent);

    return {
        level: level,
        current: xp - xpForCurrent,
        needed: xpForNext,
    }
}

module.exports = {
    xpForLevel,
    getLevelFromXP,
    getXPProgress
}