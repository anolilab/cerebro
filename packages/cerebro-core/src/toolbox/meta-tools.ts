import jetpack from "fs-jetpack";

import type { AbortSignals as IAbortSignals, PackageJSON as IPackageJSON, Toolbox as IToolbox } from "../types";

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

/**
 * Executes the given callback when a termination signal is received.
 * If callback returns a promise, it will wait for promise to resolve before aborting.
 *
 * @param callback Callback function for handling process termination
 */
export function onAbort(callback: (signal: IAbortSignals) => void | Promise<void>): void {
    const signals: IAbortSignals[] = ["SIGINT", "SIGQUIT", "SIGTERM", "SIGHUP", "SIGBREAK"];

    // eslint-disable-next-line no-restricted-syntax
    for (const signal of signals) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        process.on(signal, async () => {
            // eslint-disable-next-line compat/compat
            await Promise.resolve();

            // eslint-disable-next-line no-restricted-syntax
            for (const removeSignal of signals) {
                // Remove listeners to prevent calling it multiple times
                process.removeAllListeners(removeSignal);

                // Add empty listeners to prevent terminating while onAbort callback is running
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                process.on(removeSignal, () => {});
            }

            await callback(signal);

            // eslint-disable-next-line unicorn/no-process-exit
            process.exit();
        });
    }
}
