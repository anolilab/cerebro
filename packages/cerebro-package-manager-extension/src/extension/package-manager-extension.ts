import IToolbox from "@anolilab/cerebro-core/types/domain/toolbox";

import { packageManager } from "../toolbox/package-manager-tools.js";

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 */
export default {
    name: "package-manager",
    execute: (toolbox: IToolbox) => {
        toolbox.packageManager = packageManager;
    },
};
