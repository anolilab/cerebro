Tools to help adjust the contents of text files.

You can access these tools on the cerebro toolbox, via `const { patching } = require('@anolilab/cerebro-patching-extension')`.

## Usage

All your common patching needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-patching-extension" to "@anolilab/cerebro-core"
import { patchingExtension } from "@anolilab/cerebro-patching-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(patchingExtension);

// Step 2: grab from toolbox
const { patching } = toolbox;
```

## exists

> This is an **async** function.

Reads in a file and checks whether it's content matches a string or regular expression.

```js
// Case sensitive string match
const barbExists = await patching.exists('config.txt', 'Barb')

// Short form regex
const barbExists = await patching.exists('config.txt', /Barb/)

// Regex Object
const barbExists = await patching.exists('config.txt', new Regex(/Barb/, 'i'))
```

## update

> This is an **async** function.

Updates a given file by reading it in and then taking the result of the provided callback and writing it back to the config file.

If the file ends in `.json`, it'll be read in as an object. Return the updated object to have it written back to the config.

If the file doesn't end in `.json`, you'll receive a string. Return an updated string to write back to the file.

```js
await patching.update('config.json', config => {
  config.key = 'new value'
  return config
})

await patching.update('config.txt', data => {
  return data.replace('Jamon', 'Boss')
})
```

## append

> This is an **async** function.

Appends a string to the given file.

```js
await patching.append('config.txt', 'Append this string\n')
```

## prepend

> This is an **async** function.

Prepends a string to the given file.

```js
await patching.prepend('config.txt', 'Prepend this string\n')
```

## replace

> This is an **async** function.

Replaces a string in a given file.

```js
await patching.replace('config.txt', 'Remove this string\n', 'Replace with this string\n')
```

## patch

> This is an **async** function.

Allows inserting next to, deleting, and replacing strings or regular expression in a given file. If `insert` is already present in the file, it won't change the file, unless you also pass through `force: true`.

```js
await patching.patch('config.txt', { insert: 'Jamon', before: 'Something else' })
await patching.patch('config.txt', { insert: 'Jamon', after: 'Something else' })
await patching.patch('config.txt', { insert: 'Jamon', replace: 'Something else' })
await patching.patch('config.txt', { insert: 'Jamon', replace: 'Something else', force: true })
await patching.patch('config.txt', { delete: 'Something' })
await patching.patch('config.txt', { insert: 'Jamon', after: new RegExp('some regexp') })
await patching.patch(
  'config.txt',
  { insert: 'Jamon', after: 'Something else' },
  { insert: 'Jamon', before: 'Something else' },
)
```
