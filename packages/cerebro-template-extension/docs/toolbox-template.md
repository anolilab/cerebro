Features for generating files based on a template. You can access these tools on the `@anolilab/cerebro-core` toolbox.

## Usage

All your common template needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-tempalte-extension" to "@anolilab/cerebro-core"
import { templateExtension } from "@anolilab/cerebro-template-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(templateExtension);

// Step 2: grab from toolbox
const { template } = toolbox;
```

## Generate

> This is an **async** function.

Generates a new file based on a template.

#### example

```js
module.exports = async function(toolbox) {
  const name = toolbox.parameters.first

  await toolbox.template.generate({
    template: 'component.ejf',
    target: `app/components/${name}-view.js`,
    props: { name },
  })
}
```

In the EJS template, you will use the props object to get the data defined previously.

```ejs
<title><%= props.name %></title>
```

Note: `generate()` will always overwrite the target if given. Make sure to prompt your users if that's
the behaviour you're after.

| option      | type   | purpose                              | notes                                        |
| ----------- | ------ | ------------------------------------ | -------------------------------------------- |
| `template`  | string | path to the EJS template             | relative from plugin's `templates` directory |
| `target`    | string | path to create the file              | relative from user's working directory       |
| `props`     | object | more data to render in your template |                                              |
| `directory` | string | where to find templates              | an absolute path (optional)                  |

`generate()` returns the string that was generated in case you didn't want to render to a target.
