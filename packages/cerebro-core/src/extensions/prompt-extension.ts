import prompts from "prompts";

import { Extension as IExtension, Prompts as IPrompts, Toolbox as IToolbox } from "../types";

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param toolbox The running toolbox.
 */
export default {
    name: "prompt",
    execute: (toolbox: IToolbox) => {
        toolbox.prompts = prompts as unknown as IPrompts;
    },
} as IExtension;
