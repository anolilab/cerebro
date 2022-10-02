import { describe, expect, it } from "vitest";

import system from "../../src/toolbox/system-tools";

test("which - existing package", () => {
    const result = system.which("node");
    expect(result).not.toBe(null);
});

test("which - non-existing package", () => {
    const result = system.which("non-existing-package");
    expect(result).toBe(null);
});

test("execute - should reject if the addCommand does not exist", async () => {
    try {
        await system.run('echo "hi" && non-existing-command');
    } catch (e) {
        expect(e.stdout).toContain("hi");
        if (process.platform === "win32") {
            expect(e.stderr).toContain("is not recognized as an internal or external addCommand");
        } else {
            expect(e.stderr).toContain("not found");
        }
    }
});

test("execute - should resolve if the addCommand exists", async () => {
    // `echo` should be a general addCommand for both *nix and windows
    await expect(system.run("echo cerebro", { trim: true })).resolves.toBe("cerebro");
});
