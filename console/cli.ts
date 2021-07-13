import { dirname, join } from "path";
import { fileURLToPath } from "url";

import Cli, { CommandLoader } from "../../packages/cerebro-core/dist/mjs/index.js";
import { Toolbox } from "../../packages/cerebro-core/dist/types/domain/toolbox";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-disable-next-line consistent-return,import/prefer-default-export
(async (): Promise<Toolbox | void> => {
    try {
        // Create a CLI runtime
        const cli = new Cli("cerebro", process.argv);

        cli.addLoader(new CommandLoader(join(__dirname, "..", "commands")));

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
