import boxen from "boxen";
import chalk from "chalk";
import commandLineArgs from "command-line-args";
import commandLineCommands from "command-line-commands";
import hardRejection from "hard-rejection";
import hasYarn from "has-yarn";
import isCi from "is-ci";
import isInstalledGlobally from "is-installed-globally";
// @ts-ignore
import isYarnGlobal from "is-yarn-global";

import HelpCommand from "./commands/help.js";
import VersionCommand from "./commands/version.js";
import defaultArguments from "./default-arguments.js";
import EmptyToolbox from "./domain/empty-toolbox.js";
import { Extension } from "./domain/extension.js";
import findAlternatives from "./domain/levenstein.js";
import metaExtension from "./extensions/meta-extension.js";
import printExtension from "./extensions/print-extension.js";
import promptExtension from "./extensions/prompt-extension.js";
import systemExtension from "./extensions/system-extension.js";
import logger from "./toolbox/logger-tools.js";
import { getPackageJSON } from "./toolbox/meta-tools.js";
import { mergeArguments, parseRawCommand } from "./toolbox/parameter-tools.js";
import {
    VERBOSITY_DEBUG,
    VERBOSITY_NORMAL,
    VERBOSITY_QUIET,
    VERBOSITY_VERBOSE,
    VERBOSITY_VERY_VERBOSE,
} from "./toolbox/print-tools.js";
import system from "./toolbox/system-tools.js";
import { asyncForEach } from "./toolbox/utils.js";
import {
    Cli as ICli,
    Command as ICommand,
    Extension as IExtension,
    Loader as ILoader,
    Logger as ILogger,
    Options as IOptions,
    Toolbox as IToolbox,
} from "./types";

class Cli implements ICli {
    private readonly logger: ILogger;

    private readonly argv: string[];

    private readonly cwd: string;

    private readonly name: string;

    private readonly extensions: Extension[] = [];

    private readonly commands: Map<string, ICommand>;

    private readonly loaders: Map<string, ILoader>;

    private defaultCommand: string;

    private checkUpdate: boolean = false;

    /**
     * @param name The name should be all lowercase and contains only numbers,
     * letters, and dashes, the name will be used when searching for configuration files.
     * @param argv This should be in the base case process.argv
     * @param cwd  The path of main folder.
     */
    constructor(name: string, argv: string[] = process.argv, cwd: string = process.cwd()) {
        this.logger = logger;

        Cli.checkNodeVersion();
        Cli.registerExceptionHandler(this.logger);

        process.env.CEREBRO_OUTPUT_LEVEL = String(VERBOSITY_NORMAL);

        this.name = name;
        this.argv = argv;
        this.cwd = cwd;
        this.defaultCommand = "help";

        // If the "--quiet"/"-q" flag is ever present, set our global logging
        // to quiet mode. Also set the level on the logger we've already created.
        if (this.argv.includes("--quiet") || this.argv.includes("-q")) {
            process.env.CEREBRO_OUTPUT_LEVEL = String(VERBOSITY_QUIET);
        }

        // If the "--verbose"/"-v" flag is ever present, set our global logging
        // to verbose mode. Also set the level on the logger we've already created.
        if (this.argv.includes("--verbose") || this.argv.includes("-v")) {
            process.env.CEREBRO_OUTPUT_LEVEL = String(VERBOSITY_VERBOSE);
        } else if (this.argv.includes("--very-verbose") || this.argv.includes("-vv")) {
            process.env.CEREBRO_OUTPUT_LEVEL = String(VERBOSITY_VERY_VERBOSE);
        } else if (this.argv.includes("--debug") || this.argv.includes("-vvv")) {
            process.env.CEREBRO_OUTPUT_LEVEL = String(VERBOSITY_DEBUG);
        }

        if (this.argv.length === 0) {
            const whichNode = system.which("node");

            if (whichNode) {
                this.argv.push(whichNode);
            }

            const whichCerebro = system.which("cerebro");

            if (whichCerebro) {
                this.argv.push(whichCerebro);
            }
        }

        this.checkUpdate = false;
        this.commands = new Map<string, ICommand>();
        this.loaders = new Map<string, ILoader>();

        /**
         * Adds the core extensions. These provide the basic features
         * available in cerebro.
         */
        this.addExtension(metaExtension);
        this.addExtension(printExtension);
        this.addExtension(promptExtension);
        this.addExtension(systemExtension);
        this.addExtension({
            name: "logger",
            execute: (toolbox: IToolbox) => {
                // eslint-disable-next-line no-param-reassign
                toolbox.logger = this.logger;
            },
        } as IExtension);

        this.addCommand(VersionCommand);
        this.addCommand(new HelpCommand(this.commands));
    }

    /**
     * Set a default command, to display a different command if cli is call without command.
     *
     * @param {string} commandName
     *
     * @return self
     */
    public setDefaultCommand(commandName: string): Cli {
        this.defaultCommand = commandName;

        return this;
    }

    /**
     * Add an arbitrary command to the CLI.
     *
     * @param {ICommand} command command to add
     *
     * @return self
     */
    public addCommand(command: ICommand): Cli {
        // add the command to the runtime (if it isn't already there)
        if (!this.commands.has(command.name)) {
            this.commands.set(command.name, command);

            if (typeof command.alias !== "undefined") {
                let aliases: string[] = command.alias as string[];

                if (typeof command.alias === "string") {
                    aliases = [command.alias];
                }

                aliases.forEach((alias) => {
                    this.logger.debug("adding alias", alias);

                    if (this.commands.has(alias)) {
                        this.logger.warning(`Ignoring command alias "${alias}, command with the same name was found."`);
                    } else {
                        this.commands.set(alias, command);
                    }
                });
            }
        } else {
            this.logger.warning(`Ignored command with name "${command.name}, it was found in the command list."`);
        }

        return this;
    }

    /**
     * Adds a cli loader.
     *
     * @param {ILoader} loader
     *
     * @return self
     */
    public addLoader(loader: ILoader): Cli {
        this.loaders.set(loader.name, loader);

        return this;
    }

    /**
     * Adds an extension so it is available when commands execute. They usually live
     * the given name on the toolbox object passed to commands, but are able
     * to manipulate the toolbox object however they want. The second
     * parameter is a function that allows the extension to attach itself.
     *
     * @param {IExtension} extension
     *
     * @returns {Cli}
     */
    public addExtension(extension: IExtension): Cli {
        this.extensions.push(extension);

        return this;
    }

    /**
     * Check for updates randomly.
     *
     * @param frequency % frequency of checking
     *
     * @returns {Cli}
     */
    public checkForUpdates(frequency: number): Cli {
        this.checkUpdate = Math.floor(Math.random() * 100) + 1 < frequency;

        return this;
    }

    public getName(): string {
        return this.name;
    }

    public getCommands(): Map<string, ICommand> {
        return this.commands;
    }

    public getCwd(): string {
        return this.cwd;
    }

    public async run(extraOptions: IOptions = {}): Promise<IToolbox | void> {
        await asyncForEach([...this.loaders.values()], async (loader: ILoader) => {
            await loader.run(this);
        });

        const commandNames = [...this.commands.keys()];

        let parsedArguments: { command: string | null; argv: string[] };

        try {
            parsedArguments = commandLineCommands([null, ...commandNames], parseRawCommand(this.argv));
        } catch (error: any) {
            // CLI needs a valid command name to do anything. If the given
            // command is invalid, run the generalized help command with default
            // config. This should print the general usage information.
            if (error.name === "INVALID_COMMAND" && error.command) {
                let alternatives = "";

                const foundAlternatives = findAlternatives(error.command, [...this.commands.keys()]);

                if (foundAlternatives.length > 0) {
                    alternatives = ` Did you mean: \r\n    - ${foundAlternatives.join("    \r\n- ")}`;
                }

                this.logger.error(`\r\n"${error.command}" is not an available command.${alternatives}\r\n`);

                return;
            }
            // If an unexpected error occurred, propagate it
            throw error;
        }

        const commandName = parsedArguments.command || this.defaultCommand;

        const command = this.commands.get(commandName) as ICommand;

        if (typeof command.execute !== "function") {
            this.logger.error(`Command "${command.name}" has no function to execute.`);

            return;
        }

        const commandArguments = parsedArguments.argv;

        this.logger.debug(`command '${commandName}' found, parsing command args: ${commandArguments}`);

        const commandDefinitions = mergeArguments([command.args || [], defaultArguments]);

        const commandOptionsRaw = commandLineArgs(commandDefinitions, { argv: commandArguments });
        const commandOptions = Cli.parseCLIArgs(commandOptionsRaw);

        // prepare the execute toolbox
        const toolbox = new EmptyToolbox();

        // attach the runtime
        toolbox.runtime = this as ICli;

        // allow extensions to attach themselves to the toolbox
        await asyncForEach(this.extensions, (extension: Extension) => {
            if (typeof extension.execute !== "function") {
                this.logger.warning(`Skipped ${extension.name} because execute is not a function.`);

                return Promise.resolve(null);
            }

            extension.execute(toolbox);

            // eslint-disable-next-line compat/compat
            return Promise.resolve(null);
        });

        await this.updateNotifier(toolbox as IToolbox);

        // parse the command parameters
        toolbox.parameters = { options: { ...commandOptions, ...extraOptions } };

        this.logger.debug("command options parsed from args:");
        this.logger.dump(toolbox.parameters.options);

        toolbox.parameters = {
            command: command.name,
            options: commandOptions,
            raw: this.argv,
            argv: process.argv,
        };

        // set a few properties
        toolbox.command = command;
        toolbox.commandName = command.name;

        toolbox.result = await this.prepareToolboxResult(commandOptions, toolbox as IToolbox, command);

        // recast it
        // eslint-disable-next-line consistent-return
        return toolbox as IToolbox;
    }

    private async prepareToolboxResult(commandOptions: { [p: string]: string }, toolbox: IToolbox, command: ICommand) {
        // Help is a special argument for displaying help for the given command.
        // If found, run the help command instead, with the given command name as
        // an option.
        if (commandOptions.help) {
            this.logger.debug("'--help' option found, running 'help' for given command...");
            const helpCommand = this.commands.get("help");

            if (!helpCommand) {
                throw new Error("Help command not found.");
            }

            return helpCommand.execute(toolbox);
        }

        if (commandOptions.version || commandOptions.V) {
            this.logger.debug("'--version' option found, running 'version' for given command...");
            const helpCommand = this.commands.get("version");

            if (!helpCommand) {
                throw new Error("Version command not found.");
            }

            return helpCommand.execute(toolbox);
        }

        return command.execute(toolbox);
    }

    private async updateNotifier(toolbox: IToolbox) {
        // check for updates
        if (
            !(
                "NO_UPDATE_NOTIFIER" in process.env
                || process.env.NODE_ENV === "test"
                || this.argv.includes("--no-update-notifier")
                || isCi
            )
            && this.checkUpdate
        ) {
            const { print, meta, runtime } = toolbox;

            const updateAvailable = await meta.checkForUpdate();

            if (updateAvailable) {
                const packageJSON = getPackageJSON(toolbox);
                const myVersion = packageJSON.version;
                const packageName = packageJSON.name;

                let installCommand = `npm i ${packageName}`;

                if (isYarnGlobal()) {
                    installCommand = `yarn global add ${packageName}`;
                } else if (isInstalledGlobally) {
                    installCommand = `npm i -g ${packageName}`;
                } else if (hasYarn(runtime.getCwd())) {
                    installCommand = `yarn add ${packageName}`;
                }

                const template = `Update available ${chalk.dim(myVersion)}${chalk.reset(" → ")}${print.colors.green(
                    updateAvailable,
                )} \nRun ${print.colors.cyan(installCommand)} to update`;

                // eslint-disable-next-line no-console
                console.error(
                    boxen(template, {
                        padding: 1,
                        margin: 1,
                        align: "center",
                        borderColor: "yellow",
                        borderStyle: "round",
                    }),
                );
            }
        }
    }

    /**
     * CLI arguments are in "hyphen-case" format, but our configuration is in
     * "lowerCamelCase". This helper function converts the special
     * `command-line-args` data format (with its hyphen-case flags) to an easier to
     *  use options object with lowerCamelCase properties.
     */
    // tslint:disable-next-line: no-any Super hacky scary code.
    private static parseCLIArgs(commandOptions: any): { [name: string]: string } {
        // eslint-disable-next-line no-param-reassign,no-underscore-dangle
        commandOptions = commandOptions && commandOptions._all;

        const parsedOptions = { ...commandOptions };

        if (commandOptions["extra-dependencies"]) {
            parsedOptions.extraDependencies = commandOptions["extra-dependencies"];
        }
        if (commandOptions.fragment) {
            parsedOptions.fragments = commandOptions.fragment;
        }

        return parsedOptions;
    }

    /**
     * See https://github.com/anolilab/cerebro#supported-nodejs-versions for our
     * version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
     *
     * @private
     */
    private static checkNodeVersion(): void {
        const minNodeVersion = process?.env?.CEREBRO_MIN_NODE_VERSION
            ? Number(process?.env?.CEREBRO_MIN_NODE_VERSION)
            : 12;

        const nodeVersion = process.version.replace("v", "");
        const major = Number(process.version.match(/v([^.]+)/)![1]);

        if (major < minNodeVersion) {
            // eslint-disable-next-line no-console
            console.log(
                // eslint-disable-next-line max-len
                `cerebro supports a minimum Node.js version of ${minNodeVersion}. You have ${nodeVersion}. Read our version support policy: https://github.com/anolilab/cerebro#supported-nodejs-versions`,
            );
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        }
    }

    private static registerExceptionHandler(logger_: ILogger): void {
        // we want to see real exceptions with backtraces and stuff
        process.on("uncaughtException", (error: null | undefined | Partial<Error>) => {
            logger_.error(`Uncaught exception: ${error}`);

            if (error && error.stack) {
                logger_.error(error.stack);
            }

            process.exit(1);
        });

        process.on("unhandledRejection", (error: null | undefined | Partial<Error>) => {
            logger_.error(`Promise rejection: ${error}`);

            if (error && error.stack) {
                logger_.error(error.stack);
            }

            process.exit(1);
        });

        hardRejection(logger_.error);
    }
}

export default Cli;
