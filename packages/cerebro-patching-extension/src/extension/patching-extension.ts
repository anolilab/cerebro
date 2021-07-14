import IToolbox from "@anolilab/cerebro-core/types/domain/toolbox";

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
