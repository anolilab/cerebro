import type { Toolbox as IToolbox } from "@anolilab/cerebro-core";

import packageManager from "../toolbox/package-manager-tools.js";

export default {
    name: "package-manager",
    execute: (toolbox: IToolbox) => {
        toolbox.packageManager = packageManager;
    },
};
