import {
    clean, gt, lt, satisfies, valid, validRange,
} from "semver";

import { Semver } from "./semver-types";

/**
 * We're replicating the interface of semver in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
const semver: Semver = {
    valid: (...arguments_) => valid(...arguments_),
    clean: (...arguments_) => clean(...arguments_),
    satisfies: (...arguments_) => satisfies(...arguments_),
    gt: (...arguments_) => gt(...arguments_),
    lt: (...arguments_) => lt(...arguments_),
    validRange: (...arguments_) => validRange(...arguments_),
};

export { semver, Semver };
