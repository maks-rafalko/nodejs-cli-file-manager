import readline from 'node:readline';
import osNative from 'node:os';
import { parseCommandLineArguments, extractCommandAndArguments, NOT_MEANINGFUL_ARG_COUNT} from './commandParser.js';
import { displayMessage } from './io.js';
import { getCommand } from './commands/index.js';
import { InvalidInputError } from './InvalidInputError.js';
import { OperationFailedError } from './OperationFailedError.js';

const meaningfulArgs = process.argv.slice(NOT_MEANINGFUL_ARG_COUNT);
const optionsWithValues = parseCommandLineArguments(meaningfulArgs);

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'fs > ',
});

const executionContext = {
    homeDir: osNative.homedir(),
    currentDir: osNative.homedir(),
    readLine,
};

const username = optionsWithValues.options['--username'] || 'Guest';

displayMessage(`Welcome to the File Manager, ${username}!`);
displayMessage(`You are currently in ${executionContext.currentDir}`);

readLine.prompt();

readLine
    .on('line', async (line) => {
        try {
            const [rawCommand, args] = extractCommandAndArguments(line.trim());
            const parsedCommandLine = parseCommandLineArguments(args);

            const executionCommand = getCommand(rawCommand);

            await executionCommand(executionContext, parsedCommandLine);
        } catch (error) {
            if (error instanceof InvalidInputError || error instanceof OperationFailedError) {
                displayMessage(error.message);
            } else {
                console.error(error);
            }
        }

        displayMessage(`You are currently in ${executionContext.currentDir}`);

        readLine.prompt();
    })
    .on('close', () => {
        displayMessage(`Thank you for using File Manager, ${username}, goodbye!`);
        process.exit(0);
    });
