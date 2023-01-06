import { readdir } from 'node:fs/promises';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from '../OperationFailedError.js';
import { normalizeToAbsolutePath } from '../fsFunctions.js';

export const ls = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {optionalArguments: ['directoryPath']});

    const targetPath = parsedCommandLine.arguments[0] || executionContext.currentDir;
    const resultPath = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    try {
        const files = await readdir(resultPath, {withFileTypes: true});

        const filesWithStats = files
            .filter(filterOutNonFilesAndDirectories)
            .map(createDisplayedFileSystemItem)
            .sort(sortDirectoriesAndFiles);

        console.table(filesWithStats);
    } catch (error) {
        throw new OperationFailedError();
    }
}

/**
 * For the sake of simplicity, we will not display symlinks and other non-file/directory entries
 */
const filterOutNonFilesAndDirectories = (dirent) => {
    return dirent.isDirectory() || dirent.isFile();
}

const createDisplayedFileSystemItem = (dirent) => {
    return {
        name: dirent.name,
        type: dirent.isDirectory() ? 'directory' : 'file',
    }
}

const sortDirectoriesAndFiles = (a, b) => {
    if (a.type === b.type) {
        return a.name.localeCompare(b.name);
    }

    return a.type === 'directory' ? -1 : 1;
}