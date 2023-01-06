import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from '../OperationFailedError.js';

export const add = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['fileName']});

    try {
        const fileName = parsedCommandLine.arguments[0];
        const filePath = join(executionContext.currentDir, fileName);

        // validate filename doesn't contain any path-changing things
        const resultFileDirectory = dirname(filePath);

        if (resultFileDirectory !== executionContext.currentDir) {
            throw new Error('File name is invalid.');
        }

        // throws an exception if file already exists
        await writeFile(filePath, '', {flag: 'wx+'});
    } catch (error) {
        throw new OperationFailedError();
    }
}