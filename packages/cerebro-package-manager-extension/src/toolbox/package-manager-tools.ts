import { toolbox } from "@anolilab/cerebro-core";

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
    options: PackageManagerOptions,
): Promise<PackageManagerResult> => {
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
    options: PackageManagerOptions,
): Promise<PackageManagerResult> => {
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

const packageManager: PackageManager = {
    add,
    remove,
    hasYarn,
};

export default packageManager;

export type PackageManagerOptions = {
    dev?: boolean;
    dryRun?: boolean;
    dir?: string;
    force?: "npm" | "yarn";
};

export type PackageManagerResult = {
    success: boolean;
    command: string;
    stdout: string;
    error?: string;
};

export type PackageManager = {
    add: (packageName: string | string[], options: PackageManagerOptions) => Promise<PackageManagerResult>;
    remove: (packageName: string | string[], options: PackageManagerOptions) => Promise<PackageManagerResult>;
    hasYarn: () => boolean;
};
