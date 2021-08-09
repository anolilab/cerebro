import { Toolbox as IToolbox } from "@anolilab/cerebro-core";

import { semver } from "../toolbox/semver-tools.js";

/**
 * Extensions to access semver and helpers
 */
export default {
    name: "semver",
    execute: (toolbox: IToolbox): void => {
        toolbox.semver = semver;
    },
};
