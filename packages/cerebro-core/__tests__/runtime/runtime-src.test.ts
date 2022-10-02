import { describe, expect, it } from "vitest";

import { Runtime } from "../../src/runtime/runtime";

test("runs a addCommand explicitly", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    expect(r.plugin).toBeFalsy();
    r.loadModules(`${__dirname}/../fixtures/good-plugins/threepack`);
    expect(r.plugin).toBeTruthy();
    const toolbox = await r.run("three");

    expect(toolbox.plugin).toBeTruthy();
    expect(toolbox.command).toBeTruthy();
    expect(toolbox.plugin.name).toBe("3pack");
    expect(toolbox.command.name).toBe("three");
    expect(toolbox.result).toEqual([1, 2, 3]);
});

test("runs a addCommand via passed in args", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    expect(r.plugin).toBeFalsy();
    r.loadModules(`${__dirname}/../fixtures/good-plugins/threepack`);
    expect(r.plugin).toBeTruthy();
    const toolbox = await r.run("three");
    expect(toolbox.plugin).toBeTruthy();
    expect(toolbox.command).toBeTruthy();
    expect(toolbox.plugin.name).toBe("3pack");
    expect(toolbox.command.name).toBe("three");
    expect(toolbox.result).toEqual([1, 2, 3]);
});
