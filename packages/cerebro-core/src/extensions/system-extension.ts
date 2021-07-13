import system from "../toolbox/system-tools.js";
import { Extension as IExtension, Toolbox as IToolbox } from "../types";

/**
 * Extensions to launch processes and open files.
 *
 * @param toolbox The running toolbox.
 */
export default {
    name: "system",
    execute: (toolbox: IToolbox) => {
        toolbox.system = system;
    },
} as IExtension;
