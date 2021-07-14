import IToolbox from "@anolilab/cerebro-core/types/domain/toolbox";

import { strings } from "../toolbox/string-tools.js";

/**
 * Attaches some string helpers for convenience.
 */
export default {
    name: "strings",
    execute: (toolbox: IToolbox): void => {
        toolbox.strings = strings;
    },
};
