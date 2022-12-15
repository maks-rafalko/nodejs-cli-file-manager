import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { assertFolderExists } from '../asserts.js';
import { OperationFailedError } from '../OperationFailedError.js';

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