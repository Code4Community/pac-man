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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ground', 'assets/platform.png');
    this.load.image('dot', 'assets/dot.png');
    this.load.image('ghost-dot', 'assets/ghost-dot.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('pink-ghost', 'assets/pink-ghost.png', { width: 5, height: 5 });
    this.load.image('red-ghost', 'assets/red-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('blue-ghost', 'assets/blue-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('yellow-ghost', 'assets/yellow-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('vulnerable-ghost', 'assets/vulnerable-ghost.webp', { frameWidth: 32, frameHeight: 48 });
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

    let pinkGhost = this.physics.add.sprite(195, 230, 'pink-ghost').setScale(0.2);
    let redGhost = this.physics.add.sprite(225, 230, 'red-ghost').setScale(0.05);
    let blueGhost = this.physics.add.sprite(255, 230, 'blue-ghost').setScale(0.2);
    let yellowGhost = this.physics.add.sprite(225, 185, 'yellow-ghost').setScale(0.2);

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
        key: 'left',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  DOTS
    //  The dots are 4 by 4, evenly spaced 20 pixels apart in the x or y direction
    positionsArray = [
        [105, 170],
        [105, 150],
        [105, 130],
        [105, 110],
        [105, 90],

        [120, 90],
        [140, 90],
        [160, 90],
        [180, 90],
        [200, 90],

        //[200, 70],
        [200, 50],
        [200, 30],

    ];
    dots = createDots(this,positionsArray);

    //  EAT GHOST DOTS
    ghostDotsPositionsArray = [
        [200, 70],
    ];

    ghostDots = createGhostDots(this,ghostDotsPositionsArray);

    //  The score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Collide the player with the platforms
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the normal dots, if he does call the eatDot function
    this.physics.add.overlap(player, dots, eatDot, null, this);
    //  Checks to see if the player overlaps with any of the eat-ghost powerup dots, if he does call the eatGhostDot function
    this.physics.add.overlap(player, ghostDots, eatGhostDot, null, this);
    this.physics.add.collider(player, ghosts, hitGhost, null, this).name = 'hit_ghost_collider';
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
        player.setAngle(180);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.setVelocityY(0);
        player.anims.play('right', true);
        player.setAngle(0);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityX(0);        
        player.setVelocityY(-160);
        player.anims.play('up', true);
        player.setAngle(270);
    }
    else if (cursors.down.isDown) {
        player.setVelocityX(0);        
        player.setVelocityY(160);
        player.anims.play('down', true);
        player.setAngle(90);
    }

    if(player.x > 440) {
        player.setPosition(0,232);
    } else if (player.x < 0) {
        player.setPosition(440, 232);
    }
}

function eatDot (player, dot)
{
    dot.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

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

    // Change all ghost images to blue vulnerable ghost
    ghosts.children.iterate((child) => {
        child.setTexture('vulnerable-ghost').setScale(.07);
    });

    // Remove collider where player dies if it hits a ghost
    this.physics.world.colliders.getActive().find(function(i){
        return i.name == 'hit_ghost_collider'
    }).destroy();

    // Add collider where player can eat ghosts
    this.physics.add.collider(player, ghosts, eatGhost, null, this);

    //  Add and update the score
    score += 50;
    scoreText.setText('Score: ' + score);

    setTimeout(enableGhosts, 1000);

    /*if (dots.countActive(true) === 0)
    {
        //  Create new batch of dots to collect
        dots = createDots(this, positionsArray);
        ghostDots = createGhostDots(this, ghostDotsPositionsArray);
        this.physics.add.overlap(player, dots, eatDot, null, this);
        this.physics.add.overlap(player, ghostDots, eatGhostDot, null, this);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }*/
}

function eatGhost (player, ghost)
{
    ghost.disableBody(true, true);

    //  Add and update the score
    score += 50;
    scoreText.setText('Score: ' + score);
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

function createGhostDots (realThis, positions) {
    let ghostDots = realThis.physics.add.group();
    
    for(let i = 0; i<positions.length; i++) {
        let newDot = realThis.physics.add.sprite(positions[i][0],positions[i][1], 'ghost-dot').setScale(0.02);
        ghostDots.add(newDot);
    }
    return ghostDots;
}

function enableGhosts() {
    // Change all ghost images to blue vulnerable ghost
    ghosts.children.iterate((child) => {
        child.setTexture('pink-ghost');
    });

    // Remove collider where player can eat ghosts
    this.physics.world.colliders.getActive().find(function(i){
        return i.name == 'eat_ghost_collider'
    }).destroy();

    // Add collider where player can eat ghosts
    this.physics.add.collider(player, ghosts, hitGhost, null, this);
}