import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import {validateCommandLine} from '../commandLineValidator.js';

export const cd = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['directoryPath']});

    const targetPath = parsedCommandLine.arguments[0];

    let newCurrentDirCandidate = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    if (! await fileExists(newCurrentDirCandidate)) {
        throw new OperationFailedError();
    }

    executionContext.currentDir = newCurrentDirCandidate;
}