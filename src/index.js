// Constant for directions string and ghost colors
import Phaser from "phaser";
import platform from './assets/platform.png'
import dot from './assets/dot.png'
import dude from './assets/dude.png'
import pink_ghost from './assets/pink-ghost.png'
import red_ghost from './assets/red-ghost.png'
import blue_ghost from './assets/blue-ghost.png'
import yellow_ghost from './assets/yellow-ghost.png'
import pacman from './assets/pacman.png'
import tiles from './assets/tiles.png'
import asset_map from './assets/map.json'


const DIRECTIONS = ['up', 'right', 'down', 'left'];
const GHOSTS = ['pink', 'red', 'blue', 'yellow'];

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 450,
    height: 550,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const PLAYER_SPEED = 160;
const GHOST_SPEED = 80;

var player;
var dots;
var ghosts;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var positionsArray;

var map;
var tileset;
var worldLayer;

var game = new Phaser.Game(config);

const TILE_SIZE = 16
document.getElementById('start-over').addEventListener('click', () => {
    game.destroy(true);
    game = new Phaser.Game(config);
});

function preload ()
{
    this.load.image('ground', platform);
    this.load.image('dot', dot);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
    this.load.image('pink-ghost', pink_ghost, { frameWidth: 32, frameHeight: 32 });
    this.load.image('red-ghost', red_ghost, { frameWidth: 32, frameHeight: 32 });
    this.load.image('blue-ghost', blue_ghost, { frameWidth: 32, frameHeight: 32 });
    this.load.image('yellow-ghost', yellow_ghost, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('pacman', pacman, { frameWidth: 32, frameHeight: 32 });

    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', asset_map);
}

function create ()
{
    map = this.make.tilemap({ key: "map" });
    tileset = map.addTilesetImage("blueTiles", 'tiles');
    worldLayer = map.createStaticLayer('Tile Layer 1', tileset);
    worldLayer.setCollisionByExclusion(-1, true);

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point 1");

    // The player and its settings
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'pacman').setScale(.5);
    player.nextMove = null;

    let pinkGhost = this.physics.add.sprite(195, 230, 'pink-ghost').setScale(0.1);
    let redGhost = this.physics.add.sprite(225, 230, 'red-ghost').setScale(0.025);
    let blueGhost = this.physics.add.sprite(255, 230, 'blue-ghost').setScale(0.1);
    let yellowGhost = this.physics.add.sprite(225, 185, 'yellow-ghost').setScale(0.1);

    ghosts = this.physics.add.group();
    ghosts.add(pinkGhost);
    ghosts.add(redGhost);
    ghosts.add(blueGhost);
    ghosts.add(yellowGhost);

    {
        let i = 0;
        ghosts.children.entries.forEach(ghost => ghost.color = GHOSTS[i++]);
    }

    
    

    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(ghosts, worldLayer);

    

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'chomp',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  DOTS
    //  The dots are 4 by 4. One is placed per tile in tilemap. Tiles are 16px, dots are placed in the center of tile
    positionsArray = [];

    // iterates through each tile on tilemap, checks if there is not a tile (or blocked location), and draws
    let count = 0;
    for (let i = 1; i < map.width; i++) {
        for (let j = 1; j < map.height; j++){
            // checking if tile exists at centered position of current tile
            let centeredPosX = (i * TILE_SIZE) + (TILE_SIZE / 2); 
            let centeredPosY = (j * TILE_SIZE) + (TILE_SIZE / 2);
            let currentTile = map.getTileAt(i,j);

            if (currentTile === null){
                positionsArray.push([centeredPosX, centeredPosY]);
            }
        }
    }

    dots = createDots(this,positionsArray);


    //  The score
    scoreText = this.add.text(0, 510, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Collide the player with the platforms
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the dots, if he does call the eatDot function
    this.physics.add.overlap(player, dots, eatDot, null, this);
    this.physics.add.collider(player, ghosts, hitGhost, null, this);

    // Set ghost sizes TODO ---------------------
}

function update () {
    if (gameOver) {
        return;
    }
    if (cursors.left.isDown) {
        moveLeft(player);
    }
    else if (cursors.right.isDown) {
        moveRight(player);
    }
    else if (cursors.up.isDown) {
        moveUp(player);
    }
    else if (cursors.down.isDown) {
        moveDown(player);
    }

    processNextMove(player, PLAYER_SPEED);

    ghosts.children.entries.forEach(ghost => processNextMove(ghost, GHOST_SPEED, true));

    if(player.x > 440) {
        player.setPosition(0,232);
    } else if (player.x < 0) {
        player.setPosition(440, 232);
    }
}

function processNextMove (sprite, speed, isGhost = false) {
    if (sprite.nextMove) {
        
        if (sprite.nextMove.sign * sprite.body.velocity[sprite.nextMove.dir] > 0) {
            if (sprite.nextMove.dir == 'x') {
                sprite.setVelocityY(0);
                if (!isGhost) sprite.setAngle(sprite.nextMove.sign == 1 ? 0 : 180);
            } else {
                sprite.setVelocityX(0);
                if (!isGhost) sprite.setAngle(sprite.nextMove.sign == 1 ? 90 : 270);
            }
            if (!isGhost) sprite.anims.play('chomp', true);
            
            sprite.nextMove = null;
        } else {
            move(sprite, speed);

        }
    }
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


function setNextMove (sprite, direction, sign) {
    sprite.nextMove = {
        dir: direction,
        sign: sign
    };
}

function eatDot (player, dot)
{
    dot.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (dots.countActive(true) === 0)
    {
        //  Create new batch of dots to collect
        dots = createDots(this, positionsArray);
        this.physics.add.overlap(player, dots, eatDot, null, this);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
}

function hitGhost (player, ghost)
{
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = true;
}

function createDots (realThis, positions) {
    let dots = realThis.physics.add.group();
    
    for(let i = 0; i<positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0],positions[i][1], 'dot');
        dots.add(newDot);
    }
    
    return dots;
}


function move (sprite, speed) {
    if (sprite.nextMove.dir == 'x')
        sprite.setVelocityX(speed * sprite.nextMove.sign);
    else
        sprite.setVelocityY(speed * sprite.nextMove.sign);
}

function isMoving(ghost)
{
    if (Math.abs(ghost.velocity) > 0)
    {
        return true;
    } else {
        return false;
    }
}






// Ghost functions:


// Helper function to return a specific ghost
function getGhost(color) {
    return ghosts.children.entries.find(ghost=>ghost.color == color);
}



// move(pink, left)
 
function moveGhost(color, direction) {
    switch (direction) {
        case 'up':
            moveUp(getGhost(color));
            break;
        case 'right':
            moveRight(getGhost(color));
            break;
        case 'down':
            moveDown(getGhost(color));
            break;
        case 'left':
            moveLeft(getGhost(color));
            break;
    }
}


// isEatingGhosts()

function scaryPacMan() {
    return /*SOMETHING*/;
}

// distance(pink)
function distance (color) {
    let xDist = player.body.position.x - getGhost(color).body.position.x;
    let yDist = player.body.position.y - getGhost(color).body.position.y;
    let totalDist = Math.pow(xDist, 2) + Math.pow(yDist, 2);
    return Math.sqrt(totalDist);
}

// direction()
// Gets the direction between the ghost of the given color and pac man
// Offset figues out how much to offset the axes
// For example, offset 0 will show the direction straight towards pacman, and offset 180 will return the direction away from pac man
// 90 degrees will be orthogonal in either direction
function direction (color, offset = 0) {
    let ghost = getGhost(color);
    let dists = [player.body.position.x - ghost.body.position.x, player.body.position.y - ghost.body.position.y];
    let angle = Math.atan2(dists[1],dists[0]) * 180 / Math.PI;
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


// pickRandomDirection()

function pickRandomDirection () {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}
