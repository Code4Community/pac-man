function createDots(realThis, positions) {
    let dots = realThis.physics.add.group();

    for (let i = 0; i < positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0], positions[i][1], 'dot');
        dots.add(newDot);
    }
    return dots;
}

function createGhostDots(realThis, positions) {
    let ghostDots = realThis.physics.add.group();

    for (let i = 0; i < positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0], positions[i][1], 'ghost-dot').setScale(0.02);
        ghostDots.add(newDot);
    }
    return ghostDots;
}


module.exports = {
    createDots: createDots,
    createGhostDots: createGhostDots
}