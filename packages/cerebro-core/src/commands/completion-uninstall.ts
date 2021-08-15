import { uninstall } from "../autocompletion/installer";
import { Command as ICommand, Toolbox as IToolbox } from "../types";

class CompletionUninstallCommand implements ICommand {
    public name = "completion:uninstall";

    public description = "Uninstalls the console autocomplete";

    public args = [];

    public usage = [];

    // eslint-disable-next-line class-methods-use-this
    public async execute(toolbox: IToolbox): Promise<void> {
        const {
            logger, runtime, prompts,
        } = toolbox;

        const name = runtime.getName();

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

        try {
            await uninstall(logger, { name, shell });
        } catch (error) {
            logger.error(`ERROR while uninstalling: ${error.toString()}`);
        }

        // eslint-disable-next-line compat/compat
        return Promise.resolve();
    }
}

export default CompletionUninstallCommand;
