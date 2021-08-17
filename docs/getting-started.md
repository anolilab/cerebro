# Getting Started

The fastest way to get started is to use this code snipped:

```typescript
import Cli, { CommandLoader } from "@anolilab/cerebro-core";
import type { Toolbox } from "@anolilab/cerebro-core";

// Use this if you using type: module in your package.json
// import { dirname, join } from "path";
// import { fileURLToPath } from "url";
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// eslint-disable-next-line consistent-return,import/prefer-default-export
(async (): Promise<Toolbox | void> => {
    try {
        // Create a CLI runtime
        const cli = new Cli("cerebro", process.argv);

        // use the loadingType to change the file loader. default: "import", change it to "require" if you use commonjs
        cli.addLoader(new CommandLoader(join(__dirname, "..", "commands"/*, { loadingType: "require"  } */)));

        return await cli.run();
    } catch (error) {
        // Abort via CTRL-C
        if (!error) {
            console.log("Goodbye ✌️");
        } else {
            // Throw error
            throw error;
        }
    }
})();
```

## Creating your first addCommand

Your cerebro-powered CLI isn't very useful without a addCommand! In your CLI, create a new JS file in `src/commands` called `hello.js`. In that file, add this:

```js
// src/commands/hello.js
module.exports = {
  name: "hello",
  execute: async toolbox => {
    toolbox.logger.info('Hello, world!')
  },
}
```

For TypeScript, it's not much different:

```typescript
// src/commands/hello.ts
import { Toolbox } from '@anolilab/cerebro-core'

module.exports = {
    name: "hello",
  execute: async (toolbox: Toolbox) => {
    toolbox.logger.info('Hello, world!')
  },
}
```

Now execute your addCommand:

```
$ mycli hello
Hello, world!
```

Yay!

## Creating your first extension

You can add more tools into the `toolbox` for _all_ of your commands to use by creating an `extension`. In your `mycli` folder, add a new file in `src/extensions` called `hello-extension.js`. (It doesn't _have_ to end in `-extension`, but that's a convention.)

```js
// src/extensions/hello-extension.js
module.exports = {
  name: "hello",
  execute: (toolbox) => {
    toolbox.logger.info('Hello from an extension!')
  }
}
```

Or TypeScript:

```typescript
// src/extensions/hello-extension.ts
import { Toolbox } from '@anolilab/cerebro-core'

module.exports = {
    name: "hello",
    execute: async (toolbox: Toolbox) => {
        toolbox.logger.info('Hello from an extension!')
    }
}
```

Then, in your `hello` addCommand, use that function instead:

```js
// src/commands/hello.js
module.exports = {
  execute: toolbox => {
    const { hello } = toolbox

    hello()
  },
}
```

When you execute the addCommand, this time it'll use the extension's output.

```
$ mycli hello
Hello from an extension!
```
## Next steps

There are _many_ more tools in the toolbox than just `logger.info`. You can generate from a template, manipulate files, hit API endpoints via HTTP, access parameters, execute system commands, ask for user input, and much more. Explore the [API docs](../packages/cerebro-core/docs/toolbox-api.md) to learn more.
