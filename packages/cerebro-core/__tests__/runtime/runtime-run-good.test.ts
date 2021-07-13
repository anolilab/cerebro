import expect from "expect";
import { Runtime } from "../../src/runtime/runtime";

test("runs a addCommand", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
    const toolbox = await r.run("three");

    expect(toolbox.result).toEqual([1, 2, 3]);
});

test("runs an aliased addCommand", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
    const toolbox = await r.run("o");

    expect(toolbox.result).toBe(1);
});

test("runs a nested addCommand", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`);
    const toolbox = await r.run("thing foo");
    expect(toolbox.command).toBeTruthy();
    expect(toolbox.command.name).toBe("foo");
    expect(toolbox.command.commandPath).toEqual(["thing", "foo"]);
    expect(toolbox.result).toBe("nested thing foo has execute");
});

test("runs a nested addCommand in build folder", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested-build`);
    const toolbox = await r.run("thing foo");
    expect(toolbox.command).toBeTruthy();
    expect(toolbox.command.name).toBe("foo");
    expect(toolbox.command.commandPath).toEqual(["thing", "foo"]);
    expect(toolbox.result).toBe("nested thing foo in build folder has execute with loaded extension");
});

test("runs a addCommand with no name prop", async () => {
    const r = new Runtime();
    r.addCoreExtensions();
    r.addPlugin(`${__dirname}/../fixtures/good-plugins/missing-name`);
    const toolbox = await r.run("foo");
    expect(toolbox.command).toBeTruthy();
    expect(toolbox.command.name).toBe("foo");
});
