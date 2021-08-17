import type { Extension as IExtension, Toolbox as IToolbox } from "@anolilab/cerebro-core";

import filesystem from "../toolbox/filesystem-tools.js";

/**
 * Extensions to filesystem. Brought to you by fs-jetpack.
 */
export default {
    name: "filesystem",
    execute: (toolbox: IToolbox) => {
        toolbox.filesystem = filesystem;
    },
} as IExtension;
