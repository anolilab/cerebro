import { Logger } from "../types";
import { SHELL_LOCATIONS } from "./constants";
import { install as installerInstall, uninstall as installerUninstall } from "./installer";

/**
 * Install and enable completion on user system. It'll ask for:
 *
 * - SHELL (bash, zsh or fish)
 * - Path to shell script (with sensible defaults)
 *
 * @param {Logger} logger
 * @param {Object} options to use with namely `name` and `completer`
 *
 */
export const install = async (
    logger: Logger,
    options: { name: string; completer: string; shell: string; completeCmd?: string },
): Promise<void> => {
    const { name = "", completer = "", shell = "" } = options;
    let { completeCmd } = options;

    if (!name) {
        throw new TypeError("options.name is required");
    }

    if (!completer) {
        throw new TypeError("options.completer is required");
    }

    const location = SHELL_LOCATIONS[shell];

    if (!location) {
        throw new Error(`Couldn't find shell location for ${shell}`);
    }

    if (!completeCmd) {
        completeCmd = "completion";
    }

    await installerInstall(logger, {
        name,
        completer,
        location,
        shell: options.shell,
        completeCmd,
    });

    // eslint-disable-next-line compat/compat
    return Promise.resolve();
};

export const uninstall = async (logger: Logger, options) => {
    const { name = "", shell = "" } = options;
    if (!name) throw new TypeError("options.name is required");

    try {
        await installerUninstall(logger, { name, shell });
    } catch (error) {
        logger.error(`ERROR while uninstalling; ${error.toString()}`);
    }
};

export type ParsedEnvironment = {
    /**
     * A Boolean indicating whether we act in "plumbing mode" or not
     */
    complete: boolean;

    /**
     * The Number of words in the completed line
     */
    words: number;

    /**
     * A Number indicating cursor position
     */
    point: number;

    /**
     * The String input line
     */
    line: string;

    /**
     * The String part of line preceding cursor position
     */
    partial: string;

    /**
     * The last String word of the line
     */
    last: string;

    /**
     * The last word String of partial
     */
    lastPartial: string;
    /**
     * The String word preceding last
     */
    prev: string;
};

/**
 * Public: Main utility to extract information from command line arguments and
 * Environment variables, namely COMP args in "plumbing" mode.
 *
 * options -  The options hash as parsed by minimist, plus an env property
 *            representing user environment (default: { env: process.env })
 *    :_      - The arguments Array parsed by minimist (positional arguments)
 *    :env    - The environment Object that holds COMP args (default: process.env)
 *
 * Examples
 *
 *   const env = parseEnv();
 *   // env:
 *   // complete    A Boolean indicating whether we act in "plumbing mode" or not
 *   // words       The Number of words in the completed line
 *   // point       A Number indicating cursor position
 *   // line        The String input line
 *   // partial     The String part of line preceding cursor position
 *   // last        The last String word of the line
 *   // lastPartial The last word String of partial
 *   // prev        The String word preceding last
 *
 * Returns the data env object.
 */
export const parseEnvironment = (logger: Logger, environment: typeof process.env): ParsedEnvironment => {
    if (!environment) {
        throw new Error("parseEnv: You must pass in an environment object.");
    }

    logger.debug(
        `Parsing env. CWORD: ${environment.COMP_CWORD}, COMP_POINT: ${environment.COMP_POINT}, COMP_LINE: ${environment.COMP_LINE}`, "Autocompletion installer",
    );

    let cword = Number(environment.COMP_CWORD);
    let point = Number(environment.COMP_POINT);
    const line = environment.COMP_LINE || "";

    if (Number.isNaN(cword)) cword = 0;
    if (Number.isNaN(point)) point = 0;

    const partial = line.slice(0, point);

    const parts = line.split(" ");
    const previous = parts.slice(0, -1).slice(-1)[0];

    const last = parts.slice(-1).join("");
    const lastPartial = partial.split(" ").slice(-1).join("");

    let complete = true;

    if (!environment.COMP_CWORD || !environment.COMP_POINT || !environment.COMP_LINE) {
        complete = false;
    }

    return {
        complete,
        words: cword,
        point,
        line,
        partial,
        last,
        lastPartial,
        prev: previous,
    };
};
