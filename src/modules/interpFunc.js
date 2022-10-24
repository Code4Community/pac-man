// import C4C from 'c4c-editor-and-interpreter';
import moveObj from './moveFunc.js'


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

export const initializeEditor = (c4c) => {
    
    c4c.Interpreter.define('move', (item , dir) => {
        

        let litem = item.toLowerCase()
        let ldir = dir.toLowerCase()

        var redChild = ghosts.children.entries[1]
        var pinkChild = ghosts.children.entries[0]
        var blueChild = ghosts.children.entries[2]
        var yellowChild = ghosts.children.entries[3]

        function getGhost(litem) {
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
        
        let direction = getDir(ldir)
        //console.log(direction[0])

        if(litem == 'all'){
        ghosts.children.iterate((litem) => {
            moveObj.setNextMove(litem, direction[0], direction[1]);
        })
        }else{
            moveObj.setNextMove(getGhost(litem), direction[0], direction[1]);
        }
    });



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
    
}
// =====