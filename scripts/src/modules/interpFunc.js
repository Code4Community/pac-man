const DIRECTIONS = ['up', 'right', 'down', 'left'];


// import C4C from 'c4c-lib';
import moveObj from './moveFunc.js'

/**
 * Enumeration of the ghost colors for easy access.
 * 
 * @readonly
 * 
 */
export const colorEnum = {
    'yellow': 0,
    'pink': 1,
    'blue': 2,
    'red': 3
}

export const dirEnum = {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
}


const theme = {
    "&": {
        color: "black",
        backgroundColor: "white",
    },
    ".cm-content, .cm-gutter": {
        minHeight: "500px",
    }
};


/**
 * 
 * @param {Phaser.Game} game 
 */
export const createEventListeners  = (game) =>  {
    
    
    const codeEditor = document.getElementById('code-editor');
    // Set onclick event for document
    document.addEventListener('click', (event) => {
        // Check if codeEditor has class cm-focused
        if (codeEditor.getElementsByClassName('cm-editor')[0].classList.contains('cm-focused')) {
            // if so, enable keyboard
            game.input.keyboard.disableGlobalCapture();
        } else {
            // if not, disable keyboard
            game.input.keyboard.enableGlobalCapture();
        }
    });
}

export const createEditor= (c4c) => {
    
const codeEditor = document.getElementById('code-editor');
    c4c.Editor.create(codeEditor, theme);

}

export const initializeEditor = (c4c, runners) => {
    
    

    c4c.Interpreter.define('moveOne', (item , dir) => {
        return {ghost: item.toLowerCase(), func: moveGivenColor(dir)};
    });

    c4c.Interpreter.define('move', (dir) => {
        return {ghost: 'all', func: moveGivenColor(dir)};
    });

    c4c.Interpreter.define('getRandomDirection', () => {
       
        return DIRECTIONS[Math.floor(Math.random() * 4)];
    });

    // Define getDirectionToPacMan differently for each runner
    for (const runner in runners) {
        c4c.Interpreter.defineInNamespace(runners[runner].namespace, 'getDirectionToPacMan', () => {
            return direction(runner);
        });
    }

    c4c.Interpreter.define("rotate", () => {
        
        ghosts.children.iterate((child) => {
            for(let i = 0; i <= 90; i++) {
                //child.setAngle(i);
                setTimeout(function () {
                    child.setAngle(i);
                }, 5000);
                
            }
        })
    });

    c4c.Interpreter.define("returnTrue", () => {
        return true;
    });

    c4c.Interpreter.define("returnFalse", () => {
        return false;
    });
    
    // =====

    // c4c.Interpreter.define("randomDirection", () => {
    //     return {ghost: 'all', func: () => {
    //         var ranNum1 = Math.floor(Math.random() * 4);
    //         var ranNum2 = Math.floor(Math.random() * 4);
    //         var ranNum3 = Math.floor(Math.random() * 4);
    //         var ranNum4 = Math.floor(Math.random() * 4);

    //         let dir1 = dirEnum[ranNum1];
    //         let dir2 = dirEnum[ranNum2];
    //         let dir3 = dirEnum[ranNum3];
    //         let dir4 = dirEnum[ranNum4];
    //         //they all generate the same number, fix that

    //         let dir = [dir1, dir2, dir3, dir4];
    //         console.log(dir)

    //         let direction = dir.map((d) => getDir(d))
    //         // console.log(direction, "my function")

    //         for (let color in colorEnum) {
    //             let ghost = getGhost(color);
    //             moveObj.setNextMove(ghost, ...direction[colorEnum[color]])
    //         }
            
    //     }}
    // })

    // =====


}




function moveGivenColor(dir) {
    return (color) => {
        // Color unused because we already know it
        let litem = color.toLowerCase();

        let direction = getDir(dir.toLowerCase());
        //console.log(direction[0])

        moveObj.setNextMove(getGhost(litem), ...direction);
    }
}

// ==== OLD INTERP FUNCTIONS, ADD THE ONES WE WANT
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
function isEatingGhosts() {
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


function getGhost(litem) {
    var redChild = ghosts.children.entries[1]
            var pinkChild = ghosts.children.entries[0]
            var blueChild = ghosts.children.entries[2]
            var yellowChild = ghosts.children.entries[3]
    if(litem == 'pink'){
        return pinkChild
    } else if(litem == 'blue'){
        return blueChild
    }
    else if(litem == 'yellow'){
        return yellowChild
    }
    else if(litem == 'red'){
        return redChild
    }
    else{
        return '[*] Error'
    }
}

function getDir(ldir) {
    if(ldir == 'down'){
        let cords = 'y'
        let ldir = 1
        return [cords , ldir]
    } else if(ldir == 'left'){
        let cords = 'x'
        let ldir = -1
        return [cords , ldir]
    }
    else if(ldir == 'right'){
        let cords = 'x'
        let ldir = 1
        return [cords , ldir]
    }
    else if (ldir == 'up'){
        let cords = 'y'
        let ldir = -1
        return [cords , ldir]
    }
}


// Scan code to see if works
function scanCode(code) {
    return works
}
