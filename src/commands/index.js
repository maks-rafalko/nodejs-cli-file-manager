import { ls } from './ls.js';
import { cd } from './cd.js';
import { up } from './up.js';
import { cat } from './cat.js';
import { os } from './os.js';
import { hash } from './hash.js';
import { add } from './add.js';
import { rm } from './rm.js';
import { rename } from './rename.js';
import { cp } from './cp.js';
import { mv } from './mv.js';
import { compress } from './compress.js';
import { decompress } from './decompress.js';
import { exit } from './exit.js';
import { displayMessage } from '../io.js';

const defaultCommand = async () => {
    displayMessage('Invalid input');
}

const commands = {
    ls,
    cd,
    up,
    cat,
    os,
    hash,
    add,
    rm,
    rename,
    cp,
    mv,
    compress,
    decompress,
    '.exit': exit,
};

export const getCommand = (commandName) => {
    return commands[commandName] || defaultCommand;
}