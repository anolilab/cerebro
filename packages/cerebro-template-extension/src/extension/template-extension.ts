import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import buildGenerate from "../toolbox/template-tools.js";

/**
 * Builds the code generation feature.
 */
export default {
    name: "template",
    execute: (toolbox: Toolbox): void => {
        const generate = buildGenerate(toolbox);

        toolbox.template = { generate };
    },
};
