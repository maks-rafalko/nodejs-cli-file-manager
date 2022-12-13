import { normalizeToAbsolutePath } from '../fsFunctions.js';
import { validateCommandLine } from '../commandLineValidator.js';
import { assertFolderExists } from '../asserts.js';

export const cd = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['directoryPath']});

    const targetPath = parsedCommandLine.arguments[0];

    const newCurrentDirCandidate = normalizeToAbsolutePath(executionContext.currentDir, targetPath);

    await assertFolderExists(newCurrentDirCandidate);

    executionContext.currentDir = newCurrentDirCandidate;
}