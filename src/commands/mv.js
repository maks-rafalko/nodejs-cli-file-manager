import { fileExists, folderExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { basename, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';

export const mv = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newDirectoryPath']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultMovedFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertMovedFileExists(resultMovedFilePath);

    const rawNewDirectoryPath = parsedCommandLine.arguments[1];
    const resultNewDirectoryPath = normalizeToAbsolutePath(executionContext.currentDir, rawNewDirectoryPath);
    const fileName = basename(resultMovedFilePath);
    const resultNewFilePath = join(resultNewDirectoryPath, fileName);

    await assertNewFilePathDoesNotExist(resultNewFilePath);
    await assertFolderForNewFileExists(resultNewDirectoryPath);

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

const assertMovedFileExists = async (resultMovedFilePath) => {
    const isCopiedFileExists = await fileExists(resultMovedFilePath);

    if (!isCopiedFileExists) {
        throw new OperationFailedError();
    }
}

const assertNewFilePathDoesNotExist = async (resultNewFilePath) => {
    const isNewPathAlreadyExists = await fileExists(resultNewFilePath);

    if (isNewPathAlreadyExists) {
        throw new OperationFailedError();
    }
}

const assertFolderForNewFileExists = async (resultNewDirectoryPath) => {
    const isFolderExists = await folderExists(resultNewDirectoryPath);

    if (!isFolderExists) {
        throw new OperationFailedError();
    }
}
