export const NOT_MEANINGFUL_ARG_COUNT = 2;

export const extractCommandAndArguments = (line) => {
    if (line === '') {
        return ['', ''];
    }

    const splitLine = line.split(' ');

    const command = splitLine[0].trim();
    const argumentsAsString = splitLine.slice(1).join(' ').trim();

    const argumentsAsArray = parseArgumentsStringToArray(argumentsAsString);

    return [command, argumentsAsArray];
}

const parseArgumentsStringToArray = (argsAsString) => {
    const regex = new RegExp('(\'[^\']+\'|"[^"]+"|[^\\s"]+)', 'gmi');

    const parsedMatches = [];
    let match;

    while ((match = regex.exec(argsAsString)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // remove quotes from the beginning and the end of the match, if any, like in "dir/Some Dir With Spaces"
        const matchedValue = match[0]
            .replace(/(^"|"$)/g, '')
            .replace(/(^'|'$)/g, '');

        parsedMatches.push(matchedValue);
    }

    return parsedMatches;
}

// todo add tests and refactor
/**
 * Examples of `meaningfulArguments`:
 *   ['some path/dir', --option', 'John', '--username=Nick', '--EOL']
 *
 * Example of returned parsed object:
 *  {
 *      options: {
 *          '--option': 'John',
 *          '--username': 'Nick',
 *          '--EOL': true,
 *      },
 *      arguments: ['some path/dir'],
 *  }
 */
export const parseCommandLineArguments = (meaningfulArguments) => {
    const parsedCommandLine = {
        arguments: [],
        options: {},
    };
    let previousOption = null;

    for (const currentArgument of meaningfulArguments) {
        if (currentArgument.startsWith('--')) {
            const isOptionWithEqualSignSyntax = currentArgument.includes('=');

            if (isOptionWithEqualSignSyntax) {
                const parts = currentArgument.split('=');
                parsedCommandLine.options[parts[0]] = parts[1];

                continue;
            }

            if (previousOption !== null) {
                parsedCommandLine.options[previousOption] = true;
            }

            previousOption = currentArgument;
        } else if (previousOption !== null) {
            parsedCommandLine.options[previousOption] = currentArgument;
            previousOption = null;
        } else {
            parsedCommandLine.arguments.push(currentArgument);
        }
    }

    if (previousOption !== null) {
        parsedCommandLine.options[previousOption] = true;
    }

    return parsedCommandLine;
}
