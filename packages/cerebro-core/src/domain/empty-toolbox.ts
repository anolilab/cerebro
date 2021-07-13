import {
    Cli as ICli,
    Command as ICommand,
    EmptyToolbox as IEmptyToolbox,
    Logger as ILogger,
    Meta as IMeta,
    Parameters as IParameters,
    Print as IPrint,
    Prompts as IPrompts,
    System as ISystem,
} from "../types";

class EmptyToolbox implements IEmptyToolbox {
    [x: string]: any;

    public result?: any;

    public parameters?: IParameters = { options: {} };

    public command?: ICommand;

    public commandName?: string;

    public runtime?: ICli;

    meta?: IMeta;

    print?: IPrint;

    prompts?: IPrompts;

    system?: ISystem;

    generate?: any;

    logger?: ILogger;
}

export default EmptyToolbox;
