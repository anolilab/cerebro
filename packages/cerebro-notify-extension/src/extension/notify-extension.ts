import type { Extension as IExtension, Toolbox as IToolbox } from "@anolilab/cerebro-core";
import notifier from "node-notifier";

/**
 * Show a native notification on macOS, Windows, Linux.
 */
export default {
    name: "notify",
    execute: (toolbox: IToolbox) => {
        toolbox.notify = notifier;
    },
} as IExtension;
