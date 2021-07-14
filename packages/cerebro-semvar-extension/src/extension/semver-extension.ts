import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";

import { semver } from "../toolbox/semver-tools.js";

/**
 * Extensions to access semver and helpers
 */
export default {
    name: "semver",
    execute: (toolbox: Toolbox): void => {
        toolbox.semver = semver;
    },
};
