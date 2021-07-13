import { OptionDefinition } from "command-line-usage";

const defaultArguments: OptionDefinition[] = [
    {
        name: "verbose",
        description: "turn on verbose output",
        type: Boolean,
        group: "global",
    },
    {
        name: "very-verbose",
        description: "turn on very-verbose output",
        type: Boolean,
        group: "global",
    },
    {
        name: "debug",
        description: "turn on debugging output",
        type: Boolean,
        group: "global",
    },
    {
        name: "help",
        description: "print out helpful usage information",
        type: Boolean,
        alias: "h",
        group: "global",
    },
    {
        name: "quiet",
        description: "silence output",
        type: Boolean,
        alias: "q",
        group: "global",
    },
    {
        name: "version",
        description: "print version info.",
        type: Boolean,
        alias: "V",
        group: "global",
    },
];

export default defaultArguments;
