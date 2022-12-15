import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { basename, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { assertFileDoesNotExist, assertFileExists, assertFolderExists } from '../asserts.js';
import { pipeline } from 'node:stream/promises';
import { OperationFailedError } from '../OperationFailedError.js';

export const cp = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newDirectoryPath']});

    const rawFilePath = parsedCommandLine.arguments[0];
    const resultCopiedFilePath = normalizeToAbsolutePath(executionContext.currentDir, rawFilePath);

    try {
        await assertFileExists(resultCopiedFilePath);

        const rawNewDirectoryPath = parsedCommandLine.arguments[1];
        const resultNewDirectoryPath = normalizeToAbsolutePath(executionContext.currentDir, rawNewDirectoryPath);
        const fileName = basename(resultCopiedFilePath);
        const resultNewFilePath = join(resultNewDirectoryPath, fileName);

        await assertFileDoesNotExist(resultNewFilePath);
        await assertFolderExists(resultNewDirectoryPath);

        await pipeline(
            createReadStream(resultCopiedFilePath),
            createWriteStream(resultNewFilePath)
        );
    } catch (error) {
        throw new OperationFailedError();
    }
};
