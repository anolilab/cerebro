import { Command as ICommand } from "./command";
import { Extension as IExtension } from "./extension";
import { Options as IOptions } from "./options";
import { Toolbox as IToolbox } from "./toolbox";

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
    addCommand(command: ICommand);

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
    addExtension(extension: IExtension);

    /**
     * Check for updates randomly.
     *
     * @param frequency % frequency of checking
     *
     * @return self
     */
    checkForUpdates(frequency: number);

    /**
     * Enabled all completion commands.
     *
     * @returns {Cli}
     */
    enableCompletion(): Cli;

    getName(): string;

    getCommands(): Map<string, ICommand>;

    getCwd(): string;

    run(extraOptions: IOptions): Promise<IToolbox | void>;
}
