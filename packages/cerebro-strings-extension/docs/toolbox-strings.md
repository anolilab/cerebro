Provides some helper functions to work with strings. This list is also added to the available filters inside your EJS templates.

You can access these tools on the cerebro toolbox, via `const { strings } = require('@anolilab/cerebro-strings-extension')`.

## Usage

All your common strings needs are accessible.

```js
import Cli from "@anolilab/cerebro-core";

// Step 1: added "@anolilab/cerebro-strings-extension" to "@anolilab/cerebro-core"
import { stringsExtension } from "@anolilab/cerebro-strings-extension";

const cli = new Cli("cerebro", process.argv);

cli.addExtension(stringsExtension);

// Step 2: grab from toolbox
const { strings } = toolbox;
```

## **Utility**

## identity

Returns the **input** as **output**. Great for functional programming like sorting or fallbacks.

** arguments **

- `value` can be `any` type which becomes the return value of this function.

** returns **

- the `value` that was passed in

```js
strings.identity('hello') // hello
strings.identity(4) // 4
strings.identity([1, 'a']) // [1, 'a']
```

## isBlank

Determines if a string is empty by trimming it first.

```js
strings.isBlank('') // true
strings.isBlank('   ') // true
```

## isNotString

Tests a value to see if it is not a string.

```js
strings.isNotString(true) // true
strings.isNotString(null) // true
strings.isNotString(undefined) // true
strings.isNotString(123) // true
strings.isNotString('hi') // false
```

---

## **Growing**

## pad

Centers a string to a given length.

```js
strings.pad('hola', 20) // '        hola        '
```

## padStart

Fills a string to a certain length by adding characters to the front.

```js
strings.padStart('hello', 10, '.') // '.....hello'
```

## padEnd

Fills a string to a certain length by adding characters to the end.

```js
strings.padEnd('hello', 10, '!') // 'hello!!!!!'
```

## repeat

Repeats a string a number of times to make a pattern.

```js
strings.repeat('x', 3) // 'xxx'
strings.repeat('xo', 3) // 'xoxoxo'
```

---

## **Shrinking**

## trim

Strips white space from both the start and end of a string, but not the middle.

```js
strings.trim('    kevin   spacey    ') // 'kevin   spacey'
```

## trimStart

Strips white space from the start of a string.

```js
strings.trimStart('          hi ') // 'hi '
```

## trimEnd

Strips white space from the end of a string.

```js
strings.trimEnd('windows!\r\n') // 'windows!'
```

---

## **Case Conversion**

## camelCase

Capitalizes the first letter of each word it smashes together on word boundaries. The first letter becomes lowercase. Puncuation gets dropped.

Great for assembling javascript variable names.

```js
strings.camelCase('hello there') // 'helloThere'
strings.camelCase('Hello there') // 'helloThere'
strings.camelCase('abc123') // 'abc123'
strings.camelCase('Y M C A') // 'yMCA'
strings.camelCase('Welcome to ZOMBO.com') // 'welcomeToZomboCom'
strings.camelCase('XMLHttpRequest is strange.') // 'xmlHttpRequestIsStrange'
strings.camelCase('OSnap') // 'oSnap'
strings.camelCase('this.is.sparta!') // 'thisIsSparta'
```

## kebabCase

Skewers words by placing - characters between them and downcasing.

```js
strings.kebabCase('hello there') // 'hello-there'
strings.kebabCase('Hello there') // 'hello-there'
strings.kebabCase('abc123') // 'abc-123'
strings.kebabCase('Y M C A') // 'y-m-c-a'
strings.kebabCase('Welcome to ZOMBO.com') // 'welcome-to-zombo-com'
strings.kebabCase('XMLHttpRequest is strange.') // 'xml-http-request-is-strange'
strings.kebabCase('OSnap') // 'o-snap'
strings.kebabCase('this.is.sparta!') // 'this-is-sparta'
```

## snakeCase

Joins words together with underscores after splitting up into word boundaries.

Great for ruby and some apis.

```js
strings.snakeCase('hello there') // 'hello_there'
strings.snakeCase('Hello there') // 'hello_there'
strings.snakeCase('abc123') // 'abc_123'
strings.snakeCase('Y M C A') // 'y_m_c_a'
strings.snakeCase('Welcome to ZOMBO.com') // 'welcome_to_zombo_com'
strings.snakeCase('XMLHttpRequest is strange.') // 'xml_http_request_is_strange'
strings.snakeCase('OSnap') // 'o_snap'
strings.snakeCase('this.is.sparta!') // 'this_is_sparta'
```

## upperCase

A staple in every troll's toolbelt, this makes everything uppercase.

```js
strings.upperCase('hello there') // 'HELLO THERE'
strings.upperCase('Hello there') // 'HELLO THERE'
strings.upperCase('abc123') // 'ABC 123'
strings.upperCase('Y M C A') // 'Y M C A'
strings.upperCase('Welcome to ZOMBO.com') // 'WELCOME TO ZOMBO COM'
strings.upperCase('XMLHttpRequest is strange.') // 'XML HTTP REQUEST IS STRANGE'
strings.upperCase('OSnap') // 'O SNAP'
strings.upperCase('this.is.sparta!') // 'THIS IS SPARTA'
```

## lowerCase

This makes everything lower case.

```js
strings.lowerCase('hello there') // 'hello there'
strings.lowerCase('Hello there') // 'hello there'
strings.lowerCase('abc123') // 'abc 123'
strings.lowerCase('Y M C A') // 'y m c a'
strings.lowerCase('Welcome to ZOMBO.com') // 'welcome to zombo com'
strings.lowerCase('XMLHttpRequest is strange.') // 'xml http request is strange'
strings.lowerCase('OSnap') // 'o snap'
strings.lowerCase('this.is.sparta!') // 'this is sparta'
```

## startCase

Uppercases the first letter of each word after dicing up on word boundaries.

```js
strings.startCase('hello there') // 'Hello There'
strings.startCase('Hello there') // 'Hello There'
strings.startCase('abc123') // 'Abc 123'
strings.startCase('Y M C A') // 'Y M C A'
strings.startCase('Welcome to ZOMBO.com') // 'Welcome To ZOMBO Com'
strings.startCase('XMLHttpRequest is strange.') // 'XML Http Request Is Strange'
strings.startCase('OSnap') // 'O Snap'
strings.startCase('this.is.sparta!') // 'This Is Sparta'
```

## upperFirst

Uppercases the first letter of the string.

```js
strings.upperFirst('hello there') // 'Hello there'
strings.upperFirst('Hello there') // 'Hello there'
strings.upperFirst('abc123') // 'Abc123'
strings.upperFirst('Y M C A') // 'Y M C A'
strings.upperFirst('Welcome to ZOMBO.com') // 'Welcome to ZOMBO.com'
strings.upperFirst('XMLHttpRequest is strange.') // 'XMLHttpRequest is strange.'
strings.upperFirst('OSnap') // 'OSnap'
strings.upperFirst('this.is.sparta!') // 'This.is.sparta!'
```

## lowerFirst

Lowercases the first letter of the string.

```js
strings.lowerFirst('hello there') // 'hello there'
strings.lowerFirst('Hello there') // 'hello there'
strings.lowerFirst('abc123') // 'abc123'
strings.lowerFirst('Y M C A') // 'y M C A'
strings.lowerFirst('Welcome to ZOMBO.com') // 'welcome to ZOMBO.com'
strings.lowerFirst('XMLHttpRequest is strange.') // 'xMLHttpRequest is strange.'
strings.lowerFirst('OSnap') // 'oSnap'
strings.lowerFirst('this.is.sparta!') // 'this.is.sparta!'
```

## pascalCase

This is `camelCase` + `upperFirst`.

```js
strings.pascalCase('hello there') // 'HelloThere'
strings.pascalCase('Hello there') // 'HelloThere'
strings.pascalCase('abc123') // 'Abc123'
strings.pascalCase('Y M C A') // 'YMCA'
strings.pascalCase('Welcome to ZOMBO.com') // 'WelcomeToZomboCom'
strings.pascalCase('XMLHttpRequest is strange.') // 'XmlHttpRequestIsStrange'
strings.pascalCase('OSnap') // 'OSnap'
strings.pascalCase('this.is.sparta!') // 'ThisIsSparta'
```

## pluralize

Pluralize or singularize a word based on the passed in count.

```js
strings.pluralize('test', 1) // 'test'
strings.pluralize('test', 5) // 'tests'
strings.pluralize('test', 1, true) // '1 test'
strings.pluralize('test', 5, true) // '5 tests'
```

## plural

Converts a given singular word to plural.

```js
strings.plural('bug') // 'bugs'
strings.plural('word') // 'words'
```

## singular

Converts a given plural word to singular.

```js
strings.singular('bugs') // 'bug'
strings.singular('words') // 'word'
```

## isPlural

Checks if the give word is plural.

```js
strings.isPlural('bugs') // true
strings.isPlural('bug') // false
```

## isSingular

Checks if the give word is singular.

```js
strings.isSingular('bugs') // false
strings.isSingular('bug') // true
```

## addPluralRule

Adds a pluralization rule for the given singular word when calling plural.

```js
strings.addPluralRule('regex', 'regexii')
strings.addPluralRule(/regex$/, 'regexii')
```

## addSingularRule

Adds a pluralization rule for the given plural word when calling singular.

```js
strings.addSingularRule('regexii', 'regex')
strings.addSingularRule(/regexii$/, 'regex')
```

## addIrregularRule

Adds a pluralization rule for the given irregular word when calling plural.

```js
strings.addIrregularRule('octopus', 'octopodes')
```

## addUncountableRule

Exempts the given uncountable word from pluralization so that calling plural or singular with that word will return the same word unchanged.

```js
strings.addUncountableRule('paper')
```
