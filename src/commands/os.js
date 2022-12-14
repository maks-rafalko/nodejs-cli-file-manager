import { validateCommandLine } from '../commandLineValidator.js';
import osNative from 'node:os';
import { displayMessage } from '../io.js';

const GHZ_IN_MHZ = 1000;

const optionsHandlerMapping = {
    '--EOL': displayEolInfo,
    '--cpus': displayCpusInfo,
    '--homedir': displayHomedirInfo,
    '--username': displayUsernameInfo,
    '--architecture': displayArchitectureInfo,
};

export const os = async (executionContext, parsedCommandLine) => {
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

function displayEolInfo() {
    displayMessage(`Default EOL: ${JSON.stringify(osNative.EOL)}`);
}

function displayCpusInfo() {
    const cpus = osNative.cpus();

    displayMessage(`Number of CPUs: ${cpus.length}`);

    osNative.cpus().forEach((cpu, index) => {
        displayMessage(`    CPU #${index + 1}. Model: ${cpu.model} speed: ${cpu.speed / GHZ_IN_MHZ} GHz`);
    });
}

function displayHomedirInfo() {
    displayMessage(`Home directory: ${osNative.homedir()}`);
}

function displayUsernameInfo() {
    displayMessage(`System user name: ${osNative.userInfo().username}`);
}

function displayArchitectureInfo() {
    displayMessage(`Architecture: ${osNative.arch()}`);
}