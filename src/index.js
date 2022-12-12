import readline from 'node:readline';
import osNative from 'node:os';
import { parseCommandLineArguments, extractCommandAndArguments, NOT_MEANINGFUL_ARG_COUNT} from './commandParser.js';
import { displayMessage } from './io.js';
import { ls } from './commands/ls.js';
import { cd } from './commands/cd.js';
import { up } from './commands/up.js';
import { cat } from './commands/cat.js';
import { os } from './commands/os.js';
import { hash } from './commands/hash.js';
import { add } from './commands/add.js';
import { rm } from './commands/rm.js';
import { rename } from './commands/rename.js';
import { cp } from './commands/cp.js';
import { mv } from './commands/mv.js';
import { compress } from './commands/compress.js';
import { decompress } from './commands/decompress.js';
import { InvalidInputError } from './InvalidInputError.js';
import { OperationFailedError } from './OperationFailedError.js';

const meaningfulArgs = process.argv.slice(NOT_MEANINGFUL_ARG_COUNT);
const optionsWithValues = parseCommandLineArguments(meaningfulArgs);

// todo read carefully about home/root directory
const username = optionsWithValues.options['--username'] || 'Guest';
const executionContext = {
    homeDir: osNative.homedir(),
    currentDir: osNative.homedir(),
};

displayMessage(`Welcome to the File Manager, ${username}!`);

displayMessage(`You are currently in ${executionContext.currentDir}`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'fs > ',
});

rl.prompt();

rl
    .on('line', async (line) => {
        const [command, args] = extractCommandAndArguments(line.trim());

        const parsedCommandLine = parseCommandLineArguments(args);

        try {
            switch (command) {
                case 'add':
                    await add(executionContext, parsedCommandLine);
                    break;
                case 'rm':
                    await rm(executionContext, parsedCommandLine);
                    break;
                case 'rn':
                    await rename(executionContext, parsedCommandLine);
                    break;
                case 'cp':
                    await cp(executionContext, parsedCommandLine);
                    break;
                case 'mv':
                    await mv(executionContext, parsedCommandLine);
                    break;
                case 'ls':
                    await ls(executionContext, parsedCommandLine);
                    break;
                case 'cd':
                    await cd(executionContext, parsedCommandLine);
                    break;
                case 'up':
                    await up(executionContext, parsedCommandLine);
                    break;
                case 'cat':
                    await cat(executionContext, parsedCommandLine);
                    break;
                case 'os':
                    await os(executionContext, parsedCommandLine);
                    break;
                case 'hash':
                    await hash(executionContext, parsedCommandLine);
                    break;
                case 'compress':
                    await compress(executionContext, parsedCommandLine);
                    break;
                case 'decompress':
                    await decompress(executionContext, parsedCommandLine);
                    break;
                case '.exit':
                    rl.close();
                    break;
                default:
                    // command is not recognized, do nothing and ask the input again
                    displayMessage('Invalid input');
                    break;
            }
        } catch (error) {
            if (error instanceof InvalidInputError || error instanceof OperationFailedError) {
                displayMessage(error.message);
            } else {
                console.error(error);
            }
        }

        displayMessage(`You are currently in ${executionContext.currentDir}`);

        rl.prompt();
    })
    .on('close', () => {
        displayMessage(`Thank you for using File Manager, ${username}, goodbye!`);
        process.exit(0);
    });
