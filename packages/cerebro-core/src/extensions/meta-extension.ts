import { checkForUpdate, getPackageJSON, getVersion } from "../toolbox/meta-tools.js";
import { Extension as IExtension, Meta as IMeta, Toolbox as IToolbox } from "../types";

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default {
    name: "meta",
    execute: (toolbox: IToolbox): void => {
        toolbox.meta = {
            version: () => getVersion(toolbox),
            packageJSON: () => getPackageJSON(toolbox),
            checkForUpdate: () => checkForUpdate(toolbox),
        } as IMeta;
    },
} as IExtension;
