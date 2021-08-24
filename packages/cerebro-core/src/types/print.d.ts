import chalk from "chalk";
import { AnimationFn } from "chalk-animation";
import CLITable from "cli-table3";
import ora from "ora";
import terminalLink from "terminal-link";

export type TableStyle = Partial<CLITable.TableInstanceOptions["style"]>;

export interface PrintTableOptions {
    format?: "markdown" | "lean" | "default";
    style?: TableStyle;
}

export interface Print {
    /* Colors as seen from colors.js. */
    colors: typeof chalk.Chalk & {
        highlight: (t: string) => string;
        info: (t: string) => string;
        warning: (t: string) => string;
        success: (t: string) => string;
        error: (t: string) => string;
        line: (t: string) => string;
        muted: (t: string) => string;
        black: (t: string) => string;
        red: (t: string) => string;
        green: (t: string) => string;
        yellow: (t: string) => string;
        blue: (t: string) => string;
        magenta: (t: string) => string;
        cyan: (t: string) => string;
        white: (t: string) => string;
        blackBright: (t: string) => string;
        redBright: (t: string) => string;
        greenBright: (t: string) => string;
        yellowBright: (t: string) => string;
        blueBright: (t: string) => string;
        magentaBright: (t: string) => string;
        cyanBright: (t: string) => string;
        whiteBright: (t: string) => string;
    };
    /* A green checkmark. */
    checkmark: string;
    /* A red X marks the spot. */
    xmark: string;
    /* Prints a divider. */
    divider: () => void;
    /* Finds the column widths for a table */
    findWidths: (cliTable: CLITable.Table) => number[];
    /* Returns column header dividers for a table */
    columnHeaderDivider: (cliTable: CLITable.Table, style: TableStyle) => string[];
    /* Prints a newline. */
    newline: () => void;
    /* Prints a table of data (usually a 2-dimensional array). */
    table: (data: string[][], options?: PrintTableOptions) => void;
    /* An `ora`-powered spinner. */
    spin(options?: ora.Options | string): ora.Ora;

    link: typeof terminalLink;

    windowSize: {
        height: number;
        width: number;
    };

    clear(): void;

    /**
     * Console.log with some checks.
     *
     * @param arguments_
     */
    print(arguments_: any): void;

    /**
     * Colorful animations in terminal output.
     */
    animation: {
        rainbow: AnimationFn;
        pulse: AnimationFn;
        glitch: AnimationFn;
        radar: AnimationFn;
        neon: AnimationFn;
        karaoke: AnimationFn;
    };
}
