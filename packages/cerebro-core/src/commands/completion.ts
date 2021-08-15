import jetpack from "fs-jetpack";
import untildify from "untildify";

import { COMPLETION_DIR } from "../autocompletion/constants";
import { Command as ICommand, Logger, Toolbox as IToolbox } from "../types";
import { getSystemShell } from "../toolbox/utils";
import { ParsedEnvironment, parseEnvironment } from "../autocompletion";

class CompletionCommand implements ICommand {
    public name = "completion";

    public hidden = true;

    public description = "Installs or uninstalls the console autocomplete";

    public args = [
        {
            name: "command",
            type: String,
            defaultOption: true,
        },
    ];

    public usage = [];

    private readonly shell: string;

    private readonly commands: Map<String, ICommand>;

    public constructor(commands: Map<String, ICommand>) {
        this.commands = commands;
        this.shell = getSystemShell();
    }

    // eslint-disable-next-line class-methods-use-this
    public async execute(toolbox: IToolbox): Promise<void> {
        const {
            parameters, logger, prompts,
        } = toolbox;

        const hasCompletionDirectory = jetpack.exists(untildify(COMPLETION_DIR));

        if (hasCompletionDirectory !== "dir") {
            const questions = await prompts({
                type: "confirm",
                name: "install",
                message: "Do you wish to install completion?",
            });

            if (questions.install) {
                parameters.options.install = true;
            } else {
                return Promise.resolve();
            }

            return Promise.resolve();
        }

        const environment = parseEnvironment(logger, process.env);



        // if (Array.isArray(command.autocompletes) && command.autocompletes.length > 0) {
        //     this.addCommandAutocomplete(logger, environment, command.autocompletes);
        // }
    }

    private static normalizeAutoComplteValues(item) {
        if (item.name || item.description) {
            return {
                name: item.name,
                description: item.description || "",
            };
        }

        let name = item;

        if (this.shell === "zsh" && /\\/.test(item)) {
            name += "\\";
        }

        return {
            name,
            description: "",
        };
    }

    private addCommandAutocomplete(logger: Logger, environment: ParsedEnvironment, autocompletes) {
        // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
        let arguments_ = autocompletes
            .map((element) => CompletionCommand.normalizeAutoComplteValues(element))
            .map((item) => {
                const { name: rawName, description: rawDescription } = item;

                const name = this.shell === "zsh" ? rawName.replace(/:/g, "\\:") : rawName;
                const description = this.shell === "zsh" ? rawDescription.replace(/:/g, "\\:") : rawDescription;

                let command = name;

                if (this.shell === "zsh" && description) {
                    command = `${name}:${description}`;
                } else if (this.shell === "fish" && description) {
                    command = `${name}\t${description}`;
                }

                return command;
            });

        if (this.shell === "bash") {
            arguments_ = arguments_.filter((argument) => argument.indexOf(environment.last) === 0);
        }

        for (const argument of arguments_) {
            logger.log(`${argument}`);
        }
    }
}

export default CompletionCommand;
