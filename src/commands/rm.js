import { rm as rmNative, stat } from 'node:fs/promises';
import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { validateCommandLine } from "../commandLineValidator.js";

export const rm = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];

    let resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    if (!await fileExists(resultPath)) {
        throw new OperationFailedError();
    }

    const fileStats = await stat(resultPath);

    if (fileStats.isDirectory()) {
        throw new OperationFailedError();
    }

    await rmNative(resultPath);
};
