import { createReadStream } from 'node:fs';
import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { assertFileExists, assertFolderDoesNotExist } from '../asserts.js';

export const cat = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    const targetPath = parsedCommandLine.arguments[0];

    let resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    await assertFileExists(resultPath);
    await assertFolderDoesNotExist(resultPath);

    return new Promise((resolve, reject) => {
        try {
            const readableStream = createReadStream(resultPath);

            readableStream.pipe(process.stdout);

            readableStream.on('end', () => {
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};
