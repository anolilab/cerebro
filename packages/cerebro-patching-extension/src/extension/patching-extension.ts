import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import { patching } from "../toolbox/patching-tools.js";

/**
 * Builds the patching feature.
 */
export default {
    name: "patching",
    execute: (toolbox: Toolbox): void => {
        toolbox.patching = patching;
    },
};
