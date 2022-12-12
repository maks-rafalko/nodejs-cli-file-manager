import { access, constants, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

export const fileExists = async (filePath) => {
    try {
        await access(filePath, constants.F_OK);

        return true;
    } catch {
        return false;
    }
}

export const folderExists = async (folderPath) => {
    try {
        const stats = await stat(folderPath);

        return stats.isDirectory();
    } catch {
        return false;
    }
}

export const normalizeToAbsolutePath = (currentDir, targetPath) => {
    return isAbsolute(targetPath) ? targetPath : join(currentDir, targetPath);
}