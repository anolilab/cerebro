import jetpack from "fs-jetpack";

import { isBlank } from "../../toolbox/utils.js";

export default function loadRequire(path) {
    if (isBlank(path)) {
        throw new Error("path is required");
    }

    if (jetpack.exists(path) !== "file") {
        throw new Error(`${path} is not a file`);
    }

    try {
        return require(path);
    } catch (error) {
        if (["MODULE_NOT_FOUND", "ERR_MODULE_NOT_FOUND"].includes(error.code)) {
            return;
        }

        throw error;
    }
}
