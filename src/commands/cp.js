import { fileExists, folderExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { basename, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';

export const cp = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newDirectoryPath']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultCopiedFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertCopiedFileExists(resultCopiedFilePath);

    const rawNewDirectoryPath = parsedCommandLine.arguments[1];
    const resultNewDirectoryPath = normalizeToAbsolutePath(executionContext.currentDir, rawNewDirectoryPath);
    const fileName = basename(resultCopiedFilePath);
    const resultNewFilePath = join(resultNewDirectoryPath, fileName);

    await assertNewFilePathDoesNotExist(resultNewFilePath);
    await assertFolderForNewFileExists(resultNewDirectoryPath);

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

const assertCopiedFileExists = async (resultCopiedFilePath) => {
    const isCopiedFileExists = await fileExists(resultCopiedFilePath);

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
