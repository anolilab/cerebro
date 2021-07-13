import expect from "expect";
import { Command } from "../../src/domain/command";

test("default state", () => {
    const command = new Command();
    expect(command).toBeTruthy();
    expect(command.name).toBeFalsy();
    expect(command.file).toBeFalsy();
    expect(command.description).toBeFalsy();
    expect(command.execute).toBeFalsy();
    expect(command.hidden).toBe(false);
});

test("matchesAlias", () => {
    const command = new Command();
    command.name = "yogurt";
    command.alias = ["yo", "y"];

    expect(command.matchesAlias(["asdf", "i", "yo"])).toBeTruthy();
    expect(command.matchesAlias("yogurt")).toBeTruthy();
    expect(command.matchesAlias(["asdf", "i", "womp"])).toBeFalsy();
});
