import { readdir } from 'node:fs/promises';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { normalizeToAbsolutePath } from '../fsFunctions.js';

export const ls = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {optionalArguments: ['directoryPath']});

    const targetPath = parsedCommandLine.arguments[0] || executionContext.currentDir;

    let resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        const files = await readdir(resultPath, {withFileTypes: true});

        const filesWithStats = files
            // for the sake of simplicity, we will not display symlinks and other non-file/directory entries
            .filter((file) => file.isDirectory() || file.isFile())
            .map((file) => {
                return {
                    name: file.name,
                    type: file.isDirectory() ? 'directory' : 'file',
                }
            })
            .sort(sortDirectoriesAndFiles);

        console.table(filesWithStats);
    } catch (error) {
        throw new OperationFailedError();
    }
}

const sortDirectoriesAndFiles = (a, b) => {
    if (a.type === b.type) {
        return a.name.localeCompare(b.name);
    }

    return a.type === 'directory' ? -1 : 1;
}