import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { basename, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { assertFileDoesNotExist, assertFileExists, assertFolderExists } from '../asserts.js';

export const mv = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newDirectoryPath']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultMovedFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertFileExists(resultMovedFilePath);

    const rawNewDirectoryPath = parsedCommandLine.arguments[1];
    const resultNewDirectoryPath = normalizeToAbsolutePath(executionContext.currentDir, rawNewDirectoryPath);
    const fileName = basename(resultMovedFilePath);
    const resultNewFilePath = join(resultNewDirectoryPath, fileName);

    await assertFileDoesNotExist(resultNewFilePath);
    await assertFolderExists(resultNewDirectoryPath);

    return new Promise(async (resolve, reject) => {
        try {
            const readableStream = createReadStream(resultMovedFilePath);
            const writableStream = createWriteStream(resultNewFilePath);

            readableStream.pipe(writableStream);

            readableStream.on('end', async () => {
                await rm(resultMovedFilePath);
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};
