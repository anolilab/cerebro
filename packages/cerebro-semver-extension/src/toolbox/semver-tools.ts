import semverPkg from "semver";

const {
    valid, clean, satisfies, gt, lt, validRange,
} = semverPkg;

/**
 * We're replicating the interface of semver in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
export const semver: Semver = {
    valid: (...arguments_) => valid(...arguments_),
    clean: (...arguments_) => clean(...arguments_),
    satisfies: (...arguments_) => satisfies(...arguments_),
    gt: (...arguments_) => gt(...arguments_),
    lt: (...arguments_) => lt(...arguments_),
    validRange: (...arguments_) => validRange(...arguments_),
};

export interface Semver {
    /* Checks if a version is a valid semver string */
    valid(version: string): string | null;
    /* Removes extraneous characters from a semver string */
    clean(version: string): string | null;
    /* Checks if a version is in a semver range */
    satisfies(version: string, inVersion: string): boolean;
    /* Checks if a version is greater than another version */
    gt(version: string, isGreaterThanVersion: string): boolean;
    /* Checks if a version is less than another version */
    lt(version: string, isLessThanVersion: string): boolean;
    /* Checks if a range string is valid */
    validRange(range: string): boolean | null;
}
