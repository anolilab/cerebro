import { Command as ICommand } from "../types";

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

    private readonly commands: Map<String, ICommand>;

    constructor(commands: Map<String, ICommand>) {
        this.commands = commands;
    }

    public execute(toolbox) {
        const {
            print, parameters, logger, runtime, meta,
        } = toolbox;

        logger.info(`${runtime.getName()} ${meta.version()}`);

        print.printHelp(toolbox, this.commands, parameters?.options?.command);
    }
}

export default HelpCommand;
