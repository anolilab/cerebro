import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import { strings } from "../toolbox/string-tools.js";

/**
 * Attaches some string helpers for convenience.
 */
export default {
    name: "strings",
    execute: (toolbox: Toolbox): void => {
        toolbox.strings = strings;
    },
};
