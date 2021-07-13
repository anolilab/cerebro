import jetpack from "fs-jetpack";

import { PackageJSON as IPackageJSON, Toolbox as IToolbox } from "../types";

/**
 * Finds the currently running CLI package.json
 *
 * @param toolbox
 * @returns Package.json contents as an object.
 */
export function getPackageJSON(toolbox: IToolbox): IPackageJSON {
    let directory = toolbox.runtime.getCwd();

    if (!directory) {
        throw new Error("getVersion: Unknown CLI version (no cwd folder found)");
    }

    // go at most 5 directories up to find the package.json
    for (let index = 0; index < 5; index += 1) {
        const packageJson = jetpack.path(directory, "package.json");

        // if we find a package.json, we're done -- read the version and return it
        if (jetpack.exists(packageJson) === "file") {
            return jetpack.read(packageJson, "json") as IPackageJSON;
        }

        // if we reach the git repo or root, we can't determine the version -- this is where we bail
        const git = jetpack.path(directory, ".git");
        const root = jetpack.path("/");

        if (directory === root || jetpack.exists(git) === "dir") {
            break;
        }

        // go up another directory
        directory = jetpack.path(directory, "..");
    }

    throw new Error(`getPackageJSON: No package.json found in ${directory}`);
}

/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
export function getVersion(toolbox: IToolbox): string | undefined {
    return getPackageJSON(toolbox).version;
}

export async function checkForUpdate(toolbox: IToolbox): Promise<null | string> {
    if (!process.stdout.isTTY) {
        return null;
    }

    const { system, semver } = toolbox;

    const packageJSON = getPackageJSON(toolbox);
    const myVersion = packageJSON.version;
    const packageName = packageJSON.name;

    const latestVersion = await system.run(`npm info ${packageName} dist-tags.latest`);

    if (semver.gt(latestVersion, myVersion)) {
        return latestVersion;
    }

    return null;
}
