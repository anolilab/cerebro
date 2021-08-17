import { build } from "../src";
import { Toolbox as IToolbox } from "../src/types";

/**
 * Create the cli and kick it off
 */
export async function run(argv?: string[] | string): Promise<IToolbox> {
    // create a CLI runtime
    const cerebro = build("cerebro")
        .src(__dirname)
        .help()
        .version()
        .defaultCommand({
            run: async (toolbox: IToolbox) => {
                const { print, meta } = toolbox;
                print.info(`cerebro version ${meta.version()}`);
                print.info("");
                print.info("  Type cerebro --help for more info");
            },
        })
        .exclude(["http", "patching"])
        .checkForUpdates(25)
        .create();

    // and execute it
    return await cerebro.run(argv);
}
