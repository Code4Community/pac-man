

function processNextMove(sprite, speed, isGhost = false) {
    if (sprite.nextMove) {

        if (sprite.nextMove.sign * sprite.body.velocity[sprite.nextMove.dir] > 0) {
            if (sprite.nextMove.dir == 'x') {
                sprite.setVelocityY(0);
                sprite.y = Math.round(sprite.y);
                sprite.setVelocityX(speed * sprite.nextMove.sign);
                if (!isGhost) sprite.setAngle(sprite.nextMove.sign == 1 ? 0 : 180);
            } else {
                sprite.setVelocityX(0);
                sprite.setVelocityY(speed * sprite.nextMove.sign);
                sprite.x = Math.round(sprite.x);
                if (!isGhost) sprite.setAngle(sprite.nextMove.sign == 1 ? 90 : 270);
            }
            if (!isGhost) sprite.anims.play('chomp', true);


        } else {
            move(sprite, speed);
        }
    }
}

function setNextMove(sprite, direction, sign) {
    sprite.nextMove = {
        dir: direction,
        sign: sign
    };
}

function move(sprite, speed) {
    if (sprite.nextMove.dir == 'x')
        sprite.setVelocityX(speed * sprite.nextMove.sign);
    else
        sprite.setVelocityY(speed * sprite.nextMove.sign);
}

function moveRight(sprite) {
    setNextMove(sprite, 'x', 1);
}

function moveLeft(sprite) {
    setNextMove(sprite, 'x', -1);
}

function moveUp(sprite) {
    setNextMove(sprite, 'y', -1);
}

function moveDown(sprite) {
    setNextMove(sprite, 'y', 1);
}

module.exports = {
    setNextMove: setNextMove,
    processNextMove: processNextMove,
    move: move,
    moveRight: moveRight,
    moveLeft: moveLeft,
    moveDown: moveDown,
    moveUp: moveUp,
};