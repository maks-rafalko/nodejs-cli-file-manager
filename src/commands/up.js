import { join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';

export const up = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: []});

    executionContext.currentDir = join(executionContext.currentDir, '..');
}