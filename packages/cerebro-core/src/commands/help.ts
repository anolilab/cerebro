import type { Command as ICommand } from "../types";
import printHelp from "../utils/print-help";

class HelpCommand implements ICommand {
    public name = "help";

    public args = [
        {
            name: "command",
            description: "The command to display help for",
            defaultOption: true,
        },
    ];

    public usage = [];

    private readonly commands: Map<string, ICommand>;

    constructor(commands: Map<string, ICommand>) {
        this.commands = commands;
    }

    public execute(toolbox) {
        const {
            parameters, logger, runtime, meta,
        } = toolbox;

        logger.info(`${runtime.getName()} ${meta.version()}`);

        printHelp(toolbox, this.commands, parameters?.options?.command);
    }
}

export default HelpCommand;
