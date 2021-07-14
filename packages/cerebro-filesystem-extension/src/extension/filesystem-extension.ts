import IToolbox from "@anolilab/cerebro-core/types/domain/toolbox";

import { filesystem } from "../toolbox/filesystem-tools.js";

/**
 * Extensions to filesystem. Brought to you by fs-jetpack.
 */
export default {
    name: "filesystem",
    execute: (toolbox: IToolbox) => {
        toolbox.filesystem = filesystem;
    },
};
