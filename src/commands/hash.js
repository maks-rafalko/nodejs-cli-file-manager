import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from "../OperationFailedError.js";
import { displayMessage } from '../io.js';
import { normalizeToAbsolutePath } from '../fsFunctions.js';

const sha256AsHex = (content) => createHash('sha256').update(content).digest('hex');

export const hash = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];

    let resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        const stats = await stat(resultPath);

        if (stats.isDirectory()) {
            // todo discuss how to write it in a better way
            throw new OperationFailedError();
        }

        const fileBuffer = await readFile(resultPath);

        const hex = sha256AsHex(fileBuffer);

        displayMessage(`SHA-256 of file "${resultPath}": ${hex}`);
    } catch (error) {
        throw new OperationFailedError();
    }
}