Straight from [got](https://github.com/sindresorhus/got)

You can access these tools on the cerebro toolbox, via `const { http } = require('@anolilab/cerebro-http-extension')`.

## Usage

All your common semver needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-http-extension" to "@anolilab/cerebro-core"
import { httpExtension } from "@anolilab/cerebro-http-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(httpExtension);

// Step 2: grab from toolbox
const { http } = toolbox;
```
