import { Command as ICommand } from "../types";

export default {
    name: "version",
    alias: ["v", "V"],
    description: "Output the version number",
    args: [],
    usage: [],
    execute: (toolbox) => {
        toolbox.logger.info(toolbox.meta.version());
    },
} as ICommand;
