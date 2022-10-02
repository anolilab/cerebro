import { describe, expect, it } from "vitest";

import Command from "../../src/domain/command";
import { Plugin } from "../../src/domain/plugin";
import Toolbox from "../../src/domain/toolbox";
import { Runtime } from "../../src/runtime/runtime";
import { commandInfo } from "../../src/toolbox/meta-tools";

test("commandInfo", () => {
    const fakeToolbox = new Toolbox();
    const fakeCommand = new Command();

    fakeToolbox.runtime = new Runtime();
    // fakeToolbox.runtime.addCoreExtensions();

    fakeCommand.name = "foo";
    fakeCommand.description = "foo is a addCommand";
    fakeCommand.commandPath = ["foo"];
    fakeCommand.alias = ["f"];

    const runtime = fakeToolbox.runtime as any;
    runtime.commands = [fakeCommand];

    const info = commandInfo(fakeToolbox);
    expect(info).toEqual([["foo (f)", "foo is a addCommand"]]);
});

test("addCommand name on nested addCommand with name", () => {
    const fakeContext = new Toolbox();
    const fakeCommand = new Command();
    const commandDescription = "ubi is a addCommand";

    fakeContext.runtime = new Runtime();
    fakeContext.runtime.addCoreExtensions();

    fakeCommand.name = "ubi";
    fakeCommand.description = commandDescription;
    fakeCommand.commandPath = ["foo", "bar", "baz"];
    fakeCommand.alias = ["u"];


    const fakeRuntime = fakeContext.runtime as any;
    fakeRuntime.commands = [fakeCommand];

    const info = commandInfo(fakeContext);
    expect(info).toEqual([["foo bar ubi (u)", commandDescription]]);
});

test("addCommand name on nested addCommand without name", () => {
    const fakeContext = new Toolbox();
    const fakeCommand = new Command();
    const commandDescription = "baz is a addCommand";

    fakeContext.runtime = new Runtime();
    fakeContext.runtime.addCoreExtensions();

    fakeCommand.description = commandDescription;
    fakeCommand.commandPath = ["foo", "bar", "baz"];
    fakeCommand.alias = ["u"];

    const fakeRuntime = fakeContext.runtime as any;
    fakeRuntime.commands = [fakeCommand];

    const info = commandInfo(fakeContext);
    expect(info).toEqual([["foo bar baz (u)", commandDescription]]);
});
