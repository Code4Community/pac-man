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
var stars;
var bombs;
var platforms;
var cursors;
var score = 20;
var gameOver = false;
var scoreText;
var pinkGhost;
var redGhost;
var blueGhost;
var yellowGhost;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('pink-ghost', 'assets/pink-ghost.png', { width: 5, height: 5 });
    this.load.image('red-ghost', 'assets/red-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('blue-ghost', 'assets/blue-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('yellow-ghost', 'assets/yellow-ghost.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('pacman', 'assets/pacman.png', { frameWidth: 32, frameHeight: 32 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'pacman');
    pinkGhost = this.physics.add.sprite(150, 450, 'pink-ghost');
    pinkGhost.setScale(0.2);
    redGhost = this.physics.add.sprite(200, 550, 'red-ghost');
    redGhost.setScale(0.05);
    blueGhost = this.physics.add.sprite(300, 350, 'blue-ghost');
    blueGhost.setScale(0.2);
    yellowGhost = this.physics.add.sprite(400, 250, 'yellow-ghost');
    yellowGhost.setScale(0.2);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'pacman', frame: 1 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
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
    else
    {

        player.anims.play('turn');
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
