import { EmptyToolbox as IEmptyToolbox, Extension as IExtension } from "../types";

export type ExtensionSetup = (toolbox: IEmptyToolbox) => void | Promise<void>;

/**
 * An extension will add functionality to the toolbox that each addCommand will receive.
 */
export class Extension implements IExtension {
    /** The description. */
    public description?: string;

    /** The file this extension comes from. */
    public file?: string;

    /**
     * @param name The name of the extension.
     * @param execute The function used to attach functionality to the toolbox.
     */
    constructor(public name: string, public execute: ExtensionSetup) {}
}
