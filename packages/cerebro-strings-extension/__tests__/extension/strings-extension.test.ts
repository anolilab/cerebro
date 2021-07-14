import expect from "expect";
import { Toolbox } from "../../../cerebro/src/domain/toolbox";
import createExtension from "../../src/extension/strings-extension";

test("has the proper interface", () => {
    const toolbox = new Toolbox();
    createExtension(toolbox);
    const ext = toolbox.strings;
    expect(ext).toBeTruthy();
    expect(typeof ext.trim).toBe("function");
    expect(ext.trim("  lol")).toBe("lol");
});
