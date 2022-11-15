// Ghost functions

function getGhost(color , ghosts) {
    return ghosts.children.entries.find(ghost => ghost.color == color);
}

function setGhostSize(ghosts, powerful=false) {
    ghosts.children.entries.forEach(ghost => {
        setGhostNormal(ghost);

        if (powerful) {
            // Apparently the sprite scaling affects how the body size is done, basically
            // Phaser sucks
            ghost.setSize(320, 320);
        }
        
    });
}

function setGhostNormal(ghost) {
    // Set ghost size
    ghost.setDisplaySize(16, 16);

    // Changing the body size.  Don't ask me why this works: it shouldn't. 
    // The size should be 32 by 32 but that's too big, and 16 by 16 is too small...
    ghost.setSize(24, 24);

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
    ghosts.children.entries.forEach(ghost => {
        ghost.setTexture(ghost.color + '-ghost').setScale(1);
    });
    
    setGhostSize(ghosts, false);

    player.isPowerful = false;
}

function enableGhost(ghost) {
    ghost.setTexture(ghost.color + '-ghost').setScale(1);
    setGhostNormal(ghost, false);

}

const centerX = 225;
const centerY = 230;

/**
 * 
 * @param {Phaser.Physics.Arcade.Image} ghost 
 */
function respawnGhost (ghost) {
    // Stop displaying the ghost
    ghost.setActive(false).setVisible(false);

    // Reset the ghost's position
    ghost.x = centerX;
    ghost.y = centerY;

    // Reactive the ghost after 2 seconds
    setTimeout(() => {
        enableGhost(ghost);
        ghost.setVisible(true);
        setTimeout(() =>
            ghost.setActive(true).enableBody(), 1000);
    }, 1000);

}   


module.exports = {
    enableGhosts,
    setGhostSize,
    isMoving,
    moveGhost,
    scaryPacMan,
    distance,
    respawnGhost
}