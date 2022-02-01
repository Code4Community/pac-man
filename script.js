var config = {
    type: Phaser.AUTO,
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
const GHOST_SPEED = 2;

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

function preload ()
{
    this.load.image('ground', 'assets/platform.png');
    this.load.image('dot', 'assets/dot.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('pink-ghost', 'assets/pink-ghost.png', { width: 5, height: 5 });
    this.load.image('red-ghost', 'assets/red-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('blue-ghost', 'assets/blue-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('yellow-ghost', 'assets/yellow-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('pacman', 'assets/pacman.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('tiles', 'assets/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
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

    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(ghosts, worldLayer)

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
    //  The dots are 4 by 4, evenly spaced 20 pixels apart in the x or y direction
    positionsArray = [
        [100, 120],
        [100, 140],
        [100, 160],
        [100, 180],

        [120, 120],
        [140, 120],
        [160, 120],
        [180, 120],

        [180, 100],
        [180, 80],

    ];
    dots = createDots(this,positionsArray);


    //  The score
    scoreText = this.add.text(0, 510, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Collide the player with the platforms
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the dots, if he does call the eatDot function
    this.physics.add.overlap(player, dots, eatDot, null, this);
    this.physics.add.collider(player, ghosts, hitGhost, null, this);
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
    

    if(player.x > 440) {
        player.setPosition(0,232);
    } else if (player.x < 0) {
        player.setPosition(440, 232);
    }
}

function processNextMove (sprite, speed) {
    if (sprite.nextMove) {
        
        if (sprite.nextMove.sign * sprite.body.velocity[sprite.nextMove.dir] > 0) {
            if (sprite.nextMove.dir == 'x') {
                sprite.setVelocityY(0);
                sprite.setAngle(sprite.nextMove.sign == 1 ? 0 : 180);
            } else {
                sprite.setVelocityX(0);
                sprite.setAngle(sprite.nextMove.sign == 1 ? 90 : 270);
            }
            sprite.anims.play('chomp', true);
            
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

function distance(player, ghost)
{
    return distanceBetween(player, ghost)
}


