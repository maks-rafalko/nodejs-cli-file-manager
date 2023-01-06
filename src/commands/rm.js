import { rm as rmNative } from 'node:fs/promises';
import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { assertFolderDoesNotExist } from '../asserts.js';
import { OperationFailedError } from '../OperationFailedError.js';

export const rm = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];
    const resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        await assertFolderDoesNotExist(resultPath);

        await rmNative(resultPath);
    } catch (error) {
        throw new OperationFailedError();
    }
};
