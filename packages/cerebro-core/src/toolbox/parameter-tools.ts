import { OptionDefinition } from "command-line-usage";

import { equals, hideBin, is } from "./utils.js";

const COMMAND_DELIMITER = " ";

/**
 * Performs a simple merge of multiple arguments lists. Does not mutate given
 * arguments lists or arguments.
 *
 * This doesn't perform any validation of duplicate arguments, multiple
 * defaults, etc., because by the time this function is run, the user can't do
 * anything about it. Validation of command and global arguments should be done
 * in tests, not on users machines.
 */
export function mergeArguments(argumentLists: OptionDefinition[][]): OptionDefinition[] {
    const argumentsByName = new Map<string, OptionDefinition>();

    argumentLists.forEach((argumentList) => {
        argumentList.forEach((argument) => {
            argumentsByName.set(argument.name, { ...argumentsByName.get(argument.name), ...argument });
        });
    });

    return [...argumentsByName.values()];
}

/**
 * Parses the raw command into an array of strings.
 *
 * @param commandArray Command string or list of command parts.
 * @returns The command as an array of strings.
 */
export function parseRawCommand(commandArray: string | string[]): string[] {
    // use the command line args if not passed in
    if (is(String, commandArray)) {
        return (commandArray as string).split(COMMAND_DELIMITER);
    }

    // remove the first 2 args if it comes from process.argv
    if (equals(commandArray as string[], process.argv)) {
        return hideBin(commandArray as string[]);
    }

    return commandArray as string[];
}
