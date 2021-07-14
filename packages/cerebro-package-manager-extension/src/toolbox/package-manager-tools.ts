import { toolbox } from "@anolilab/cerebro-core";

import {
    PackageManager as IPackageManager,
    PackageManagerOptions as IPackageManagerOptions,
    PackageManagerResult as IPackageManagerResult,
} from "../types";

const { system } = toolbox;

let yarnpath;

const hasYarn = () => {
    if (typeof yarnpath === "undefined") {
        yarnpath = system.which("yarn");
    }

    return Boolean(yarnpath);
};

const concatPackages = (packageName) => (Array.isArray(packageName) ? packageName.join(" ") : packageName);

const add = async (
    packageName: string | string[],
    options: IPackageManagerOptions,
): Promise<IPackageManagerResult> => {
    const yarn = typeof options.force === "undefined" ? hasYarn() : options.force === "yarn";
    const development = options.dev ? (yarn ? "--dev " : "--save-dev ") : "";
    const folder = options.dir ? options.dir : ".";

    const command = `${yarn ? "yarn add --cwd" : "npm install --prefix"} ${folder} ${development}${concatPackages(
        packageName,
    )}`;

    let stdout = "";

    if (!options.dryRun) {
        stdout = await system.run(command);
    }

    return { success: true, command, stdout };
};

const remove = async (
    packageName: string | string[],
    options: IPackageManagerOptions,
): Promise<IPackageManagerResult> => {
    const folder = options.dir ? options.dir : ".";
    const command = `${hasYarn() ? "yarn remove --cwd" : "npm uninstall --prefix"} ${folder} ${concatPackages(
        packageName,
    )}`;
    let stdout;

    if (!options.dryRun) {
        stdout = await system.run(command);
    }

    return { success: true, command, stdout };
};

const packageManager: IPackageManager = {
    add,
    remove,
    hasYarn,
};

export { packageManager, IPackageManager as PackageManager };
