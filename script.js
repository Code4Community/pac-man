var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    map.createStaticLayer("Tile Layer 1", tileset);

    // The player and its settings
    player = this.physics.add.sprite(225, 88, 'pacman', 2);

    let pinkGhost = this.physics.add.sprite(195, 230, 'pink-ghost').setScale(0.2);
    let redGhost = this.physics.add.sprite(225, 230, 'red-ghost').setScale(0.05);
    let blueGhost = this.physics.add.sprite(255, 230, 'blue-ghost').setScale(0.2);
    let yellowGhost = this.physics.add.sprite(225, 185, 'yellow-ghost').setScale(0.2);

    ghosts = this.physics.add.group();
    ghosts.add(pinkGhost);
    ghosts.add(redGhost);
    ghosts.add(blueGhost);
    ghosts.add(yellowGhost);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3}),
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
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player with the platforms
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the dots, if he does call the eatDot function
    this.physics.add.overlap(player, dots, eatDot, null, this);
    this.physics.add.collider(player, ghosts, hitGhost, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.setVelocityY(0);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.setVelocityY(0);
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityX(0);        
        player.setVelocityY(-160);
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown) {
        player.setVelocityX(0);        
        player.setVelocityY(160);
        player.anims.play('down', true);
    }

    if(player.x > 440) {
        player.disableBody(true, true);
        player = this.physics.add.sprite(0, 232, 'pacman');

        player.setVelocityX(160);
        player.setVelocityY(0);

        player.anims.play('right', true);
    } else if (player.x < 0) {
        player.disableBody(true, true);
        player = this.physics.add.sprite(440, 232, 'pacman');

        player.setVelocityX(-160);
        player.setVelocityY(0);

        player.anims.play('left', true);
    }
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