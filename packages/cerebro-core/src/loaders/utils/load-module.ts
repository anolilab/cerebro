import jetpack from "fs-jetpack";

import { isBlank } from "../../toolbox/utils.js";

function esmResolver(output: any) {
    // eslint-disable-next-line no-underscore-dangle
    return output && output.__esModule && output.default ? output.default : output;
}

export default async function loadModule(path) {
    if (isBlank(path)) {
        throw new Error("path is required");
    }

    if (jetpack.exists(path) !== "file") {
        throw new Error(`${path} is not a file`);
    }

    try {
        const module = esmResolver(await import(path));
        // if they use `export default` rather than `module.exports =`, we extract that
        return module.default || module;
    } catch (error: any) {
        if (["MODULE_NOT_FOUND", "ERR_MODULE_NOT_FOUND"].includes(error.code)) {
            // eslint-disable-next-line consistent-return
            return;
        }

        throw error;
    }
}
