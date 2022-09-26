import C4C from 'c4c-editor-and-interpreter';
import moveObj from './moveFunc.js'

const codeEditor = document.getElementById('code-editor');

/*

0 = pink 
1 = red
2 = blue
3 = yellow

*/


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



// Get text from editor

/* 

var newText == text from editor;

function on codeEdit(){

    if(newText.startsWith('example') || newText.includes('key Phrases')){
        C4C function to move ghost...
    } else {
        return 'Sorry that code is... try looking at the help section on the right!'; 
    }
}


*/

//======

C4C.Interpreter.define("moveUp", () => {
    ghosts.children.iterate((child) => {
        moveObj.setNextMove(child, 'y', -1);
    })
});

C4C.Interpreter.define("moveDown", () => {
    ghosts.children.iterate((child) => {
        moveObj.setNextMove(child, 'y', 1);
    })
});

C4C.Interpreter.define("moveLeft", () => {
    ghosts.children.iterate((child) => {
        moveObj.setNextMove(child, 'x', -1);
    })
});

C4C.Interpreter.define("moveRight", () => {
    ghosts.children.iterate((child) => {
        moveObj.setNextMove(child, 'x', 1);
    })
});

C4C.Interpreter.define("rotate", () => {
    ghosts.children.iterate((child) => {
        for(let i = 0; i <= 90; i++) {
            //child.setAngle(i);
            setTimeout(function () {
                child.setAngle(i);
            }, 5000);
            
        }
    })
});


// =====



C4C.Interpreter.define("moveRedLeft", (item) => {
    var redChild = ghosts.children.entries[1]
    moveObj.setNextMove(redChild, 'x' , -item);
});
C4C.Interpreter.define("moveRedRight", (item) => {
    var redChild = ghosts.children.entries[1]
    moveObj.setNextMove(redChild, 'x' , item);
});
C4C.Interpreter.define("moveRedUp", (item) => {
    var redChild = ghosts.children.entries[1]
    moveObj.setNextMove(redChild, 'y' , -item);
});
C4C.Interpreter.define("moveRedDown", (item) => {
    var redChild = ghosts.children.entries[1]
    moveObj.setNextMove(redChild, 'y' , item);
});