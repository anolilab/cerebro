import type { Extension as IExtension, Toolbox as IToolbox } from "@anolilab/cerebro-core";
import got from "got";

/**
 * An extension to talk to internet.
 */
export default {
    name: "http",
    execute: (toolbox: IToolbox): void => {
        toolbox.http = got;
    },
} as IExtension;
