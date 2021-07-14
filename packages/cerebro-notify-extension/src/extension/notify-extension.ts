import Toolbox from "@anolilab/cerebro-core/types/domain/toolbox";
import notifier from "node-notifier";

/**
 * Show a native notification on macOS, Windows, Linux.
 */
export default {
    name: "notify",
    execute: (toolbox: Toolbox) => {
        toolbox.notify = notifier;
    },
};
