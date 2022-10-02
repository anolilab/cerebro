import { describe, expect, it } from "vitest";

import { Runtime } from "../../src/runtime/runtime";

test("loads the core extensions in the right order", () => {
    const r = new Runtime();
    r.addCoreExtensions();
    const list = r.extensions.map((x) => x.name).join(", ");

    expect(list).toBe(
        "meta, print, system, prompt",
    );
});

test("loads async extensions correctly", async () => {
    const r = new Runtime();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/async-extension`);
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);

    const toolbox = await r.run("three");

    expect(toolbox.asyncData).toBeDefined();
    expect(toolbox.asyncData.a).toEqual(1);
});
