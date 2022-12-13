import { fileExists, folderExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { basename, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { assertFileDoesNotExist, assertFileExists, assertFolderExists } from '../asserts.js';

export const cp = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newDirectoryPath']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultCopiedFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertFileExists(resultCopiedFilePath);

    const rawNewDirectoryPath = parsedCommandLine.arguments[1];
    const resultNewDirectoryPath = normalizeToAbsolutePath(executionContext.currentDir, rawNewDirectoryPath);
    const fileName = basename(resultCopiedFilePath);
    const resultNewFilePath = join(resultNewDirectoryPath, fileName);

    await assertFileDoesNotExist(resultNewFilePath);
    await assertFolderExists(resultNewDirectoryPath);

    return new Promise((resolve, reject) => {
        try {
            const readableStream = createReadStream(resultCopiedFilePath);
            const writableStream = createWriteStream(resultNewFilePath);

            readableStream.pipe(writableStream);

            readableStream.on('end', () => {
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};
