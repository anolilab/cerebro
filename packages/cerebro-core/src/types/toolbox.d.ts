import { ExtensionOverrides } from "../domain/toolbox";
import { Cli as ICli } from "./cli";
import { Command as ICommand } from "./command";
import { Logger as ILogger } from "./logger";
import { Meta as IMeta } from "./meta";
import { Options } from "./options";
import { Print as IPrint } from "./print";
import { Prompts as IPrompts } from "./prompt";
import { System as ISystem } from "./system";

export interface Parameters {
    /* The command arguments as an array. */
    array?: string[];
    /**
     * Any optional parameters. Typically coming from command-line
     * arguments like this: `--force -p tsconfig-mjs.json`.
     */
    options: Options;
    /* Just the first argument. */
    first?: string;
    /* Just the 2nd argument. */
    second?: string;
    /* Just the 3rd argument. */
    third?: string;
    /* Everything else after the command as a string. */
    string?: string;
    /* The raw command with any named parameters. */
    raw?: any;
    /* The original argv value. */
    argv?: any;
    /* The currently running command name. */
    command?: string;
}

// Temporary toolbox while building
export interface EmptyToolbox extends IEmptyToolbox, ExtensionOverrides {
    [key: string]: any;
}

// Final toolbox
export interface Toolbox extends EmptyToolbox {
    // known properties
    result?: any;
    parameters: Parameters;
    command?: ICommand;
    commandName?: string;
    runtime: ICli;

    // known extensions
    meta: IMeta;
    print: IPrint;
    prompts: IPrompts;
    system: ISystem;
    generate: any;
    logger: ILogger;
}
