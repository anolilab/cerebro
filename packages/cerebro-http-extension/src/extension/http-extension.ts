import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";
import got from "got";

/**
 * An extension to talk to internet.
 */
export default {
    name: "http",
    execute: (toolbox: Toolbox): void => {
        toolbox.http = got;
    },
};
