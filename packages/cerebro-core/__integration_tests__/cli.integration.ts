import expect from "expect";
import sinon from "sinon";

import { run as cli } from "./cli";

sinon.stub(console, "log");

// set jest timeout to very long, because these take a while
beforeAll(() => jest.setTimeout(180 * 1000));
// reset back
afterAll(() => jest.setTimeout(5 * 1000));

test("can start the cli", async () => {
    const c = await cli();

    expect(c).toBeTruthy();
});
