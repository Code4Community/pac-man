import C4C from 'c4c-editor-and-interpreter';
import moveObj from './moveFunc.js'

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

