import { InvalidInputError } from './InvalidInputError.js';

export const validateCommandLine = (parsedCommandLine, config) => {
    const requiredArguments = config.requiredArguments || [];
    const optionalArguments = config.optionalArguments || [];

    if (optionalArguments.length === 0 && parsedCommandLine.arguments.length !== requiredArguments.length) {
        throw new InvalidInputError();
    }

    if (requiredArguments.length === 0 && parsedCommandLine.arguments.length > optionalArguments.length) {
        throw new InvalidInputError();
    }

    const allowedOptions = config.allowedOptions || [];

    const optionKeys = Object.keys(parsedCommandLine.options);

    optionKeys.forEach((option) => {
        if (!allowedOptions.includes(option)) {
            throw new InvalidInputError();
        }
    });

    const allowZeroOptions = config.hasOwnProperty('allowZeroOptions') ? config.allowZeroOptions : true;

    if (allowedOptions.length !== 0 && optionKeys.length === 0 && !allowZeroOptions) {
        throw new InvalidInputError();
    }
}