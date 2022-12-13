import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';

export const compress = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePathToCompress', 'filePathToCompressionResult']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultFilePathToCompress = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertFileExists(resultFilePathToCompress);

    const rawCompressionResultFilePath = parsedCommandLine.arguments[1];
    const compressionResultFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawCompressionResultFilePath);

    await assertNewFilePathDoesNotExist(compressionResultFilePath);

    return new Promise((resolve, reject) => {
        try {
            const readableStream = createReadStream(resultFilePathToCompress);
            const writableStream = createWriteStream(compressionResultFilePath);

            readableStream.pipe(createBrotliCompress()).pipe(writableStream);

            readableStream.on('end', () => {
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};

const assertFileExists = async (filePath) => {
    const isFileExists = await fileExists(filePath);

    if (!isFileExists) {
        throw new OperationFailedError();
    }
}

const assertNewFilePathDoesNotExist = async (resultNewFilePath) => {
    const isNewPathAlreadyExists = await fileExists(resultNewFilePath);

    if (isNewPathAlreadyExists) {
        throw new OperationFailedError();
    }
}
