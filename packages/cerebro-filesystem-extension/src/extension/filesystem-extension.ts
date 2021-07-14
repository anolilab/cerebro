import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import { filesystem } from "../toolbox/filesystem-tools.js";

/**
 * Extensions to filesystem. Brought to you by fs-jetpack.
 */
export default {
    name: "filesystem",
    execute: (toolbox: Toolbox) => {
        toolbox.filesystem = filesystem;
    },
};
