import {
    Cli as ICli,
    ExtensionOverrides as IExtensionOverrides,
    Logger as ILogger,
    Meta as IMeta,
    Parameters,
    Print as IPrint,
    Prompts as IPrompts,
    System as ISystem,
    Toolbox as IToolbox,
} from "../types";
import EmptyToolbox from "./empty-toolbox.js";

class Toolbox extends EmptyToolbox implements IToolbox, IExtensionOverrides {
    public parameters: Parameters = { options: {} };

    // @ts-ignore
    public runtime: ICli;

    // known extensions
    // @ts-ignore
    meta: IMeta;

    // @ts-ignore
    print: IPrint;

    // @ts-ignore
    prompts: IPrompts;

    // @ts-ignore
    system: ISystem;

    // @ts-ignore
    generate: any;

    // @ts-ignore
    logger: ILogger;
}

export default Toolbox;
