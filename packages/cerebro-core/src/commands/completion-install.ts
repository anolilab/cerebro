import { SHELL_LOCATIONS } from "../autocompletion/constants";
import { install as installerInstall } from "../autocompletion/installer";
import { Command as ICommand, Logger, Toolbox as IToolbox } from "../types";

class CompletionInstallCommand implements ICommand {
    public name = "completion:install";

    public description = "Installs the console autocomplete";

    public args = [];

    public usage = [];

    // eslint-disable-next-line class-methods-use-this
    public async execute(toolbox: IToolbox): Promise<void> {
        const {
            logger, runtime, prompts,
        } = toolbox;

        const name = runtime.getName();
        const completer = runtime.getName();

        const questions = await prompts({
            type: "text",
            name: "shell",
            message: "Which Shell do you use ?",
            choices: [
                { title: "bash", value: "bash" },
                { title: "zsh", value: "zsh" },
                { title: "fish", value: "fish" },
            ],
        });

        const { shell } = questions;

        if (!shell) {
            return Promise.resolve();
        }

        await CompletionInstallCommand.install(logger, shell, name, completer);

        // eslint-disable-next-line compat/compat
        return Promise.resolve();
    }

    // eslint-disable-next-line class-methods-use-this
    private static async install(logger: Logger, shell: string, name: string, completer: string) {
        const location = SHELL_LOCATIONS[shell];

        if (!location) {
            throw new Error(`Couldn't find shell location for ${shell}`);
        }

        await installerInstall(logger, {
            name,
            completer,
            location,
            shell,
            completeCmd: "completion",
        });
    }
}

export default CompletionInstallCommand;
