import fs from "fs";
import jetpack from "fs-jetpack";
import path from "path";
import untildify from "untildify";
import { promisify } from "util";

import { getSystemShell } from "../toolbox/utils";
import { Logger } from "../types";
import {
    BASH_LOCATION, CEREBRO_SCRIPT_NAME, COMPLETION_DIR, FISH_LOCATION, ZSH_LOCATION,
} from "./constants";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

const label = "Autocompletion installer";

const escapeRegExp = (literal_string) => literal_string.replace(/[\s#$()*+,.?[\\\]^{|}-]/g, "\\$&");

/**
 * Helper to return the correct script template based on the SHELL provided
 *
 * @param {String} shell - Shell to base the check on, defaults to system shell.
 * @returns The template script content, defaults to Bash for shell we don't know yet
 */
export const scriptFromShell = (shell: string = getSystemShell()): string => {
    if (shell === "fish") {
        return path.join(__dirname, "..", "scripts/fish.sh");
    }

    if (shell === "zsh") {
        return path.join(__dirname, "..", "scripts/zsh.sh");
    }

    // For Bash and others
    return path.join(__dirname, "..", "scripts/bash.sh");
};

/**
 * Helper to return the expected location for SHELL config file, based on the
 * provided shell value.
 *
 * @param {String} shell - Shell value to test against
 * @returns {String} Either ~/.bashrc, ~/.zshrc or ~/.config/fish/config.fish,
 * untildified. Defaults to ~/.bashrc if provided SHELL is not valid.
 */
export const locationFromShell = (shell: string = getSystemShell()): string => {
    if (shell === "bash") {
        return untildify(BASH_LOCATION);
    }

    if (shell === "zsh") {
        return untildify(ZSH_LOCATION);
    }

    if (shell === "fish") {
        return untildify(FISH_LOCATION);
    }

    return BASH_LOCATION;
};

/**
 * Helper to return the source line to add depending on the SHELL provided or detected.
 *
 * If the provided SHELL is not known, it returns the source line for a Bash shell.
 *
 * @param {String} scriptName - The script to source
 * @param {String} shell - Shell to base the check on, defaults to system
 * shell.
 */
export const sourceLineForShell = (scriptName: string, shell: string = getSystemShell()): string => {
    if (shell === "fish") {
        return `[ -f ${scriptName} ]; and . ${scriptName}; or true`;
    }

    if (shell === "zsh") {
        return `[[ -f ${scriptName} ]] && . ${scriptName} || true`;
    }

    // For Bash and others
    return `[ -f ${scriptName} ] && . ${scriptName} || true`;
};

/**
 * Helper to check if a filename is one of the SHELL config we expect
 *
 * @param {String} filename - Filename to check against
 * @returns {Boolean} Either true or false
 */
export const isInShellConfig = (filename: string): boolean => [
    BASH_LOCATION,
    ZSH_LOCATION,
    FISH_LOCATION,
    untildify(BASH_LOCATION),
    untildify(ZSH_LOCATION),
    untildify(FISH_LOCATION),
].includes(filename);

/**
 * Checks a given file for the existence of a specific line. Used to prevent
 * adding multiple completion source to SHELL scripts.
 *
 * @param {Logger} logger
 * @param {String} filename - The filename to check against
 * @param {String} line     - The line to look for
 * @returns {Boolean} true or false, false if the line is not present.
 */
export const checkFilenameForLine = async (logger: Logger, filename: string, line: string): Promise<boolean> => {
    logger.debug(`Check filename (${filename}) for "${line}".`, label);

    let fileContent = "";

    try {
        fileContent = await readFile(untildify(filename), "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") {
            logger.error(
                `Got an error while trying to read from "${filename}" file; Error: ${error.toString()}`,
                label,
            );

            return false;
        }
    }

    // eslint-disable-next-line unicorn/prefer-regexp-test
    return !!fileContent.match(escapeRegExp(`${line}`));
};

/**
 * Opens a file for modification adding a new `source` line for the given
 * SHELL. Used for both SHELL script and cerebro autocompletion internal one.
 *
 * @param {Logger} logger
 * @param {Object} options - Options with
 *    - filename: The file to modify
 *    - scriptname: The line to add sourcing this file
 *    - name: The package being configured
 */
export const writeLineToFilename = (
    logger: Logger,
    {
        filename, scriptName, name, shell,
    }: { filename: string; scriptName: string; name: string; shell: string },
) => (resolve, reject) => {
    const filepath = untildify(filename);

    logger.debug(`Creating directory for "${filepath}" file`, label);

    mkdir(path.dirname(filepath), { recursive: true })
        .then(() => {
            const stream = fs.createWriteStream(filepath, { flags: "a" });

            stream.on("error", reject);
            stream.on("finish", () => resolve());

            logger.debug(`Writing to shell configuration file (${filename})`, label);
            logger.debug(`scriptname: ${scriptName}`, label);

            const inShellConfig = isInShellConfig(filename);

            // eslint-disable-next-line promise/always-return
            if (inShellConfig) {
                stream.write("\n# cerebro autocompletion source for packages");
            } else {
                stream.write(`\n# cerebro autocompletion source for ${name} package`);
            }

            stream.write("\n# uninstall by removing these lines");
            stream.write(`\n${sourceLineForShell(scriptName, shell)}`);
            stream.end("\n");

            logger.log(`Added cerebro autocompletion source line in "${filename}" file`, label);
        })
        .catch((error) => {
            logger.error(`mkdirp ERROR: ${error.toString()}`, label);

            reject(error);
        });
};

/**
 * Writes to SHELL config file adding a new line, but only one, to the SHELL
 * config script. This enables cerebro autocompletion to work for the given SHELL.
 *
 * @param {Logger} logger
 * @param {Object} options - Options object with
 *    - location: The SHELL script location (~/.bashrc, ~/.zshrc or
 *    ~/.config/fish/config.fish)
 *    - name: The package configured for completion
 */
export const writeToShellConfig = async (
    logger: Logger,
    { location, name, shell }: { location: string; name: string; shell: string },
): Promise<void> => {
    const scriptName = path.join(COMPLETION_DIR, shell, `${CEREBRO_SCRIPT_NAME}.${shell}`);

    const filename = location;

    // Check if SHELL script already has a line for cerebro autocompletion
    const existing = await checkFilenameForLine(logger, filename, scriptName);

    if (existing) {
        logger.log(`Cerebro autocompletion line already exists in "${filename}" file`, label);

        return Promise.resolve();
    }

    // eslint-disable-next-line compat/compat
    return new Promise(
        writeLineToFilename(logger, {
            filename,
            scriptName,
            name,
            shell,
        }),
    );
};

/**
 * Writes to cerebro autocompletion internal script that acts as a frontend router for the
 * completion mechanism, in the internal ~/.config/cerebro autocompletion directory. Every
 * completion is added to this file.
 *
 * @param {Logger} logger
 * @param {Object} options - Options object with
 *    - name: The package configured for completion
 */
export const writeToCerebroScript = async (
    logger: Logger,
    { name, shell }: { name: string; shell: string },
): Promise<void> => {
    const filename = path.join(COMPLETION_DIR, shell, `${CEREBRO_SCRIPT_NAME}.${shell}`);

    const scriptName = path.join(COMPLETION_DIR, shell, `${name}.${shell}`);

    // Check if cerebro autocompletion completion file already has this line in it
    const existing = await checkFilenameForLine(logger, filename, scriptName);

    if (existing) {
        logger.log(`Cerebro autocompletion line already exists in ${filename} file`, label);

        return Promise.resolve();
    }

    // eslint-disable-next-line compat/compat
    return new Promise(
        writeLineToFilename(logger, {
            filename,
            scriptName,
            name,
            shell,
        }),
    );
};

/**
 * This writes a new completion script in the internal `~/.config/cerebro`
 * directory. Depending on the SHELL used, a different script is created for
 * the given SHELL.
 *
 * @param {Logger} logger
 * @param {Object} options - Options object with
 *    - name: The package configured for completion
 *    - completer: The binary that will act as the completer for `name` program
 */
export const writeToCompletionScript = async (
    logger: Logger,
    {
        name, completer, shell, completeCmd,
    }: { name: string; completer: string; shell: string, completeCmd: string },
): Promise<void> => {
    const filename = untildify(path.join(COMPLETION_DIR, shell, `${name}.${shell}`));

    const script = scriptFromShell(shell);

    logger.debug(`Writing completion script to "${filename}" with "${script}".`, label);

    try {
        let filecontent = await readFile(script, "utf8");

        filecontent = filecontent
            .replace(/{pkgname}/g, name)
            .replace(/{completer}/g, completer)
            .replace(/{completeCmd}/g, completeCmd)
            // on Bash on windows, we need to make sure to remove any \r
            .replace(/\r?\n/g, "\n");

        await mkdir(path.dirname(filename), { recursive: true });
        await writeFile(filename, filecontent);

        logger.log(`Wrote completion script to "${filename}" file.`, label);
    } catch (error) {
        logger.error(error.toString());
    }
};

/**
 * Top level install method. Does three things:
 *
 * - Writes to SHELL config file, adding a new line to cerebro internal script.
 * - Creates or edit cerebro internal script
 * - Creates the actual completion script for this package.
 *
 * @param {Logger} logger
 * @param {Object} options - Options object with
 *    - name: The program name to complete
 *    - completer: The actual program or binary that will act as the completer
 *    for `name` program. Can be the same.
 *    - location: The SHELL script config location (~/.bashrc, ~/.zshrc or
 *    ~/.config/fish/config.fish)
 *    - shell: the target shell language
 */
export const install = async (
    logger: Logger,
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    options: {
        name: string;
        completer: string;
        location: string;
        shell: string;
        completeCmd: string;
    } = {
        name: "",
        completer: "",
        location: "",
        shell: getSystemShell(),
        completeCmd: "",
    },
) => {
    logger.debug(`Install with options: ${JSON.stringify(options)}.`, label);

    if (!options.name) {
        throw new Error("options.name is required");
    }

    if (!options.completer) {
        throw new Error("options.completer is required");
    }

    if (!options.location) {
        throw new Error("options.location is required");
    }

    if (!options.location) {
        // eslint-disable-next-line no-param-reassign
        options.location = "completion";
    }

    // eslint-disable-next-line compat/compat
    await Promise.all([
        writeToShellConfig(logger, options),
        writeToCerebroScript(logger, options),
        writeToCompletionScript(logger, options),
    ]);

    const { location, name } = options;

    logger.success(`
    Cerebro autocompletion source line added to ${location} for ${name} package.

    Make sure to reload your SHELL.
  `, label);
};

/**
 * Removes the 3 relevant lines from provided filename, based on the package
 * name passed in.
 *
 * @param {Logger} logger
 * @param {String} filename - The filename to operate on
 * @param {String} name - The package name to look for
 */
export const removeLinesFromFilename = async (logger: Logger, filename: string, name: string): Promise<void> => {
    logger.debug(`Removing lines from "${filename}" file, looking for "${name}" package`, label);

    if (jetpack.exists(untildify(filename)) === false) {
        logger.debug(`File "${filename}" does not exist.`, label);

        return Promise.resolve();
    }

    const fileContent = await readFile(filename, "utf8");
    const lines = fileContent.split(/\r?\n/);

    const sourceLine = isInShellConfig(filename)
        ? "# cerebro autocompletion source for packages"
        : `# cerebro autocompletion source for ${name} package`;

    // eslint-disable-next-line unicorn/prefer-regexp-test
    const hasLine = !!fileContent.match(escapeRegExp(`${sourceLine}`));

    if (!hasLine) {
        logger.debug(`File "${filename}" does not include the line: "${sourceLine}".`, label);

        return Promise.resolve();
    }

    let lineIndex = -1;

    const buffer = lines
        // Build up the new buffer, removing the 3 lines following the sourceline
        .map((line, index) => {
            const match = line.match(escapeRegExp(sourceLine));

            if (match) {
                lineIndex = index;
            } else if (lineIndex + 3 <= index) {
                lineIndex = -1;
            }

            return lineIndex === -1 ? line : "";
        })
        // Remove any double empty lines from this file
        .map((line, index, array) => {
            const next = array[index + 1];

            if (line === "" && next === "") {
                return;
            }

            // eslint-disable-next-line consistent-return
            return line;
        })
        // Remove any undefined value from there
        // eslint-disable-next-line no-undefined
        .filter((line) => line !== undefined)
        .join("\n")
        .trim();

    await writeFile(filename, buffer);

    logger.success(`Removed cerebro source lines from "${filename}" file`, label);

    // eslint-disable-next-line compat/compat
    return Promise.resolve();
};

/**
 * Here the idea is to uninstall a given package completion from internal
 * cerebro scripts and / or the SHELL config.
 *
 * It also removes the relevant scripts if no more completion are installed on
 * the system.
 *
 * @param {Logger} logger
 * @param {Object} options - Options object with
 *    - name: The package name to look for
 *    - shell: the target shell language
 */
export const uninstall = async (logger: Logger, options: { name: string, shell: string }): Promise<void> => {
    logger.debug(`Uninstall with options: ${JSON.stringify(options)}.`, label);

    const { name = "", shell = "" } = options;

    if (!name) {
        throw new Error("Unable to uninstall if options.name is missing");
    }

    if (!shell) {
        throw new Error("Unable to uninstall if options.shell is missing");
    }

    const completionScript = untildify(path.join(COMPLETION_DIR, shell, `${name}.${shell}`));

    // First, lets remove the completion script itself
    if ((await jetpack.exists(untildify(completionScript))) === "file") {
        await unlink(completionScript);

        logger.log(`Removed completion script (${completionScript})`, label);
    }

    // Then the lines in ~/.config/cerebro/__cerebro.shell
    const cerebroScript = untildify(path.join(COMPLETION_DIR, shell, `${CEREBRO_SCRIPT_NAME}.${shell}`));
    await removeLinesFromFilename(logger, cerebroScript, name);

    // Then, check if __cerebro.shell is empty, if so remove the last source line in SHELL config
    const isEmpty = (await readFile(cerebroScript, "utf8")).trim() === "";
    if (isEmpty) {
        const shellScript = locationFromShell();

        logger.debug(`File "${cerebroScript}" is empty. Removing source line from "${shellScript}" file.`, label);

        await removeLinesFromFilename(logger, shellScript, name);
    }

    logger.log(`Uninstalled completion for "${name}" package`, label);

    // eslint-disable-next-line compat/compat
    return Promise.resolve();
};
