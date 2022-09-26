// Ghost functions

function getGhost(color , ghosts) {
    return ghosts.children.entries.find(ghost => ghost.color == color);
}

function setGhostSize(ghosts) {
    ghosts.children.entries.forEach(ghost => {
        ghost.setSize(16, 16);
        ghost.setDisplaySize(16, 16);
    });
}

function isMoving(ghost) {
    if (Math.abs(ghost.velocity) > 0) {
        return true;
    } else {
        return false;
    }
}

function moveGhost(color, direction) {
    switch (direction) {
        case 'up':
            moveObj.moveUp(getGhost(color));
            break;
        case 'right':
            moveObj.moveRight(getGhost(color));
            break;
        case 'down':
            moveObj.moveDown(getGhost(color));
            break;
        case 'left':
            moveObj.moveLeft(getGhost(color));
            break;
    }
}

function scaryPacMan() {
    return /*SOMETHING*/;
}

function distance(color) {
    let xDist = player.body.position.x - getGhost(color).body.position.x;
    let yDist = player.body.position.y - getGhost(color).body.position.y;
    let totalDist = Math.pow(xDist, 2) + Math.pow(yDist, 2);
    return Math.sqrt(totalDist);
}

function enableGhosts() {
    getGhost('pink'  , ghosts).setTexture('pink-ghost').setScale(1);
    getGhost('red'   , ghosts).setTexture('red-ghost').setScale(1);
    getGhost('yellow', ghosts).setTexture('yellow-ghost').setScale(1);
    getGhost('blue'  , ghosts).setTexture('blue-ghost').setScale(1);
    setGhostSize(ghosts);

    player.isPowerful = false;
}


module.exports = {
    enableGhosts , enableGhosts,
    setGhostSize : setGhostSize,
    isMoving : isMoving,
    moveGhost : moveGhost,
    scaryPacMan : scaryPacMan,
    distance : distance,
}