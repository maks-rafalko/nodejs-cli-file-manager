import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';
import { assertFileDoesNotExist, assertFileExists} from '../asserts.js';

export const compress = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePathToCompress', 'filePathToCompressionResult']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultFilePathToCompress = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    await assertFileExists(resultFilePathToCompress);

    const rawCompressionResultFilePath = parsedCommandLine.arguments[1];
    const compressionResultFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawCompressionResultFilePath);

    await assertFileDoesNotExist(compressionResultFilePath);

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
