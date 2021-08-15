const head = <T>(a: T[]): T => a[0];
const tail = <T>(a: T[]): T[] => a.slice(1);
const identity = (a) => a;
const isNil = (a: any): boolean => a === null || typeof a === "undefined";
const split = (b: string, a: string): string[] => a.split(b);
const trim = (a: string): string => a.trim();
const forEach = <T>(f: (index: T) => void, a: T[]) => a.forEach(f);
const keys = (a: Object): string[] => (Object(a) !== a ? [] : Object.keys(a));
const replace = (b: string | RegExp, c: string, a: string): string => a.replace(b, c);
const last = <T>(a: T[]): T => a[a.length - 1];
const reject = <T>(f: (index: T) => boolean, a: T[]): T[] => a.filter((b) => !f(b));
const is = (Ctor: any, value: any): boolean => (typeof value !== "undefined" && value.constructor === Ctor) || value instanceof Ctor;
const takeLast = <T>(n: number, a: T[]): T[] => a.slice(-1 * n);
const equals = (a: string[], b: string[]) => a.length === b.length && a.every((v, index) => v === b[index]);
const times = (function_: Function, n: number) => {
    const list = Array.from({ length: n });

    for (let index = 0; index < n; index++) {
        list[index] = function_(index);
    }

    return list;
};
const property = (p: string, object: Object) => object[p];
const isBlank = (value: any): boolean => !is(String, value) || trim(value) === "";

function isElectronApp() {
    // process.versions.electron is either set by electron, or undefined
    // see https://github.com/electron/electron/blob/master/docs/api/process.md#processversionselectron-readonly
    return !!(process as ElectronProcess).versions.electron;
}

function isBundledElectronApp() {
    // process.defaultApp is either set by electron in an electron unbundled app, or undefined
    // see https://github.com/electron/electron/blob/master/docs/api/process.md#processdefaultapp-readonly
    return isElectronApp() && !(process as ElectronProcess).defaultApp;
}

function getProcessArgvBinIndex() {
    // The binary name is the first command line argument for:
    // - bundled Electron apps: bin argv1 argv2 ... argvn
    if (isBundledElectronApp()) return 0;
    // or the second one (default) for:
    // - standard node apps: node bin.js argv1 argv2 ... argvn
    // - unbundled Electron apps: electron bin.js argv1 arg2 ... argvn
    return 1;
}

interface ElectronProcess extends NodeJS.Process {
    defaultApp?: boolean;
    versions: NodeJS.ProcessVersions & {
        electron: string;
    };
}

function hideBin(argv: string[]) {
    return argv.slice(getProcessArgvBinIndex() + 1);
}

function getProcessArgvBin() {
    return process.argv[getProcessArgvBinIndex()];
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/**
 * Utility to figure out the shell used on the system.
 *
 * Sadly, we can't use `echo $0` in node, maybe with more work. So we rely on
 * process.env.SHELL.
 *
 * TODO: More work on this, namely to detect Git bash on Windows (bash.exe)
 */
const getSystemShell = () => (process.env.SHELL || "").split("/").slice(-1)[0];

export {
    head,
    identity,
    isNil,
    split,
    tail,
    trim,
    forEach,
    keys,
    replace,
    last,
    reject,
    is,
    takeLast,
    equals,
    times,
    property as prop,
    isBlank,
    hideBin,
    getProcessArgvBin,
    asyncForEach,
    getSystemShell,
};
