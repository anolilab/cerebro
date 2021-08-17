Straight from [node-notifier](https://github.com/mikaelbr/node-notifier#readme)

You can access these tools on the cerebro toolbox, via `const { notifier } = require('@anolilab/cerebro-notify-extension')`.

## Usage

All your common semver needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-notify-extension" to "@anolilab/cerebro-core"
import { notifyExtension } from "@anolilab/cerebro-notify-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(notifyExtension);

// Step 2: grab from toolbox
const { notify } = toolbox;
```
