import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { validateCommandLine } from '../commandLineValidator.js';

export const cat = async (executionContext, parsedCommandLine) => {
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

    return new Promise((resolve, reject) => {
        try {
            const readableStream = createReadStream(resultPath);

            readableStream.pipe(process.stdout);

            readableStream.on('end', () => {
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};
