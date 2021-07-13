import chalk from "chalk";
import stripAnsi from "strip-ansi";
import windowSizeLib from "window-size";

import { ConfigType, Logger as ILogger } from "../types";
import Dumper, { dd, dump } from "./dumper-tools.js";
import {
    print as printTools,
    VERBOSITY_DEBUG,
    VERBOSITY_NORMAL,
    VERBOSITY_QUIET,
    VERBOSITY_VERBOSE,
    VERBOSITY_VERY_VERBOSE,
} from "./print-tools.js";

let windowSize = windowSizeLib;

/* istanbul ignore next */
if (typeof windowSize === "undefined") {
    // this is required when message executed in non terminal window -- such as VSCode code runner
    windowSize = { width: 100 };
}

const dumper = new Dumper();

const icons = {
    critical: "🚫",
    danger: "🚫",
    debug: "◼",
    error: "✖",
    info: "⌽",
    log: "⇢",
    note: "◉",
    notice: "◉",
    status: "◯",
    success: "✔",
    warning: "⚠️",
};

class LoggerTools implements ILogger {
    // eslint-disable-next-line class-methods-use-this
    public clear(): void {
        printTools.clear();
    }

    /**
     *
     *
     * @param {*} [config={}]
     * @return {*}
     */
    public print(config: Partial<ConfigType> = {}) {
        const alertConfig = LoggerTools.validateConfig({
            type: "info",
            msg: "",
            icon: false,
            ...config,
        });

        return this[alertConfig.type](alertConfig.msg, alertConfig.label, alertConfig.icon);
    }

    // eslint-disable-next-line class-methods-use-this
    public critical(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("critical")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("critical")}  ` : "";
        const output = `${chalk.bgKeyword("orangered").black(label)}${label ? " " : ""}${icon}${chalk.keyword(
            "orangered",
        )(LoggerTools.formatMessage(message_))}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public error(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("error")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("error")} ` : "";

        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgRed.black(label)}${label ? " " : ""}${chalk.red(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public danger(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("danger")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("danger")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgRed.black(label)}${label ? " " : ""}${chalk.red(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public success(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("success")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("success")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgGreen.black(label)}${label ? " " : ""}${chalk.green(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public warning(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("warning")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("warning")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgYellow.black(label)}${label ? " " : ""}${chalk.yellow(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public info(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("info")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("info")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgCyan.black(label)}${label ? " " : ""}${chalk.cyan(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public debug(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("debug")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("debug")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgKeyword("darkgray").black(label)}${label ? " " : ""}${chalk.gray(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public log(message_: any, label_: string = "", showIcon: boolean = false): string {
        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("log")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgWhite.black(label)}${label ? " " : ""}${icon + message}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public status(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("status")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("status")} ` : "";
        const message = LoggerTools.formatMessage(message_);

        const output = `${chalk.bgMagenta.black(label)}${label ? " " : ""}${chalk.magenta(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public notice(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("notice")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("notice")} ` : "";
        const message = LoggerTools.formatMessage(message_);
        const output = `${chalk.bgBlue.black(label)}${label ? " " : ""}${chalk.blue(icon + message)}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public note(message_: any, label_: string = "", showIcon: boolean = false): string {
        if (!LoggerTools.isPrintable("note")) {
            return "";
        }

        const label = label_ ? ` ${label_} ` : "";
        const icon = showIcon ? `${LoggerTools.getIcon("note")} ` : "";
        const message = LoggerTools.formatMessage(message_);
        const output = `${chalk.bgKeyword("orange").black(label)}${label ? " " : ""}${chalk.keyword("orange")(
            icon + message,
        )}`;

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public processing(message: string): void {
        console.log(chalk.yellow(message));
    }

    // eslint-disable-next-line class-methods-use-this
    public terminalInfo() {
        return windowSize;
    }

    // eslint-disable-next-line class-methods-use-this
    public dd(...data) {
        if (!LoggerTools.isPrintable("debug")) {
            return;
        }

        dd(data);
    }

    // eslint-disable-next-line class-methods-use-this
    public dump(...data) {
        if (!LoggerTools.isPrintable("debug")) {
            return;
        }

        dump(data);
    }

    /**
     * line
     *
     * @param {string} [message=""]
     */
    // eslint-disable-next-line class-methods-use-this
    public line(message: string = ""): string {
        let output = message;

        if (typeof windowSize !== "undefined") {
            output = message.repeat(windowSize.width - 2);
        }

        printTools.print(output);

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    public center(message: any, fillText: string = " "): string {
        // if the terminal width is shorter than message length, dont display fillText
        const width: number = typeof windowSize === "undefined" ? 100 : +windowSize.width;

        if (stripAnsi(message).length >= width) {
            printTools.print(message);

            return message;
        }

        const left = Number.parseInt(String((width - stripAnsi(message).length) / 2), 10);
        const padString = fillText.repeat(left / stripAnsi(fillText).length);
        const output = padString + message + padString;

        printTools.print(output);

        return output;
    }

    public static isDebug(): boolean {
        return Number(process.env.CEREBRO_OUTPUT_LEVEL) === VERBOSITY_DEBUG;
    }

    public static isVerbose(): boolean {
        return Number(process.env.CEREBRO_OUTPUT_LEVEL) === VERBOSITY_VERBOSE;
    }

    public static isVeryVerbose(): boolean {
        return Number(process.env.CEREBRO_OUTPUT_LEVEL) === VERBOSITY_VERY_VERBOSE;
    }

    public static isQuiet(): boolean {
        return Number(process.env.CEREBRO_OUTPUT_LEVEL) === VERBOSITY_QUIET;
    }

    private static getIcon(type: string): string {
        return icons[type];
    }

    private static validateConfig(config: Partial<ConfigType> = {}): ConfigType {
        const finalConfig = Object.assign(config);

        finalConfig.type = finalConfig.type === "" ? "info" : finalConfig.type;
        finalConfig.label = config.label || "";

        return finalConfig;
    }

    private static formatMessage(message: string | object): string {
        let result = message;

        if (Array.isArray(message)) {
            return message.join(" ");
        }

        if (typeof message === "object") {
            result = `\r\n${dumper.generateDump(message)}\r\n`;
        }

        return result as string;
    }

    private static isPrintable(name: string): boolean {
        switch (name) {
            case "debug":
                return Number(process.env.CEREBRO_OUTPUT_LEVEL) !== VERBOSITY_QUIET && LoggerTools.isDebug();
            case "danger":
            case "error":
            case "info":
            case "note":
            case "notice":
            case "status":
            case "success":
            case "warning":
                return (
                    Number(process.env.CEREBRO_OUTPUT_LEVEL) !== VERBOSITY_QUIET
                    && [VERBOSITY_NORMAL, VERBOSITY_VERBOSE, VERBOSITY_VERY_VERBOSE, VERBOSITY_DEBUG].includes(
                        Number(process.env.CEREBRO_OUTPUT_LEVEL),
                    )
                );
            default:
                return true;
        }
    }
}

const logger = new LoggerTools();

export default logger;
