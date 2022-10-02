import { toolbox } from "@anolilab/cerebro-core";
import { filesystem } from "@anolilab/cerebro-filesystem-extension";

const { is } = toolbox.utils;

function isPatternIncluded(data: string, findPattern: string | RegExp): boolean {
    if (!findPattern) {
        return false;
    }

    return typeof findPattern === "string" ? data.includes(findPattern) : findPattern.test(data);
}

function insertNextToPattern(data: string, options: PatchingPatchOptions) {
    // Insert before/after a particular string
    const findPattern: string | RegExp | undefined = options.before || options.after;

    // sanity check the findPattern
    const patternIsString = typeof findPattern === "string";

    if (typeof findPattern === "undefined" || (!(findPattern instanceof RegExp) && !patternIsString)) {
        return false;
    }

    const isPatternFound = isPatternIncluded(data, findPattern);
    if (!isPatternFound) return false;

    let originalString;

    if (patternIsString) {
        originalString = findPattern;
    } else {
        const match = data.match(findPattern);

        if (match === null) {
            return false;
        }

        // eslint-disable-next-line prefer-destructuring
        originalString = match[0];
    }

    const newContents = options.after
        ? `${originalString}${options.insert || ""}`
        : `${options.insert || ""}${originalString}`;

    return data.replace(findPattern, newContents);
}

/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
export async function exists(filename: string, findPattern: string | RegExp): Promise<boolean> {
    // sanity check the filename
    if (!is(String, filename) || filesystem.isNotFile(filename)) return false;

    // sanity check the findPattern
    const patternIsString = typeof findPattern === "string";
    if (!(findPattern instanceof RegExp) && !patternIsString) return false;

    // read from jetpack -- they guard against a lot of the edge
    // cases and return nil if problematic
    const contents = filesystem.read(filename);

    // only let the strings pass
    if (!is(String, contents)) {
        return false;
    }

    // do the appropriate check
    return isPatternIncluded(contents as string, findPattern);
}

export async function readFile(filename: string): Promise<string | undefined> {
    // bomb if the file doesn't exist
    if (!filesystem.isFile(filename)) throw new Error(`file not found ${filename}`);

    // check type of file (JSON or not)
    if (filename.endsWith(".json")) {
        return filesystem.readAsync(filename, "json");
    }

    return filesystem.readAsync(filename, "utf8");
}

/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
export async function update(
    filename: string,
    callback: (contents: string | object) => string | object | false,
): Promise<string | object | false> {
    const contents = await readFile(filename);

    if (!is(String, contents)) {
        return false;
    }

    // let the caller mutate the contents in memory
    const mutatedContents = callback(contents as string);

    // only write if they actually sent back something to write
    if (mutatedContents !== false) {
        await filesystem.writeAsync(filename, mutatedContents, { atomic: true });
    }

    return mutatedContents;
}

/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
export async function prepend(filename: string, prependedData: string): Promise<string | false> {
    return update(filename, (data) => prependedData + data) as Promise<string | false>;
}

/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
export async function append(filename: string, appendedData: string): Promise<string | false> {
    return update(filename, (data) => data + appendedData) as Promise<string | false>;
}

/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
export async function replace(filename: string, oldContent: string, newContent: string): Promise<string | false> {
    return update(filename, (data) => (data as string).replace(oldContent, newContent)) as Promise<string | false>;
}

export function patchString(data: string, options: PatchingPatchOptions = {}): string | false {
    // Already includes string, and not forcing it
    if (typeof options.insert === "undefined" || (isPatternIncluded(data, options.insert) && !options.force)) {
        return false;
    }

    // delete <string> is the same as replace <string> + insert ''
    const replaceString = options.delete || options.replace;

    if (replaceString) {
        if (!isPatternIncluded(data, replaceString)) {
            return false;
        }

        // Replace matching string with new string or nothing if nothing provided
        return data.replace(replaceString, `${options.insert || ""}`);
    }

    return insertNextToPattern(data, options);
}

/**
 * Conditionally places a string into a file before or after another string,
 * or replacing another string, or deletes a string. Async.
 *
 * @param filename        File to be patched
 * @param options            Options
 * @param options.insert     String to be inserted
 * @param options.before     Insert before this string
 * @param options.after      Insert after this string
 * @param options.replace    Replace this string
 * @param options.delete     Delete this string
 * @param options.force      Write even if it already exists
 *
 * @example
 *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
export async function patch(filename: string, ...options: PatchingPatchOptions[]): Promise<string | boolean> {
    return update(filename, (data) => {
        const result = options.reduce(
            (updatedData: string, opt: PatchingPatchOptions) => patchString(updatedData, opt) || updatedData,
            data as string,
        );

        return result !== data && result;
    }) as Promise<string | boolean>;
}

export const patching: Patching = {
    update,
    append,
    prepend,
    replace,
    patch,
    exists,
};

export interface Patching {
    /**
     * Checks if a string or pattern exists in a file.
     */
    exists(filename: string, findPattern: string | RegExp): Promise<boolean>;
    /**
     * Updates a file.
     */
    update(filename: string, callback: (contents: any) => any): Promise<string | object | boolean>;
    /**
     * Appends to the end of a file.
     */
    append(filename: string, contents: string): Promise<string | boolean>;
    /**
     * Prepends to the start of a files.
     */
    prepend(filename: string, contents: string): Promise<string | boolean>;
    /**
     * Replaces part of a file.
     */
    replace(filename: string, searchFor: string, replaceWith: string): Promise<string | boolean>;
    /**
     * Makes a patch inside file.
     */
    patch(filename: string, ...options: PatchingPatchOptions[]): Promise<string | boolean>;
}

export interface PatchingPatchOptions {
    /* String to be inserted */
    insert?: string;
    /* Insert before this string */
    before?: string | RegExp;
    /* Insert after this string */
    after?: string | RegExp;
    /* Replace this string */
    replace?: string | RegExp;
    /* Delete this string */
    delete?: string | RegExp;
    /* Write even if it already exists  */
    force?: boolean;
}
