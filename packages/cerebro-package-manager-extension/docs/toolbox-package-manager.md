Tools to help adjust the contents of text files.

You can access these tools on the cerebro toolbox, via `const { packageManager } = require('@anolilab/cerebro-package-manager-extension')`.

## Usage

All your common package-manager needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-package-manager-extension" to "@anolilab/cerebro-core"
import { packageManagerExtension } from "@anolilab/cerebro-package-manager-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(packageManagerExtension);

// Step 2: grab from toolbox
const { packageManager } = toolbox;
```

## hasYarn

Whether the current system has yarn installed

```js
packageManager.hasYarn(); // true
```

## add (async)

Adds a package using yarn or npm

```js
await packageManager.add("infinite_red", {
    dev: true,
    dryRun: false,
    force: "npm", //remove this to have the system determine which
});
```

Will return an object similar to the following:

```js
{
  success: true,
  command: 'npm install --save-dev infinite_red',
  stdout: ''
}
```

You can also use an array with the package names you want to install to add it all at once.

```js
await packageManager.add(["infinite_red", "infinite_blue"], {
    dev: true,
    dryRun: false,
});
```

## remove (async)

Removes a package using yarn or npm

```js
await packageManager.remove("infinite_red", {
    dryRun: false,
    force: "npm", //remove this to have the system determine which
});
```

Like `add` function, you can also use an array to remove multiple packages.

```js
await packageManager.remove(["infinite_red", "infinite_blue"], {
    dryRun: false,
});
```
