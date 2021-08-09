import { toolbox } from "@anolilab/cerebro-core";
import { chmod, chmodSync, existsSync } from "fs-chmod";
import jetpack from "fs-jetpack";
import type { FSJetpack } from "fs-jetpack/types";
import os from "os";
import pathlib from "path";
import trash from "trash";

const { isBlank } = toolbox.utils;

/**
 * Is this a file?
 *
 * @param path The filename to check.
 * @returns `true` if the file exists and is a file, otherwise `false`.
 */
function isFile(path: string): boolean {
    return jetpack.exists(path) === "file";
}

/**
 * Is this not a file?
 *
 * @param path The filename to check
 * @return `true` if the file doesn't exist.
 */
const isNotFile = (path: string): boolean => !isFile(path);

/**
 * Is this a directory?
 *
 * @param path The directory to check.
 * @returns True/false -- does the directory exist?
 */
function isDirectory(path: string): boolean {
    return jetpack.exists(path) === "dir";
}

/**
 * Is this not a directory?
 *
 * @param path The directory to check.
 * @return `true` if the directory does not exist, otherwise false.
 */
const isNotDirectory = (path: string): boolean => !isDirectory(path);

/**
 * Gets the immediate subdirectories.
 *
 * @param path Path to a directory to check.
 * @param isRelative Return back the relative directory?
 * @param matching   A jetpack matching filter
 * @return A list of directories
 */
function subdirectories(path: string, isRelative: boolean = false, matching: string = "*"): string[] {
    if (isBlank(path) || !isDirectory(path)) {
        return [];
    }

    const directories = jetpack.cwd(path).find({
        matching,
        directories: true,
        recursive: false,
        files: false,
    });

    if (isRelative) {
        return directories;
    }

    return directories.map((dir) => pathlib.join(path, dir));
}

const filesystem: Filesystem = {
    chmodSync,
    eol: os.EOL, // end of line marker
    homedir: os.homedir, // get home directory
    separator: pathlib.sep, // path separator
    subdirectories, // retrieve subdirectories
    isFile,
    isNotFile,
    isDirectory,
    isNotDirectory,
    resolve: pathlib.resolve,
    executable: (path = "", mode = "+x") => {
        chmod(path, mode)
            .then(() => {
                /* do nothing on success */
            })
            .catch((error) => {
                console.error(error);
            });
    },
    chdir: (path = "") => {
        process.chdir(path);
    },
    trash: (filename = "") => {
        if (existsSync(filename)) {
            trash(filename);
        }
    },
    // and everything else in jetpack
    ...jetpack,
};

export default filesystem;

export interface Filesystem extends FSJetpack {
    /**
     * Convenience property for `os.EOL`.
     */
    eol: string;

    /**
     * Convenience property for `path.sep`.
     */
    separator: string;

    /**
     * Convenience property for `os.homedir` function
     */
    homedir: () => string;

    /**
     * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
     *
     * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
     *
     * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
     * until an absolute path is found. If after using all {from} paths still no absolute path is found,
     * the current working directory is used as well. The resulting path is normalized,
     * and trailing slashes are removed unless the path gets resolved to the root directory.
     *
     * @param pathSegments string paths to join.  Non-string arguments are ignored.
     */
    chmodSync: typeof chmodSync;

    /**
     * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
     *
     * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
     *
     * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
     * until an absolute path is found. If after using all {from} paths still no absolute path is found,
     * the current working directory is used as well. The resulting path is normalized,
     * and trailing slashes are removed unless the path gets resolved to the root directory.
     *
     * @param pathSegments string paths to join.  Non-string arguments are ignored.
     */
    resolve: typeof pathlib.resolve;

    /**
     * Retrieves a list of subdirectories for a given path.
     */
    subdirectories(path: string, isRelative?: boolean, matching?: string): string[];

    /**
     * Is this a file?
     */
    isFile(path: string): boolean;

    /**
     * Is this not a file?
     */
    isNotFile(path: string): boolean;

    /**
     * Is this a directory?
     */
    isDirectory(path: string): boolean;

    /**
     * Is this not a directory?
     */
    isNotDirectory(path: string): boolean;

    executable(path: string, mode: string): void;

    chdir(path: string): void;

    /**
     * Move a file to trash.
     */
    trash(filename: string): void;
}
