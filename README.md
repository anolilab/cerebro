# cerebro

cerebro is a delightful toolkit for building Node-based command-line interfaces (CLIs) in TypeScript or modern JavaScript, with support for:

*parameters* - command-line arguments and options

*system* - executing other command-line scripts

*prompt* - auto-complete prompts

*print* - printing pretty colors and tables

> Note: In addition, `cerebro` supports expanding your CLI's ecosystem with a robust set of easy-to-write plugins and extensions.

### Addition extensions

[*filesystem* - moving files and directories around](./packages/cerebro-filesystem-extension)

[*semver* - working with semantic versioning](./packages/cerebro-semvar-extension)

[*strings* - manipulating strings & template data](./packages/cerebro-strings-extension)

[*packageManager* - installing NPM packages with Yarn or NPM](./packages/cerebro-package-manager-extension)

[*http* - interacting with API servers](./packages/cerebro-http-extension)

[*template* - generating files from templates](./packages/cerebro-template-extension)

[*patching* - manipulating file contents](./packages/cerebro-patching-extension)

[*notify* - send cross platform native notifications](./packages/cerebro-notify-extension)

# Why use cerebro?

You might want to use cerebro if:

* You need to build a CLI app
* You want to have powerful tools at your fingertips
* And you don't want to give up flexibility at the same time

If so ... welcome!

## Supported Node.js Versions

Libraries in this ecosystem make a best effort to track
[Node.js' release schedule](https://nodejs.org/en/about/releases/). Here's [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

# Packages:

[@anolilab/cerebro-core](./packages/cerebro-core) - core cli package

[@anolilab/cerebro-filesystem-extension](./packages/cerebro-filesystem-extension)

[@anolilab/cerebro-semvar-extension](./packages/cerebro-semvar-extension)

[@anolilab/cerebro-strings-extension](./packages/cerebro-strings-extension)

[@anolilab/cerebro-notify-extension](./packages/cerebro-notify-extension)

[@anolilab/cerebro-package-manager-extension](./packages/cerebro-package-manager-extension)

[@anolilab/cerebro-http-extension](./packages/cerebro-http-extension)

[@anolilab/cerebro-template-extension](./packages/cerebro-template-extension)

[@anolilab/cerebro-patching-extension](./packages/cerebro-patching-extension)

Contributing
------------

If you would like to help take a look at the [list of issues](https://github.com/anolilab/cerebro/issues) and check our [Contributing](.github/CONTRIBUTING.md) guild.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Credits
-------------

- [Daniel Bannert](https://github.com/prisis)
- [All Contributors](https://github.com/anolilab/cerebro/graphs/contributors)

License
-------------

The anolilab cerebro is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)
