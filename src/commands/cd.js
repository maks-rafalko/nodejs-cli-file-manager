import { validateCommandLine } from '../commandLineValidator.js';
import { assertFolderExists } from '../asserts.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { resolve, sep, join, isAbsolute } from 'node:path';

export const cd = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['directoryPath']});

    try {
        const targetPath = parsedCommandLine.arguments[0];
        const newCurrentDirCandidate = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

        await assertFolderExists(newCurrentDirCandidate);

        executionContext.currentDir = newCurrentDirCandidate;
    } catch (error) {
        throw new OperationFailedError();
    }
}

export const normalizeToAbsolutePath = (currentDir, targetPath) => {
    const appendedPath = `${targetPath}${sep}`;

    return isAbsolute(appendedPath) ? resolve(appendedPath) : resolve(join(currentDir, appendedPath));
}