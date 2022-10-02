import { describe, expect, it } from "vitest";
import Toolbox from "../../src/domain/toolbox";

describe("domain toolbox", () => {
    it("initial state", () => {
        const ctx = new Toolbox();

        expect(ctx.result).toBeFalsy();
        expect(ctx.config).toEqual({});
        expect(ctx.parameters).toEqual({
            options: {},
        });
    });
});
