import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from "../OperationFailedError.js";
import { displayMessage } from '../io.js';
import { folderExists, normalizeToAbsolutePath } from '../fsFunctions.js';

const sha256AsHex = (content) => createHash('sha256').update(content).digest('hex');

export const hash = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];

    const resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        await assertPathIsNotDirectory(resultPath);

        const fileBuffer = await readFile(resultPath);

        const hex = sha256AsHex(fileBuffer);

        displayMessage(`SHA-256 of file "${resultPath}": ${hex}`);
    } catch (error) {
        throw new OperationFailedError();
    }
}

const assertPathIsNotDirectory = async (path) => {
    const isFolderExists = await folderExists(path);

    if (isFolderExists) {
        throw new OperationFailedError();
    }
}