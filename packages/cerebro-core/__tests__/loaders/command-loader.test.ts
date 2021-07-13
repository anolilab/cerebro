import expect from "expect";
import { loadCommandFromFile } from "../../src/loaders/command-loader";

test("loading from a missing file", async () => {
    await expect(() => loadCommandFromFile("foo.js")).toThrowError(
        "Error: couldn't load addCommand (this isn't a file): foo.js",
    );
});

test("deals with weird input", async () => {
    await expect(() => loadCommandFromFile("")).toThrowError("Error: couldn't load addCommand (file is blank): ");
});

test("open a weird js file", async () => {
    const file = `${__dirname}/../fixtures/bad-modules/text.js`;
    await expect(() => loadCommandFromFile(file)).toThrowError(`hello is not defined`);
});

test("default but no execute property exported", async () => {
    const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`;
    await expect(() => loadCommandFromFile(file)).toThrowError(
        `Error: Couldn't load command module-exports-object -- needs a "run" property with a function.`,
    );
});

test("fat arrows", async () => {
    const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`;
    await expect(() => loadCommandFromFile(file)).not.toThrow();
});
