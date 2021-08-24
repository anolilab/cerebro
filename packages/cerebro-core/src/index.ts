import { print } from "./toolbox/print-tools.js";
import system from "./toolbox/system-tools.js";
import {
    asyncForEach,
    equals,
    forEach,
    getProcessArgvBin,
    head,
    hideBin,
    identity,
    is,
    isBlank,
    isNil,
    keys,
    last,
    prop as property,
    reject,
    replace,
    split,
    tail,
    takeLast,
    times,
    trim,
} from "./toolbox/utils.js";

export { default as Cli } from "./cli.js";
export { CommandLoader } from "./loaders/command-loader.js";
export { ExtensionLoader } from "./loaders/extension-loader.js";
export { default as ModuleLoader } from "./loaders/utils/load-module.js";

export const toolbox = {
    system,
    print,
    utils: {
        equals,
        hideBin,
        is,
        takeLast,
        last,
        reject,
        asyncForEach,
        forEach,
        keys,
        replace,
        isBlank,
        head,
        identity,
        isNil,
        tail,
        trim,
        prop: property,
        getProcessArgvBin,
        split,
        times,
    },
};

export type {
    Print,
    Parameters,
    Timer,
    System,
    Cli,
    Toolbox,
    EmptyToolbox,
    StringOrBuffer,
    PrintTableOptions,
    Options,
    TableStyle,
    Meta,
    PackageJSON,
    Logger,
    Loader,
    Extension,
    ExtensionSetup,
    ExtensionOverrides,
    Command,
    Prompts,
    Questions,
    CerebroError,
} from "./types";
