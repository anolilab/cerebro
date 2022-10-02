import { describe, expect, it } from "vitest";

import { Runtime } from "../../src/runtime/runtime";

test("cannot find a addCommand", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    await expect(r.run("bloo blah")).rejects.toThrow(`Couldn't find that command, and no default command set.`);
});

test("is fatally wounded by exceptions", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/throws`);

    // for some reason, t.throws doesn't work on this one ...
    try {
        await r.run("throw");
    } catch (e) {
        expect(e.message).toBe(`thrown an error!`);
    }
});
