import { toolbox } from "@anolilab/cerebro-core";

const { system } = toolbox;

let yarnpath;
let pnpmpath;

const hasYarn = () => {
    if (typeof yarnpath === "undefined") {
        yarnpath = system.which("yarn");
    }

    return Boolean(yarnpath);
};

const hasPnpm = () => {
    if (typeof pnpmpath === "undefined") {
        pnpmpath = system.which("pnpm");
    }

    return Boolean(pnpmpath);
};

const concatPackages = (packageName) => (Array.isArray(packageName) ? packageName.join(" ") : packageName);

const add = async (packageName: string | string[], options: PackageManagerOptions): Promise<PackageManagerResult> => {
    const pnpm = typeof options.force === "undefined" ? hasPnpm() : options.force === "pnpm";
    const yarn = typeof options.force === "undefined" ? hasYarn() : options.force === "yarn";

    let development = "";

    if (options.dev) {
        if (yarn) {
            development = "--dev ";
        } else if (pnpm) {
            development = "--dev";
        } else {
            development = "--save-dev ";
        }
    }

    const folder = options.dir ?? ".";
    let packageManager = "npm install --prefix";

    if (yarn) {
        packageManager = "yarn add --cwd";
    } else if (pnpm) {
        packageManager = "pnpm add --cwd";
    }

    const command = `${packageManager} ${folder} ${development}${concatPackages(
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
    const folder = options.dir ?? ".";
    const pnpm = typeof options.force === "undefined" ? hasPnpm() : options.force === "pnpm";
    const yarn = typeof options.force === "undefined" ? hasYarn() : options.force === "yarn";

    let packageManager = "npm uninstall --prefix";

    if (yarn) {
        packageManager = "yarn remove --cwd";
    } else if (pnpm) {
        packageManager = "pnpm remove --cwd";
    }

    const command = `${packageManager} ${folder} ${concatPackages(
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
    force?: "npm" | "yarn" | "pnpm";
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
