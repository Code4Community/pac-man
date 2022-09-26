const DIRECTIONS = ['up', 'right', 'down', 'left'];

function direction(color, offset = 0) {
    let ghost = getGhost(color);
    let dists = [player.body.position.x - ghost.body.position.x, player.body.position.y - ghost.body.position.y];
    let angle = Math.atan2(dists[1], dists[0]) * 180 / Math.PI;
    angle += offset;
    if (angle > 180) angle -= 360;
    else if (angle < -180) angle += 360;
    // Check directions
    if (angle > -45 && angle <= 45)
        return 'right';
    else if (angle > 45 && angle <= 135)
        return 'down';
    else if (angle > 135 || angle < -135)
        return 'left';
    else
        return 'up';
}

function pickRandomDirection() {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

module.exports = {
    direction : direction,
    pickRandomDirection : pickRandomDirection
}