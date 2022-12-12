import { rename as fsRename } from 'node:fs/promises';
import { fileExists, normalizeToAbsolutePath } from '../fsFunctions.js';
import { join, dirname } from 'node:path';
import { OperationFailedError } from '../OperationFailedError.js';
import { validateCommandLine } from '../commandLineValidator.js';

export const rename = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath', 'newFileName']});

    const originalFilePath = parsedCommandLine.arguments[0];
    const originalFileResultPath = normalizeToAbsolutePath(executionContext.currentDir, originalFilePath);
    const originalFileDirectory = dirname(originalFileResultPath);

    const newFileName = parsedCommandLine.arguments[1];
    const newFileResultPath = join(originalFileDirectory, newFileName);

    try {
        await validateInputDataIsCorrect(originalFileResultPath, originalFileDirectory, newFileResultPath);

        await fsRename(originalFileResultPath, newFileResultPath);
    } catch (error) {
        throw new OperationFailedError();
    }
};

const validateInputDataIsCorrect = async (originalFileResultPath, originalFileDirectory, newFileResultPath) => {
    // validate filename doesn't contain any path-changing things
    const resultFileDirectory = dirname(newFileResultPath);

    if (resultFileDirectory !== originalFileDirectory) {
        throw new Error('File name is invalid.');
    }

    const isOriginalFileExists = await fileExists(originalFileResultPath);
    const isNewFileExists = await fileExists(newFileResultPath);

    if (!isOriginalFileExists || isNewFileExists) {
        throw new Error('No original file or new file already exists.');
    }
}