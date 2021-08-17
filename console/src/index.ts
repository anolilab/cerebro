import { dirname, join } from "path";
import { fileURLToPath } from "url";

import Cli, { CommandLoader } from "@anolilab/cerebro-core";
import type { Toolbox } from "@anolilab/cerebro-core";
import { filesystemExtension } from "@anolilab/cerebro-filesystem-extension";
import { httpExtension } from "@anolilab/cerebro-http-extension";
import { notifyExtension } from "@anolilab/cerebro-notify-extension";
import { packageManagerExtension } from "@anolilab/cerebro-package-manager-extension";
import { patchingExtension } from "@anolilab/cerebro-patching-extension";
import { semverExtension } from "@anolilab/cerebro-semver-extension";
import { stringsExtension } from "@anolilab/cerebro-strings-extension";
import { templateExtension } from "@anolilab/cerebro-template-extension";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-disable-next-line consistent-return,import/prefer-default-export
(async (): Promise<Toolbox | void> => {
    try {
        // Create a CLI runtime
        const cli = new Cli("cerebro", process.argv);

        cli.addLoader(new CommandLoader(join(__dirname, "..", "commands")))
            .addExtension(filesystemExtension)
            .addExtension(httpExtension)
            .addExtension(notifyExtension)
            .addExtension(packageManagerExtension)
            .addExtension(patchingExtension)
            .addExtension(semverExtension)
            .addExtension(stringsExtension)
            .addExtension(templateExtension);

        return await cli.run();
    } catch (error) {
        // Abort via CTRL-C
        if (!error) {
            console.log("Goodbye ✌️");
        } else {
            // Throw error
            throw error;
        }
    }
})();
