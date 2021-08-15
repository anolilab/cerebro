import { Content, OptionDefinition } from "command-line-usage";

import { Toolbox as IToolbox } from "./toolbox";

export interface Command<TContext extends IToolbox = IToolbox> {
    /** The name of your command */
    name: string;

    args: OptionDefinition[];

    usage: Content[];

    /** The function for running your command, can be async */
    execute: ((toolbox: TContext) => void) | ((toolbox: TContext) => Promise<void>);
    /** A tweet-sized summary of your command */
    description?: string;
    /** Should your command be shown in the listings  */
    hidden?: boolean;
    /** The command path, an array that describes how to get to this command */
    commandPath?: string[];
    /** The path to the file name for this command. */
    file?: string;
    /** Potential other names for this command */
    alias?: string | string[];
    /** list for the autocompletion */
    autocompletes?: (string | { name: string, description: string})[];
}
