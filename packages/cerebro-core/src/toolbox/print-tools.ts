import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import CliTable from "cli-table3";
import commandLineUsage, { Section } from "command-line-usage";
import ora from "ora";
import terminalLink from "terminal-link";
import windowSize from "window-size";

import defaultArguments from "../default-arguments.js";
import findAlternatives from "../domain/levenstein.js";
import Toolbox from "../domain/toolbox.js";
import {
    Cli as ICli,
    Command as ICommand,
    Logger as ILogger,
    Print as IPrint,
    PrintTableOptions as IPrintTableOptions,
} from "../types";
import { times } from "./utils.js";

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const VERBOSITY_QUIET_ = 16;

// Generate array of arrays of the data rows for length checking
const getRows = (t) => times((index) => t[index], t.length);

const CLI_TABLE_COMPACT = {
    top: "",
    "top-mid": "",
    "top-left": "",
    "top-right": "",
    bottom: "",
    "bottom-mid": "",
    "bottom-left": "",
    "bottom-right": "",
    left: " ",
    "left-mid": "",
    mid: "",
    "mid-mid": "",
    right: "",
    "right-mid": "",
    middle: " ",
};

const CLI_TABLE_MARKDOWN = {
    ...CLI_TABLE_COMPACT,
    left: "|",
    right: "|",
    middle: "|",
};

const colors = {
    success: chalk.keyword("green"),
    error: chalk.bold.red,
    info: chalk.keyword("blue"),
    warning: chalk.keyword("orange"),
    important: chalk.keyword("grey"),
    critical: chalk.bold.red,
    highlight: chalk.keyword("cyan"),
    line: chalk.keyword("grey"),
    muted: chalk.keyword("grey"),
};

/**
 * Print a blank line.
 */
function newline() {
    console.log("");
}

/**
 * Prints a divider line
 */
function divider() {
    console.log(colors.line("---------------------------------------------------------------"));
}

/**
 * Returns an array of the column widths.
 *
 * @param ctable Data table.
 * @returns Array of column widths
 */
function findWidths(ctable: CliTable.Table): number[] {
    return [(ctable as any).options.head, ...getRows(ctable)].reduce(
        (colWidths, row) => row.map((string, index) => Math.max(`${string}`.length + 1, colWidths[index] || 1)),
        [],
    );
}

/**
 * Returns an array of column dividers based on column widths.
 *
 * @param ctable Data table.
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(ctable: CliTable.Table): string[] {
    return findWidths(ctable).map((w) => Array.from({ length: w }).join("-"));
}

/**
 * Prints an object to table format.  The values will already be stringified.
 */
function table(data: string[][], options: IPrintTableOptions = {}): void {
    if (options.format === "markdown") {
        // eslint-disable-next-line no-case-declarations
        const header = data.shift();
        const markdownTable = new CliTable({
            head: header,
            chars: CLI_TABLE_MARKDOWN,
        });
        markdownTable.push(...data);
        markdownTable.unshift(columnHeaderDivider(markdownTable));

        console.log(markdownTable.toString());
    } else if (options.format === "lean") {
        const leanTable = new CliTable();
        leanTable.push(...data);

        console.log(leanTable.toString());
    } else {
        const defaultTable = new CliTable({
            chars: CLI_TABLE_COMPACT,
        });
        defaultTable.push(...data);

        console.log(defaultTable.toString());
    }
}

/**
 * Creates a spinner and starts it up.
 *
 * @param config The text for the spinner or an ora configuration object.
 * @returns The spinner.
 */
function spin(config?: string | object): any {
    return ora(config || "").start();
}

function printGeneralHelp(logger: ILogger, runtime: ICli, print: IPrint, commands: Map<string, ICommand>) {
    logger.debug("no command given, printing general help...");

    logger.log(
        commandLineUsage([
            {
                header: "Usage",
                content: `${print.colors.cyan(runtime.getName())} ${print.colors.green(
                    "<command>",
                )} [arguments] [options]`,
            },
            {
                header: "Available Commands",
                content: [...new Set(commands.values())].map((command) => {
                    let aliases = "";

                    if (typeof command.alias === "string") {
                        aliases = command.alias;
                    } else if (Array.isArray(command.alias)) {
                        aliases = command.alias.join(", ");
                    }

                    if (aliases !== "") {
                        aliases = ` [${aliases}]`;
                    }

                    return { name: print.colors.green(command.name) + aliases, summary: command.description };
                }),
            },
            { header: "Global Options", optionList: defaultArguments },
            {
                content: `Run "${runtime.getName()} help <command>" or "${runtime.getName()} <command> --help" for help with a specific command.`,
                raw: true,
            },
        ]),
    );
}

function printHelp(toolbox: Toolbox, commands: Map<string, ICommand>, name?: string): void {
    const { runtime, logger, print } = toolbox;

    if (name) {
        const command = commands.get(name) as ICommand;

        if (!command) {
            let alternatives = "";

            const foundAlternatives = findAlternatives(name, [...commands.keys()]);

            if (foundAlternatives.length > 0) {
                alternatives = ` Did you mean: \r\n    - ${foundAlternatives.join("    \r\n- ")}`;
            }

            logger.error(`\r\n"${name}" is not an available command.${alternatives}\r\n`);

            return;
        }

        newline();
        logger.info(command.name);
        logger.log(command.description);

        const usageGroups: Section[] = [];

        if (command.args.length > 0) {
            usageGroups.push({ header: "Command Options", optionList: command.args });
        }

        usageGroups.push({ header: "Global Options", optionList: defaultArguments });

        if (typeof command.alias !== "undefined" && command.alias.length > 0) {
            let alias: string[] = command.alias as string[];

            if (typeof command.alias === "string") {
                alias = [command.alias];
            }

            usageGroups.splice(1, 0, {
                header: "Alias(es)",
                content: alias,
            });
        }

        logger.log(commandLineUsage(usageGroups));
    } else {
        printGeneralHelp(logger, runtime, print, commands);
    }
}
const windows = process.platform.indexOf("win") === 0;

function clear() {
    let stdout = "";

    if (!windows) {
        stdout += "\u001B[2J";
    } else {
        let index;
        const lines = windowSize.height;

        for (index = 0; index < lines; index++) {
            stdout += "\r\n";
        }
    }

    // Reset cursor
    stdout += "\u001B[0f";

    process.stdout.write(stdout);
}

const checkmark = colors.success("✔︎");
const xmark = colors.error("ⅹ");

const log = (arguments_: any): void => {
    if (process.env.NODE_ENV === "test" || Number(process.env.CEREBRO_OUTPUT) === VERBOSITY_QUIET_) {
        return;
    }

    // this has been disabled, using jest function mock instead
    console.log(arguments_);
};

/**
 * Output with this option will be formatted.
 */
export const OUTPUT_NORMAL = 1;

/**
 * Output with this option will be passed as-is.
 */
export const OUTPUT_RAW = 2;

/**
 * Output with this option will have any formatting stripped away.
 */
export const OUTPUT_PLAIN = 4;

/**
 * Output with this verbosity won't write anything at all.
 */
export const VERBOSITY_QUIET = VERBOSITY_QUIET_;

/**
 * Output with this verbosity will write default content.
 */
export const VERBOSITY_NORMAL = 32;

/**
 * Output with this verbosity will be more detailed.
 */
export const VERBOSITY_VERBOSE = 64;

/**
 * Output with this verbosity will be super detailed.
 */
export const VERBOSITY_VERY_VERBOSE = 128;

/**
 * Output with this verbosity will reveal internals.
 */
export const VERBOSITY_DEBUG = 256;

/**
 * Any of the output types [[OUTPUT_NORMAL]], [[OUTPUT_RAW]] and [[OUTPUT_PLAIN]].
 */
export type OutputType = 1 | 2 | 4;

/**
 * Any of the verbosity types
 * [[VERBOSITY_QUIET]], [[VERBOSITY_NORMAL]], [[VERBOSITY_VERBOSE]], [[VERBOSITY_VERY_VERBOSE]] nad [[VERBOSITY_DEBUG]].
 */
export type VERBOSITY_LEVEL = 16 | 32 | 64 | 128 | 256;

export const print: IPrint = {
    colors: {
        ...colors,
        black: chalk.black,
        red: chalk.red,
        green: chalk.green,
        yellow: chalk.yellow,
        blue: chalk.blue,
        magenta: chalk.magenta,
        cyan: chalk.cyan,
        white: chalk.white,
        blackBright: chalk.blackBright,
        redBright: chalk.redBright,
        greenBright: chalk.greenBright,
        yellowBright: chalk.yellowBright,
        blueBright: chalk.blueBright,
        magentaBright: chalk.magentaBright,
        cyanBright: chalk.cyanBright,
        whiteBright: chalk.whiteBright,
    },
    newline,
    divider,
    findWidths,
    columnHeaderDivider,
    table,
    spin,
    printHelp,
    checkmark,
    xmark,
    link: terminalLink,
    windowSize,
    clear,
    print: log,
    animation: chalkAnimation,
};
