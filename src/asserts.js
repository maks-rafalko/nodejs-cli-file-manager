import { fileExists, folderExists } from './fsFunctions.js';
import { OperationFailedError } from './OperationFailedError.js';

export const assertFileExists = async (filePath) => {
    const isFileExists = await fileExists(filePath);

    if (!isFileExists) {
        throw new OperationFailedError();
    }
}

export const assertFileDoesNotExist = async (filePath) => {
    const isFileExists = await fileExists(filePath);

    if (isFileExists) {
        throw new OperationFailedError();
    }
}

export const assertFolderExists = async (path) => {
    const isFolderExists = await folderExists(path);

    if (!isFolderExists) {
        throw new OperationFailedError();
    }
}

export const assertFolderDoesNotExist = async (path) => {
    const isFolderExists = await folderExists(path);

    if (isFolderExists) {
        throw new OperationFailedError();
    }
}
