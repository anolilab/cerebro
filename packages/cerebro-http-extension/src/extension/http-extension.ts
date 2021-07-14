import IToolbox from "@anolilab/cerebro-core/types/domain/toolbox";
import got from "got";

/**
 * An extension to talk to internet.
 */
export default {
    name: "http",
    execute: (toolbox: IToolbox): void => {
        toolbox.http = got;
    },
};
