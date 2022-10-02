import {
    checkForUpdate, getPackageJSON, getVersion, onAbort,
} from "../toolbox/meta-tools.js";
import { Extension as IExtension, Meta as IMeta, Toolbox as IToolbox } from "../types";

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default {
    name: "meta",
    execute: (toolbox: IToolbox): void => {
        // eslint-disable-next-line no-param-reassign
        toolbox.meta = {
            version: () => getVersion(toolbox),
            packageJSON: () => getPackageJSON(toolbox),
            checkForUpdate: () => checkForUpdate(toolbox),
            onAbort,
        } as IMeta;
    },
} as IExtension;
