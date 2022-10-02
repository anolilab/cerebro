import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import CliTable from "cli-table3";
import ora from "ora";
import terminalLink from "terminal-link";
import windowSize from "window-size";

import {
    Print as IPrint,
    PrintTableOptions as IPrintTableOptions,
    TableStyle,
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
    success: chalk.hex("#00ff00"),
    error: chalk.bold.red,
    info: chalk.hex("#0000ff"),
    warning: chalk.hex("#ffa500"),
    important: chalk.hex("#bebebe"),
    critical: chalk.bold.red,
    highlight: chalk.hex("#00ffff"),
    line: chalk.hex("#bebebe"),
    muted: chalk.hex("#bebebe"),
};

/**
 * Print a blank line.
 */
function newline() {
    // eslint-disable-next-line no-console
    console.log("");
}

/**
 * Prints a divider line
 */
function divider() {
    // eslint-disable-next-line no-console
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
 * Returns an array of column dividers based on column widths, taking possible
 * paddings into account.
 *
 * @param ctable Data table.
 * @param style
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(ctable: CliTable.Table, style: TableStyle = {}): string[] {
    const padding = (style["padding-left"] || 0) + (style["padding-right"] || 0);

    return findWidths(ctable).map((w) => Array.from({ length: w + padding }).join("-"));
}

/**
 * Resets the padding of a table.
 *
 * @param cliTable Data table.
 */
function resetTablePadding(cliTable: CliTable.Table) {
    const { style } = (cliTable as any).options;

    if (style) {
        style["padding-left"] = 1;
        style["padding-right"] = 1;
    }
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
            style: options.style,
        });
        markdownTable.push(...data);
        markdownTable.unshift(columnHeaderDivider(markdownTable, options.style));
        resetTablePadding(markdownTable);

        // eslint-disable-next-line no-console
        console.log(markdownTable.toString());
    } else if (options.format === "lean") {
        const leanTable = new CliTable({ style: options.style });
        leanTable.push(...data);

        // eslint-disable-next-line no-console
        console.log(leanTable.toString());
    } else {
        const defaultTable = new CliTable({
            chars: CLI_TABLE_COMPACT,
            style: options.style,
        });
        defaultTable.push(...data);

        // eslint-disable-next-line no-console
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

const windows = process.platform.indexOf("win") === 0;

function clear() {
    let stdout = "";

    if (!windows) {
        stdout += "\u001B[2J";
    } else {
        let index;
        const lines = windowSize.height;

        // eslint-disable-next-line no-plusplus
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
    // eslint-disable-next-line no-console
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
    checkmark,
    xmark,
    link: terminalLink,
    windowSize,
    clear,
    print: log,
    animation: chalkAnimation,
};
