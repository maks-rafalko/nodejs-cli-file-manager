import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliDecompress } from 'node:zlib';

export const decompress = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePathToDecompress', 'filePathToCompressionResult']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultFilePathToDecompress = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertFileExists(resultFilePathToDecompress);

    const rawCompressionResultFilePath = parsedCommandLine.arguments[1];
    const compressionResultFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawCompressionResultFilePath);

    await assertNewFilePathDoesNotExist(compressionResultFilePath);

    return new Promise((resolve, reject) => {
        try {
            const readableStream = createReadStream(resultFilePathToDecompress);
            const writableStream = createWriteStream(compressionResultFilePath);

            readableStream.pipe(createBrotliDecompress()).pipe(writableStream);

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
