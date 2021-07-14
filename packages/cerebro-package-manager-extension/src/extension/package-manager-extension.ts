import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import { packageManager } from "../toolbox/package-manager-tools.js";

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 */
export default {
    name: "package-manager",
    execute: (toolbox: Toolbox) => {
        toolbox.packageManager = packageManager;
    },
};
