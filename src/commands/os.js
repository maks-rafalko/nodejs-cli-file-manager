import { validateCommandLine } from '../commandLineValidator.js';
import osNative from 'node:os';
import { displayMessage } from '../io.js';

const GHZ_IN_MHZ = 1000;

export const os = async (executionContext, parsedCommandLine) => {
    // try to move outside
    const optionsHandlerMapping = {
        '--EOL': displayEolInfo,
        '--cpus': displayCpusInfo,
        '--homedir': displayHomedirInfo,
        '--username': displayUsernameInfo,
        '--architecture': displayArchitectureInfo,
    };

    validateCommandLine(parsedCommandLine, {
        requiredArguments: [],
        allowedOptions: Object.keys(optionsHandlerMapping),
        allowZeroOptions: false
    });

    for (const [optionName, optionValue] of Object.entries(parsedCommandLine.options)) {
        if (optionValue) {
            optionsHandlerMapping[optionName]();
            break;
        }
    }
}

const displayEolInfo = () => {
    displayMessage(`Default EOL: ${JSON.stringify(osNative.EOL)}`);
}

const displayCpusInfo = () => {
    const cpus = osNative.cpus();

    displayMessage(`Number of CPUs: ${cpus.length}`);
    displayMessage(`CPU Model: ${cpus[0].model}`);

    osNative.cpus().forEach((cpu, index) => {
        displayMessage(`    CPU core #${index + 1} speed: ${cpu.speed / GHZ_IN_MHZ} GHz`);
    });
}

const displayHomedirInfo = () => displayMessage(`Home directory: ${osNative.homedir()}`);

const displayUsernameInfo = () => displayMessage(`Username: ${osNative.userInfo().username}`);

const displayArchitectureInfo = () => displayMessage(`Architecture: ${osNative.arch()}`);