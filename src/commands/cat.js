import { createReadStream } from 'node:fs';
import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { assertFileExists, assertFolderDoesNotExist } from '../asserts.js';
import { pipeline } from 'node:stream/promises';
import { Writable } from 'node:stream';
import { OperationFailedError } from '../OperationFailedError.js';

export const cat = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];
    const resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        await assertFileExists(resultPath);
        await assertFolderDoesNotExist(resultPath);

        await pipeline(
            createReadStream(resultPath),
            createWritableToStdOut()
        );
    } catch (error) {
        throw new OperationFailedError();
    }
};

const createWritableToStdOut = () => {
    return new Writable({
        write(chunk, encoding, callback) {
            const result = chunk.toString();

            console.log(result);

            callback();
        },
    })
}