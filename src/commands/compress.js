import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { validateCommandLine } from '../commandLineValidator.js';
import { OperationFailedError } from "../OperationFailedError.js";
import { displayMessage } from '../io.js';
import { normalizeToAbsolutePath } from '../fsFunctions.js';

export const compress = async (executionContext, parsedCommandLine) => {
    validateCommandLine(parsedCommandLine, {requiredArguments: ['filePath']});

    
}