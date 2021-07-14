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
