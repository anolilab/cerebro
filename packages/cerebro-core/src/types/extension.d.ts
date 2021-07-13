import { EmptyToolbox as IEmptyToolbox } from "./toolbox";

export interface ExtensionOverrides {}

export type ExtensionSetup = (toolbox: IEmptyToolbox & ExtensionOverrides) => void | Promise<void>;

/**
 * An extension will add functionality to the toolbox that each addCommand will receive.
 */
export interface Extension {
    /** The name of the extension. */
    name: string;
    /** The description. */
    description?: string;
    /** The file this extension comes from. */
    file?: string;
    /** The function used to attach functionality to the toolbox. */
    execute: ExtensionSetup
}
