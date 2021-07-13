import expect from "expect";
import { Toolbox } from "../../src/domain/toolbox";

test("initial state", () => {
    const ctx = new Toolbox();
    expect(ctx.result).toBeFalsy();
    expect(ctx.config).toEqual({});
    expect(ctx.parameters).toEqual({
        options: {},
    });
});
