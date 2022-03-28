import Phaser from "phaser";
import C4C from 'c4c-editor-and-interpreter';

import platform from './assets/platform.png'
import dot from './assets/dot.png'
import ghost_dot from './assets/ghost-dot.png'
import pink_ghost from './assets/pink-ghost.webp'
import red_ghost from './assets/red-ghost.webp'
import blue_ghost from './assets/blue-ghost.webp'
import yellow_ghost from './assets/yellow-ghost.webp'
import vulnerable_ghost from './assets/vulnerable-ghost.webp'
import pacman from './assets/pacman.png'
import tiles from './assets/tiles.png'
import tile_map from './assets/map.json'
import munch_mp3 from './assets/waka-waka-munch-short.mp3'

// Constant for directions string and ghost colors
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

const PLAYER_SPEED = 80;
const GHOST_SPEED = 80;

var player;
var dots;
var ghostDots;
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

var munch;

var game = new Phaser.Game(config);

const TILE_SIZE = 16;
document.getElementById('start-over').addEventListener('click', () => {
    game.destroy(true);
    score = 0;
    gameOver = false;
    game = new Phaser.Game(config);
});

const codeEditor = document.getElementById('code-editor');
const theme = {
    "&": {
        color: "black",
        backgroundColor: "white",
    },
    ".cm-content, .cm-gutter": {
        minHeight: "500px",
    }
};

C4C.Editor.create(codeEditor, theme);

function preload ()
{
    this.load.image('ground', platform);
    this.load.image('dot', dot);
    this.load.image('ghost-dot', ghost_dot);
    this.load.image('pink-ghost', pink_ghost, { frameWidth: 32, frameHeight: 48 });
    this.load.image('red-ghost', red_ghost, { frameWidth: 32, frameHeight: 48 });
    this.load.image('blue-ghost', blue_ghost, { frameWidth: 32, frameHeight: 48 });
    this.load.image('yellow-ghost', yellow_ghost, { frameWidth: 32, frameHeight: 48 });
    this.load.image('vulnerable-ghost', vulnerable_ghost, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('pacman', pacman, { frameWidth: 32, frameHeight: 32 });

    this.load.audio('munch', munch_mp3);

    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', tile_map);
}

function create ()
{
    map = this.make.tilemap({ key: "map" });
    tileset = map.addTilesetImage("blueTiles", 'tiles');
    worldLayer = map.createStaticLayer('Tile Layer 1', tileset);
    worldLayer.setCollisionByExclusion(-1, true);

    munch = this.sound.add('munch');

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point 1");

    // The player and its settings
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'pacman').setScale(.5);
    player.nextMove = null;
    player.isPowerful = false;

    let pinkGhost = this.physics.add.sprite(195, 230, 'pink-ghost');
    let redGhost = this.physics.add.sprite(225, 230, 'red-ghost');
    let blueGhost = this.physics.add.sprite(255, 230, 'blue-ghost');
    let yellowGhost = this.physics.add.sprite(225, 185, 'yellow-ghost');

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
    this.physics.add.collider(player, dots);

    setGhostSize();

    //  Player physics properties. Give the little guy a slight bounce.
    // player.setCollideWorldBounds(true); -> this does not allow pipes to work

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
    for (let i = 1; i < map.width - 1; i++) {
        for (let j = 1; j < map.height -1; j++){
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

    //  EAT GHOST DOTS
    var ghostDotsPositionsArray = [
        [25, 40],[25, 380],[425,40],[425,380]
    ];

    ghostDots = createGhostDots(this,ghostDotsPositionsArray);

    //  The score
    scoreText = this.add.text(0, 510, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Collide the player with the platforms
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the normal dots, if he does call the eatDot function
    this.physics.add.overlap(player, dots, eatDot, null, this);
    //  Checks to see if the player overlaps with any of the eat-ghost powerup dots, if he does call the eatGhostDot function
    this.physics.add.overlap(player, ghostDots, eatGhostDot, null, this);
    this.physics.add.collider(player, ghosts, hitGhost, null, this);

    const isProduction = process.env.NODE_ENV == 'production';
    if (!isProduction) {
        window.player = player;
        window.ghosts = ghosts;
    }
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
    

    if(player.x > 450) {
        player.setPosition(0,232);
    } else if (player.x < -10) {
        player.setPosition(440, 232);
    }

    if (player.nextMove) {
        pipeBoundsCheck(player)
    }

    processNextMove(player, PLAYER_SPEED);
    player.x = Math.round(player.x);
    player.y = Math.round(player.y);
    ghosts.children.entries.forEach(ghost => processNextMove(ghost, GHOST_SPEED, true));
}

function pipeBoundsCheck(player){
    let direction = player.nextMove.dir
    let sign = player.nextMove.sign
    let tile;

    // get the current tile of the player
    let tileX = (Math.round(player.x) % map.width);
    let tileY = (Math.round(player.y) % map.height);

    console.log(map.getTileAt(tileX, tileY))

    /* get the tile that pacman wants to enter */
    if (direction == 'x'){
        if (sign == 1){
            tile = map.getTileAt(tileX + 1, tileY)
        } else if (sign == -1){
            map.getTileAt(tileX - 1, tileY)
        }
        
    } else if (direction == 'y'){
        if (sign == 1){
            map.getTileAt(tileX, tileY + 1)
        } else if (sign == -1){
            map.getTileAt(tileX + 1, tileY - 1)
        }
    }
}

function processNextMove (sprite, speed, isGhost = false) {
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

    // munch sound plays
    munch.play();

    if ((dots.countActive(true) === 0) && ghostDots.countActive(true) === 0)
    {
        dots = createDots(this, positionsArray);
        ghostDots = createGhostDots(this, ghostDotsPositionsArray);
        this.physics.add.overlap(player, dots, eatDot, null, this);
        this.physics.add.overlap(player, ghostDots, eatGhostDot, null, this);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}

function eatGhostDot (player, ghostDot)
{
    ghostDot.disableBody(true, true);

    //  Add and update the score
    score += 50;
    scoreText.setText('Score: ' + score);

    // Change all ghost images to blue vulnerable ghost
    ghosts.children.iterate((child) => {
        child.setTexture('vulnerable-ghost');
    });
    setGhostSize();

    // Make player able to eat ghosts
    player.isPowerful = true;

    // Remake dots if they're all eaten
    if ((dots.countActive(true) === 0) && ghostDots.countActive(true) === 0)
    {
        dots = createDots(this, positionsArray);
        ghostDots = createGhostDots(this, ghostDotsPositionsArray);
        this.physics.add.overlap(player, dots, eatDot, null, this);
        this.physics.add.overlap(player, ghostDots, eatGhostDot, null, this);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }

    setTimeout(enableGhosts, 4000);
}

function hitGhost (player, ghost)
{
    if(player.isPowerful) {
        ghost.disableBody(true, true);
    } else {
        this.physics.pause();

        player.setTint(0xff0000);
    
        gameOver = true;
    }
}

function createDots (realThis, positions) {
    let dots = realThis.physics.add.group();
    
    for(let i = 0; i<positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0],positions[i][1], 'dot');
        dots.add(newDot);
    }
    return dots;
}

function createGhostDots (realThis, positions) {
    let ghostDots = realThis.physics.add.group();
    
    for(let i = 0; i<positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0],positions[i][1], 'ghost-dot').setScale(0.02);
        ghostDots.add(newDot);
    }
    return ghostDots;
}

function enableGhosts() {
    getGhost('pink').setTexture('pink-ghost').setScale(1);
    getGhost('red').setTexture('red-ghost').setScale(1);
    getGhost('yellow').setTexture('yellow-ghost').setScale(1);
    getGhost('blue').setTexture('blue-ghost').setScale(1);
    setGhostSize();

    player.isPowerful = false;
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

function setGhostSize()
{
    ghosts.children.entries.forEach(ghost => {
        ghost.setSize(16,16);
        ghost.setDisplaySize(16,16);
    });
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
