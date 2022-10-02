import chalk from "chalk";
import type { AnimationFn } from "chalk-animation";
import CLITable from "cli-table3";
import type { Content, OptionDefinition } from "command-line-usage";
import ora from "ora";
import terminalLink from "terminal-link";

interface Choice {
    title: string;
    value: string;
    disable?: boolean;
}

interface Options {
    onSubmit?: (prompt: PromptObject, answer: any, answers: any[]) => void;
    onCancel?: (prompt: PromptObject, answers: any) => void;
}

interface PromptObject<T extends string = string> {
    type: ValueOrFunction<PromptType> | Falsy;
    name: ValueOrFunction<T>;
    message?: ValueOrFunction<string>;
    initial?: string | number | boolean | Date;
    style?: string;
    format?: PreviousCaller<T, void>;
    validate?: PreviousCaller<T, void>;
    onState?: PreviousCaller<T, void>;
    min?: number;
    max?: number;
    float?: boolean;
    round?: number;
    increment?: number;
    seperator?: string;
    active?: string;
    inactive?: string;
    choices?: Choice[];
    hint?: string;
    suggest?: (previous: any, values: any, prompt: PromptObject) => void;
    limit?: number;
    mask?: string;
}

type Answers<T extends string> = { [id in T]: any };

type PreviousCaller<T extends string, R = T> = (previous: any, values: Answers<T>, prompt: PromptObject) => R;

type Falsy = false | null | undefined;

type PromptType =
    | "text"
    | "password"
    | "invisible"
    | "number"
    | "confirm"
    | "list"
    | "toggle"
    | "select"
    | "multiselect"
    | "autocomplete"
    | "date";

type ValueOrFunction<T extends string> = T | PreviousCaller<T>;

export interface Cli {
    /**
     * Set a default command, to display a different command if cli is call without command.
     *
     * @param commandName
     *
     * @return self
     */
    setDefaultCommand(commandName: string);

    /**
     * Add an arbitrary command to the CLI.
     *
     * @param command The command to add.
     *
     * @return self
     */
    addCommand(command: Command);

    /**
     * Adds an extension so it is available when commands execute. They usually live
     * the given name on the toolbox object passed to commands, but are able
     * to manipulate the toolbox object however they want. The second
     * parameter is a function that allows the extension to attach itself.
     *
     * @param extension The extension to add.
     *
     * @return self
     */
    addExtension(extension: Extension);

    /**
     * Check for updates randomly.
     *
     * @param frequency % frequency of checking
     *
     * @return self
     */
    checkForUpdates(frequency: number);

    getName(): string;

    getCommands(): Map<string, ICommand>;

    getCwd(): string;

    run(extraOptions: Options): Promise<Toolbox | void>;
}

export interface Command<TContext extends Toolbox = Toolbox> {
    /** The name of your command */
    name: string;

    args: OptionDefinition[];

    usage: Content[];

    /** The function for running your command, can be async */
    execute: ((toolbox: TContext) => void) | ((toolbox: TContext) => Promise<void>);
    /** A tweet-sized summary of your command */
    description?: string;
    /** Should your command be shown in the listings  */
    hidden?: boolean;
    /** The command path, an array that describes how to get to this command */
    commandPath?: string[];
    /** The path to the file name for this command. */
    file?: string;
    /** Potential other names for this command */
    alias?: string | string[];
}

export interface ExtensionOverrides {}

export type ExtensionSetup = (toolbox: EmptyToolbox & ExtensionOverrides) => void | Promise<void>;

/**
 * An extension will add functionality to the toolbox that each addCommand will receive.
 */
export interface Extension {
    /** The name of the extension. */
    name: string;
    /** The description. */
    description?: string;
    /** The file this extension comes from. */
    file?: string;
    /** The function used to attach functionality to the toolbox. */
    execute: ExtensionSetup
}

export interface Loader {
    name: string;

    run: (cli: Cli) => Promise<void>
}

export interface Logger {
    clear(): void;

    critical(message: any, label: string = "", showIcon: boolean = false): string;

    error(message: any, label: string = "", showIcon: boolean = false): string;

    danger(message: any, label: string = "", showIcon: boolean = false): string;

    success(message: any, label: string = "", showIcon: boolean = false): string;

    warning(message: any, label: string = "", showIcon: boolean = false): string;

    info(message: any, label: string = "", showIcon: boolean = false): string;

    debug(message: any, label: string = "", showIcon: boolean = false): string;

    log(message: any, label: string = "", showIcon: boolean = false): string;

    status(message: any, label: string = "", showIcon: boolean = false): string;

    notice(message: any, label: string = "", showIcon: boolean = false): string;

    note(message: any, label: string = "", showIcon: boolean = false): string;

    processing(message: string): void;

    dd(...data);

    dump(...data);

    line(message: string = ""): string;

    center(message: any, fillText: string = " "): string;
}

export interface PackageJSON {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    homepage?: any;
    bugs?: any;
    license?: string;
    author?: any;
    contributors?: any[];
    maintainers?: any[];
    files?: string[];
    main?: string;
    bin?: any;
    types?: string;
    typings?: string;
    man?: string[];
    directories?: any;
    repository?: any;
    scripts?: {
        [k: string]: string;
    };
    config?: {
        [k: string]: any;
    };
    dependencies?: any;
    devDependencies?: any;
    optionalDependencies?: any;
    peerDependencies?: any;
    resolutions?: any;
    engines?: {
        [k: string]: string;
    };
    private?: boolean;

    [k: string]: any;
}

export interface Meta {
    version: () => string | undefined;
    packageJSON: () => PackageJSON;
    commandInfo: () => string[][];
    checkForUpdate: () => Promise<null | string>;
    onAbort: typeof onAbort
}

/**
 * A flexible object for the many "options" objects we throw around in cerebro.
 */
export interface Options {
    [key: string]: any
}

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

export type Questions<T extends string = string> = PromptObject<T>;
export type Prompts = <T extends string = string>(
    questions: Questions<T> | Array<Questions<T>>,
    options?: Options,
) => Promise<Answers<T>>;

export interface System {
    /**
     * Executes a command via execa.
     */
    exec(command: string, options?: any): Promise<any>;
    /**
     * Runs a command and returns stdout as a trimmed string.
     */
    run(command: string, options?: any): Promise<string>;
    /**
     * Spawns a command via crosspawn.
     */
    spawn(command: string, options?: any): Promise<any>;
    /**
     * Uses node-which to find out where the command lines.
     */
    which(command: string): string | null;
    /**
     * Returns a timer function that starts from this moment. Calling
     * this function will return the number of milliseconds from when
     * it was started.
     */
    startTimer(): Timer;
}

/**
 * Returns the number of milliseconds from when the timer started.
 */
export type Timer = () => number;

export type StringOrBuffer = string | Buffer;

export interface CerebroError extends Error {
    stdout?: StringOrBuffer;
    stderr?: StringOrBuffer;
}

export interface Parameters {
    /* The command arguments as an array. */
    array?: string[];
    /**
     * Any optional parameters. Typically coming from command-line
     * arguments like this: `--force -p tsconfig-mjs.json`.
     */
    options: Options;
    /* Just the first argument. */
    first?: string;
    /* Just the 2nd argument. */
    second?: string;
    /* Just the 3rd argument. */
    third?: string;
    /* Everything else after the command as a string. */
    string?: string;
    /* The raw command with any named parameters. */
    raw?: any;
    /* The original argv value. */
    argv?: any;
    /* The currently running command name. */
    command?: string;
}

// Temporary toolbox while building
export interface EmptyToolbox extends EmptyToolbox, ExtensionOverrides {
    [key: string]: any;
}

// Final toolbox
export interface Toolbox extends EmptyToolbox {
    // known properties
    result?: any;
    parameters: Parameters;
    command?: Command;
    commandName?: string;
    runtime: Cli;

    // known extensions
    meta: Meta;
    print: Print;
    prompts: Prompts;
    system: System;
    generate: any;
    logger: Logger;
}

export type AbortSignals = "SIGINT" | "SIGQUIT" | "SIGTERM" | "SIGHUP" | "SIGBREAK";
