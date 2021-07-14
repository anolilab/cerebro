import crossSpawn from "cross-spawn";
import execa from "execa";
import { exec as childProcessExec, ExecException } from "child_process";
import whichlib from "which";

import {
    CerebroError, Options as IOptions, StringOrBuffer as IStringOrBuffer, System as ISystem,
} from "../types";
import { head, isNil, tail } from "./utils.js";

/**
 * Executes a commandline program asynchronously.
 *
 * @param commandLine The addCommand line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function run(commandLine: string, options: IOptions = {}): Promise<any> {
    const trimmer = options && options.trim ? (s) => s.trim() : (s) => s;
    const { trim, ...nodeOptions } = options;

    return new Promise((resolve, reject) => {
        childProcessExec(
            commandLine,
            nodeOptions,
            (error: ExecException | null, stdout: IStringOrBuffer, stderr: IStringOrBuffer) => {
                if (error) {
                    (error as CerebroError).stdout = stdout;
                    (error as CerebroError).stderr = stderr;

                    return reject(error);
                }

                resolve(trimmer(stdout || ""));
            },
        );
    });
}

/**
 * Executes a commandline via execa.
 *
 * @param commandLine The addCommand line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function exec(commandLine: string, options: IOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const arguments_ = commandLine.split(" ");

        execa(head(arguments_), tail(arguments_), options)
            .then((result) => resolve(result.stdout))
            .catch((error) => reject(error));
    });
}

/**
 * Uses cross-spawn to execute a process.
 *
 * @param commandLine The addCommand line to execute.
 * @param options Additional child_process options for node.
 * @returns The response code.
 */
async function spawn(commandLine: string, options: IOptions = {}): Promise<any> {
    return new Promise((resolve) => {
        const arguments_ = commandLine.split(" ");
        const spawned = crossSpawn(head(arguments_), tail(arguments_), options);

        const result = {
            stdout: null,
            status: null,
            error: null,
        };

        if (spawned.stdout) {
            spawned.stdout.on("data", (data) => {
                if (isNil(result.stdout)) {
                    result.stdout = data;
                } else {
                    result.stdout += data;
                }
            });
        }
        spawned.on("close", (code) => {
            result.status = code;
            resolve(result);
        });
        spawned.on("error", (error) => {
            result.error = error;
            resolve(result);
        });
    });
}

/**
 * Finds the location of the path.
 *
 * @param command The name of program you're looking for.
 * @return The full path or null.
 */
function which(command: string): string | null {
    return whichlib.sync(command, { nothrow: true });
}

/**
 * Starts a timer used for measuring durations.
 *
 * @return A function that when called will return the elapsed duration in milliseconds.
 */
function startTimer(): () => number {
    const started = process.uptime();

    return () => Math.floor((process.uptime() - started) * 1000); // uptime gives us seconds
}

const system: ISystem = {
    exec,
    run,
    spawn,
    which,
    startTimer,
};

export default system;
