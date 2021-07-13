import jetpack from "fs-jetpack";
import { join, sep } from "path";

import Command from "../domain/command.js";
import {
    asyncForEach, is, isBlank, isNil, last, reject, takeLast,
} from "../toolbox/utils.js";
import {
    Cli as ICli, Command as ICommand, Loader, Options as IOptions,
} from "../types";
import loadModule from "./module-loader.js";

/**
 * Loads the command from the given file.
 *
 * @param file The full path to the file to load.
 *
 * @return The loaded command.
 */
export async function loadCommandFromFile(file: string, options: IOptions = {}): Promise<ICommand> {
    // sanity check the input
    if (isBlank(file)) {
        throw new Error(`Error: couldn't load command (file is blank): ${file}`);
    }

    // not a file?
    if (jetpack.exists(file) !== "file") {
        throw new Error(`Error: couldn't load command (this isn't a file): ${file}`);
    }

    const command = new Command();

    // remember the file
    command.file = file;
    // default name is the name without the file extension

    command.name = (jetpack.inspect(file) as any).name.split(".")[0];

    // strip the extension from the end of the commandPath
    command.commandPath = (options.commandPath || last(file.split(`commands${sep}`)).split(sep)).map((f) => ([`${command.name}.js`, `${command.name}.mjs`, `${command.name}.cjs`].includes(f) ? command.name : f));

    // if the last two elements of the commandPath are the same, remove the last one
    const lastElems = takeLast(2, command.commandPath);

    if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
        command.commandPath = command.commandPath.slice(0, -1);
    }

    // require in the module -- best chance to bomb is here
    const commandModule = (await loadModule(file)) as ICommand;

    // is it a valid commandModule?
    const valid = commandModule && typeof commandModule === "object" && typeof commandModule.execute === "function";

    if (valid) {
        command.name = commandModule.name || last(command.commandPath);
        command.description = commandModule.description;
        command.hidden = Boolean(commandModule.hidden);
        // @ts-ignore
        command.alias = reject(isNil, is(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias]);
        command.execute = commandModule.execute;
    } else {
        throw new Error(`Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`);
    }

    return command;
}

export class CommandLoader implements Loader {
    public name: string = "command-loader";

    private options: IOptions;

    private readonly path: string;

    public constructor(path: string, options: IOptions) {
        this.options = {
            commandFilePattern: ["*.{js,mjs,cjs}", "!*.test.{js,mjs,cjs}"],
            hidden: false,
            ...options,
        };

        // directory check
        if (jetpack.exists(path) !== "dir") {
            throw new Error(`Error: couldn't load command folder (not a directory): ${path}`);
        }

        this.path = path;
    }

    async run(cli: ICli): Promise<void> {
        const commands = jetpack.cwd(this.path).find({ matching: this.options.commandFilePattern, recursive: true });

        await asyncForEach(commands, async (file: string) => {
            const command = await loadCommandFromFile(join(this.path, file));

            cli.addCommand(command);
        });

        return Promise.resolve();
    }
}
