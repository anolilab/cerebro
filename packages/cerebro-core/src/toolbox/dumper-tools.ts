import callerId from "caller-id";
import chalk from "chalk";
import cycle from "cycle";
import kindOf from "kind-of";

class Dumper {
    private currentDepth: number;

    private readonly spaces: string;

    private readonly depth: number | undefined;

    /**
     * @param {object} options_
     */
    public constructor(options_: { indent?: number; depth?: number | undefined } = {}) {
        const settings = {
            indent: 4,
            depth: undefined,
            ...options_,
        };

        this.spaces = " ".repeat(settings.indent); // Number of spaces to indent the object with
        this.currentDepth = 0;
        this.depth = settings.depth; // depth to show
    }

    /**
     * Iterates over each property of the provided object and make the output.
     *
     * @param {*} toDump
     * @param {string|null} indent
     * @return {string}
     */
    public generateDump(toDump, indent: string | null = "") {
        let output = "";

        let startWith = "";
        let endWith = "";

        switch (kindOf(toDump)) {
            case "array":
                startWith = `${chalk.bold.black("array")} (size=${toDump.length}) [\n`;
                endWith = `${indent}]`;
                break;
            case "object":
                startWith = `${chalk.bold.black("object")} (size=${Object.keys(cycle.decycle(toDump)).length}) {\n`;
                endWith = `${indent}}`;
                break;
            default:
                return this.prepareValueDump(indent, toDump);
        }

        // For each key of the object, keep
        // preparing the inspection output
        for (const itemKey in toDump) {
            if (!Object.prototype.hasOwnProperty.call(toDump, itemKey)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            const originalValue = toDump[itemKey];
            const originalParameterType = kindOf(originalValue);
            const valueDump = this.prepareValueDump(indent, originalValue);

            output += this.makeArrowString(originalParameterType, indent, itemKey, valueDump);
        }

        return startWith + output + endWith;
    }

    /**
     * Prepare the dump output for the given value
     *
     * @param indent
     * @param originalValue
     * @return {*|string}
     */
    private prepareValueDump(indent, originalValue) {
        let displayValue;
        let displayType = kindOf(originalValue);

        switch (displayType) {
            case "array":
            case "object":
                displayType = "";
                if (this.depth && this.currentDepth === this.depth) {
                    displayValue = `${chalk.bold.black("object")} (size=${Object.keys(originalValue).length})`;
                } else {
                    this.incrementDepth();
                    displayValue = this.generateDump(originalValue, `${indent}${this.spaces}`);
                    this.decrementDepth();
                }
                break;
            case "boolean":
                displayType = "boolean";
                displayValue = chalk.magenta(`${originalValue}`);
                break;
            case "string":
                displayType = "string";
                displayValue = `${chalk.red(`"${originalValue}"`)} (length=${originalValue.length})`;
                break;
            case "null":
                displayType = "";
                displayValue = chalk.blue("null");
                break;
            case "undefined":
                displayType = "";
                displayValue = chalk.blue("undefined");
                break;
            case "number":
                displayType = Number.isInteger(originalValue) ? "int" : "float";
                displayValue = chalk.green(originalValue);
                break;
            case "function":
            case "generatorfunction":
                displayType = "";
                displayValue = Dumper.formatFunction(originalValue);
                break;
            case "regexp":
                displayType = "";
                displayValue = chalk.blue(originalValue);
                break;
            default:
                displayType = "";
                displayValue = originalValue;
                break;
        }

        const spacer = displayType.length > 0 ? " " : "";

        return `${chalk.cyan(displayType)}${spacer}${displayValue}`;
    }

    /**
     * Format function to log it inside the console.
     */
    private static formatFunction(originalValue: any): string {
        return originalValue.toString().slice(0, 50).replace(/\n/g, "").replace(/\s+/g, " ");
    }

    private makeArrowString(
        parameterType: string,
        indent: string | null,
        key: string | number,
        valueDump: any,
    ): string {
        const startWith = `${indent}${this.spaces}`;
        const valuePart = `${valueDump},\n`;

        const keyPart = Number.isInteger(Number.parseInt(String(key), 10)) || (parameterType === "array" && typeof key !== "string")
            ? `[${key}]`
            : `'${key}'`;

        return `${startWith + keyPart} => ${valuePart}`;
    }

    private incrementDepth() {
        if (this.depth) {
            this.currentDepth++;
        }
    }

    private decrementDepth() {
        if (this.depth) {
            this.currentDepth--;
        }
    }
}

function dump(object: any) {
    const dumper = new Dumper();
    const caller = callerId.getData();

    // Print the file path, line number and generated dump
    console.log(`${caller.filePath}:${caller.lineNumber}:`);
    console.log(dumper.generateDump(object));
}

function dd(object: any) {
    const dumper = new Dumper();
    const caller = callerId.getData();

    // Print the file path, line number and generated dump
    console.log(`${caller.filePath}:${caller.lineNumber}:`);
    console.log(dumper.generateDump(object));

    process.exit(0);
}

export default Dumper;
export { dd, dump };
