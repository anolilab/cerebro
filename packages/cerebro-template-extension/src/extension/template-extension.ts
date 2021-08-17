import type { Extension as IExtension, Toolbox as IToolbox } from "@anolilab/cerebro-core";

import buildGenerate from "../toolbox/template-tools.js";

/**
 * Builds the code generation feature.
 */
export default {
    name: "template",
    execute: (toolbox: IToolbox): void => {
        const generate = buildGenerate(toolbox);

        toolbox.template = { generate };
    },
} as IExtension;
