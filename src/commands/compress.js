import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';
import { assertFileDoesNotExist, assertFileExists} from '../asserts.js';
import { pipeline } from 'node:stream/promises';
import { OperationFailedError } from '../OperationFailedError.js';

export const compress = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePathToCompress', 'filePathToCompressionResult']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultFilePathToCompress = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    try {
        await assertFileExists(resultFilePathToCompress);

        const rawCompressionResultFilePath = parsedCommandLine.arguments[1];
        const compressionResultFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawCompressionResultFilePath);

        await assertFileDoesNotExist(compressionResultFilePath);

        await pipeline(
            createReadStream(resultFilePathToCompress),
            createBrotliCompress(),
            createWriteStream(compressionResultFilePath)
        );
    } catch (error) {
        throw new OperationFailedError();
    }
};
