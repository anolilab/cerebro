import type { Toolbox as IToolbox } from "@anolilab/cerebro-core";

import { patching } from "../toolbox/patching-tools.js";

/**
 * Builds the patching feature.
 */
export default {
    name: "patching",
    execute: (toolbox: IToolbox): void => {
        toolbox.patching = patching;
    },
};
