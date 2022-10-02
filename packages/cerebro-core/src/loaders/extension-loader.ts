import jetpack from "fs-jetpack";
import path from "node:path";

import EmptyToolbox from "../domain/empty-toolbox.js";
import { Extension } from "../domain/extension.js";
import Toolbox from "../domain/toolbox.js";
import { asyncForEach, isBlank } from "../toolbox/utils.js";
import type { Cli as ICli, Extension as IExtension, Loader } from "../types";
import loadModule from "./utils/load-module.js";
import loadRequire from "./utils/load-require.js";

type IOptions = {
    loadingType?: "require" | "import";
    commandFilePattern?: string[],
    hidden?: boolean,
    [key: string]: any;
};

/**
 * Loads the extension from a file.
 *
 * @param file The full path to the file to load.
 * @param options
 */
export async function loadExtensionFromFile(file: string, options?: IOptions): Promise<IExtension> {
    // sanity check the input
    if (isBlank(file)) {
        throw new Error(`Error: couldn't load extension (file is blank): ${file}`);
    }

    // not a file?
    if (jetpack.exists(file) !== "file") {
        throw new Error(`Error: couldn't load command (not a file): ${file}`);
    }

    // default is the name of the file without the extension
    const name = (jetpack.inspect(file) as any).name.split(".")[0];

    // require in the module -- best chance to bomb is here
    const extensionModule = options?.loadingType === "require"
        ? (loadRequire(file) as IExtension)
        : ((await loadModule(file)) as IExtension);

    // should we try the default export?
    const valid = extensionModule && typeof extensionModule === "object" && typeof extensionModule.execute === "function";

    if (valid) {
        const extension = new Extension(extensionModule.name, (toolbox: EmptyToolbox) => extensionModule.execute(toolbox as Toolbox));

        extension.file = file;
        extension.description = extensionModule.description || undefined;

        return extension;
    }

    throw new Error(
        `Error: couldn't load ${name}. Expected a object with "name" as string and "execute" as function, got ${extensionModule}.`,
    );
}

export class ExtensionLoader implements Loader {
    public name: string = "extension-loader";

    private options: IOptions;

    private readonly path: string;

    public constructor(folderPath: string, options?: IOptions) {
        this.options = {
            commandFilePattern: ["*.{js,mjs,cjs}", "!*.test.{js,mjs,cjs}"],
            hidden: false,
            ...options,
        };

        // directory check
        if (jetpack.exists(folderPath) !== "dir") {
            throw new Error(`Error: couldn't load extension folder (not a directory): ${folderPath}`);
        }

        this.path = folderPath;
    }

    async run(cli: ICli): Promise<void> {
        const commands = jetpack.cwd(this.path).find({ matching: this.options.commandFilePattern, recursive: true });

        await asyncForEach(commands, async (file: string) => {
            const extension = await loadExtensionFromFile(path.join(this.path, file));

            cli.addExtension(extension);
        });
    }
}
