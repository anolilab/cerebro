import commandLineUsage, { Section } from "command-line-usage";

import defaultArguments from "../default-arguments";
import findAlternatives from "../domain/levenstein";
import type {
    Cli as ICli, Command as ICommand, Logger as ILogger, Print as IPrint, Toolbox as IToolbox
} from "../types";

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
                content: [...new Set(commands.values())]
                    .filter((command) => !command.hidden)
                    .map((command) => {
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

function printHelp(toolbox: IToolbox, commands: Map<string, ICommand>, name?: string): void {
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

        print.newline();
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

export default printHelp;
