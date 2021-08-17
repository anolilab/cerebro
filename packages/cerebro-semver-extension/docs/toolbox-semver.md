straight from [semver](https://github.com/npm/node-semver)

You can access these tools on the cerebro toolbox, via `const { semver } = require('@anolilab/cerebro-semver-extension')`.

## Usage

All your common semver needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-semver-extension" to "@anolilab/cerebro-core"
import { semverExtension } from "@anolilab/cerebro-semver-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(semverExtension);

// Step 2: grab from toolbox
const { semver } = toolbox;

// Step 3: start using
semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true
```
