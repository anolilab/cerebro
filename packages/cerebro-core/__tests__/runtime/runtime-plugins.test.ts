import { describe, expect, it } from "vitest";

import { Runtime } from "../../src/runtime/runtime";

test("loads all sub-directories", () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugins(`${__dirname}/../fixtures/good-plugins`);

    expect(16).toBe(r.plugins.length);
});

test("matches sub-directories", () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugins(`${__dirname}/../fixtures/good-plugins`, { matching: "blank-*" });
    expect(1).toBe(r.plugins.length);
});

test("hides commands", () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugins(`${__dirname}/../fixtures/good-plugins`, {
        matching: "threepack",
        hidden: true,
    });
    expect(r.plugins.length).toBe(1);
    expect(r.plugins[0].commands[2].hidden).toBe(true);
});

test("addPlugins ignores bad directories", () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugins(__filename);
    r.addPlugins(null);
    r.addPlugins(undefined);
    r.addPlugins("");
    expect(0).toBe(r.plugins.length);
});

test("commands and defaultCommand work properly even when multiple plugins are loaded", async () => {
    const r = new Runtime("default-addCommand");
    r.addCoreExtensions();
    r.loadModules(`${__dirname}/../fixtures/good-plugins/nested`);
    r.addCommand({
        name: "default-command",
        execute: () => null,
    });
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);

    expect(2).toBe(r.plugins.length);

    let toolbox = await r.run("");

    expect(toolbox.command.name).toBe("default-addCommand");

    toolbox = await r.run("one");

    expect(toolbox.command.name).toBe("one");
});
