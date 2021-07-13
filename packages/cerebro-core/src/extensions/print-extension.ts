import { print } from "../toolbox/print-tools.js";
import { Extension as IExtension, Toolbox as IToolbox } from "../types";

/**
 * Extensions to print to the console.
 *
 * @param toolbox The running toolbox.
 */
export default {
    name: "print",
    execute: (toolbox: IToolbox): void => {
        // attach the feature set
        toolbox.print = print;
    },
} as IExtension;
