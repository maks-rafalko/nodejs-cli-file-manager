import { validateCommandLine } from '../commandLineValidator.js';
import osNative from 'node:os';
import { displayMessage, displayTable } from '../io.js';
import { OperationFailedError } from '../OperationFailedError.js';

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

    try {
        for (const [optionName, optionValue] of Object.entries(parsedCommandLine.options)) {
            if (optionValue) {
                optionsHandlerMapping[optionName]();
                break;
            }
        }
    } catch (error) {
        throw new OperationFailedError();
    }
}

function displayEolInfo() {
    displayMessage(`Default EOL: ${JSON.stringify(osNative.EOL)}`);
}

function displayCpusInfo() {
    const cpus = osNative.cpus();

    const cpusCores = osNative.cpus().map((cpu) => {
        return {
            model: cpu.model,
            speed: `${cpu.speed / GHZ_IN_MHZ} GHz`
        }
    });

    displayMessage(`Number of CPUs: ${cpus.length}`);
    displayTable(cpusCores);
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