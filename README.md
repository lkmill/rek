
# rek

Tiny convience wrapper around the Fetch API aiming to
reduce boilerplate.

| Build | Minified | Gzipped |
|-------|----------|---------|
| ESM bundle (ES5) | 1.56 kB | 779 B
| UMD bundle (ES5) | 1.71 kB | 841 B |

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Quick Start](#quick-start)
  - [NPM](#npm)
  - [CDN (Unpkg)](#cdn-unpkg)
- [Why?](#why)
- [Package Entries](#package-entries)
  - [`rek` - Browsers & Deno](#rek---browsers--deno)
  - [`rek/node` - Node.js](#reknode---nodejs)
  - [`rek/iso` - Isomorphic](#rekiso---isomorphic)
  - [CDN (Unpkg)](#cdn-unpkg-1)
- [Usage](#usage)
  - [Options & Defaults](#options--defaults)
  - [HTTP Method Helpers](#http-method-helpers)
  - [Body Parsing Methods](#body-parsing-methods)
- [Factory](#factory)
  - [.factory](#factory)
  - [.extend](#extend)
  - [.getArgs](#getargs)
- [TypeScript](#typescript)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

### NPM
```sh
$ npm install rek
```

```js
// browser
import rek from 'rek'
const rek = require('rek')

// node
import rek from 'rek/node'
const rek = require('rek/node')

// both
import rek from 'rek/iso'
const rek = require('rek/iso')
```

### CDN (Unpkg)

```html
<script src="https://unpkg.com/rek"></script>
```

```js
import rek from 'https://unpkg.com/rek/dist/rek.esm.min.js'
```

## Why?

While the Fetch API is significantly nicer to work with than XHR,
it still quickly becomes verbose to do simple tasks. To create a
relatively simple `POST` request using JSON, you often have to
write something like:

```js
fetch('/api/peeps', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
  credentials: 'same-origin',
  body: JSON.stringify({
    name: 'James Brown',
  }),
}).then((res) => {
  const contentType = res.headers.get('content-type')

  if (res.ok) {
    return res.json()
  }

  const err = new Error(response.statusText)

  err.status = response.status

  throw err
}).then((person) => {
  console.log(person)
}).catch(...)
```

With `rek` this simply becomes:

```js
rek.post('/api/peeps', { name: 'James Brown' }).json().then((person) => {
  console.log(person)
}).catch(...)
```

## Package Entries

This package exposes several different versions for compatiblity with different
target environments.

If none of these fit the bill, see [factory](#factory) below to create your own.

### `rek` - Browsers & Deno

```js
import rek from 'rek'

// or

const rek = require('rek')
```

The bare import provides browser (or deno) versions that uses
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) and
[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) defined in the
global scope. The `main` field in package.json points toward a CommonJS file,
while the `module` field points towards an ESM (EcmaScript module) file.

### `rek/node` - Node.js

```js
import rek from 'rek/node'

// or

const rek = require('rek/node')
```

The `rek/node` subpath provides Node.js versions that uses
[node-fetch](https://github.com/bitinn/node-fetch) instead of a fetch global.
__node-fetch__ is an optional dependency that needs to be installed separately.

A `./node/package.json` file uses `main` (points to `./cjs/node.js`) and
`module` (points to `./esm/node.mjs`) fields so if whatever dev environment
used supports the module field. Since the new module resolution in Node.js 13.2 and
above does not support `package.json` in the same way as before, [package
exports](https://nodejs.org/api/esm.html#esm_package_exports) are used instead.


### `rek/iso` - Isomorphic

```js
import rek from 'rek/iso'

// or

const rek = require('rek/iso')
```

The `rek/iso` subpath provides an
[isomorphic](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)
entry.  The `main` field (and `./iso` package export) points to `./cjs/node.js`
while the `module` field points to `./esm/browser.mjs`. This means bundlers
like [Webpack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/)
should pick up the ESM browser version, while Node.js will use the CommonJS
version using __node-fetch__. As with the node entry, `node-fetch` needs to be
manually installed.

### CDN (Unpkg)

A `./dist` directory is published with entries to be consumed through
[unpkg.com](https://unpkg.com). The `unpkg` field `package.json` points at a
minified UMD build. This means

```html
<script src="https://unpkg.com/rek"></script>
<!-- or -->
<script src="https://unpkg.com/rek@0.5.0"></script>
```

is the same as

```html
<script src="https://unpkg.com/rek/dist/rek.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/rek@0.5.0/dist/rek.min.js"></script>
```

The ESM bundle can be imported from a JS file:

```js
// minified
import rek from 'https://unpkg.com/rek/dist/rek.esm.min.js'

// unminifed
import rek from 'https://unpkg.com/rek/dist/rek.esm.js'
```

The following builds are available in the dist folder:

+ `./dist/rek.js` - UMD bundle
+ `./dist/rek.min.js` - Minified UMD bundle
+ `./dist/rek.esm.js` - ESM bundle
+ `./dist/rek.esm.min.js` - Minified ESM bundle

## Usage

Calling `rek(url, options)` doesn't actually start the request and return the
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) promise.
Instead, it returns a "thenable" (with [body parsing methods](#body-parsing-methods))
which for all intents and purposes behaves exactly like a promise. Awaiting,
passing it to `Promise.all` or calling `.then` will start the request and
return a promise that resolves to the response, just like regular
`fetch`.

```js
rek('/edge/of/glory').then(res => {})

const res = await rek('/edge/of/glory')

Promise.all([
  rek('/power/of/grayskull'),
  rek('/i/have/the/power'),
]).then(results => {...})
```

If you really, really MUST have a real promise, an escape hatch is exposed via
the `.run` method.

```js
rek(url).run()
```

If `body` is not a string and the `content-type` header is not set or is set to
`application/json`, `body` will be `JSON.stringify`:ed and the `content-type`
header will be set to `application/json`.

### Options & Defaults

Rek supports the same options as fetch and one extra, `baseUrl`. `baseUrl`
can be used to set a URL that all relative paths will be resolved
against. It uses the WHATWG URL to calculate like so:

```js
url = (new URL(url, options.baseUrl)).href
```

Setting this through defaults is very useful for SSR and similar.

```
const apiRek = rek.factory({
  ...,
  baseUrl: http://localhost:1337/,
})
```

`rek` has defaults that are merged with the options passed to any request. The
initial defaults are defined as follows:

```js
const defaults = {
  credentials: 'same-origin',
}
```

See the [factory](#factory) section below for setting custom defaults.

### HTTP Method Helpers

Convenience helpers for all relevant HTTP methods are available as methods on
the default export. Methods that support sending a body with the request have a
`body` argument (`body` will overwrite `options.body`).

- __rek.delete(url, options)__
- __rek.get(url, options)__ (Since method is undefined in the initial defaults, this is
  the same as calling rek() directly with the initial defaults)
- __rek.head(url, options)__
- __rek.patch(url, body, options)__
- __rek.post(url, body, options)__
- __rek.put(url, body, options)__

```js
import rek from 'rek'

rek.delete('/api/peeps/1337').then((users) => {
  console.log(users)
})

rek.post('/api/peeps/14', { name: 'Max Powers' }).then((user) => {
  console.log(user.name)
})
```


### Body Parsing Methods

If one of the 5 [body parsing
method](https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods) aliases
__arrayBuffer__, __blob__, __formData__, __json__ or __text__ is called, the
correct `Accept` header will be set, the request initiated and a promise that
resolves to the parsed body will be returned.

```js
rek('/lost/in/time').json().then(json => {...})

const json = await rek('/lost/in/time').json()

rek('/under/the/weather').blob().then(blob => {...})

const blob = await rek('/under/the/weather').blob()
```

The following accept headers will be set for each method:

- __arrayBuffer__: \*/\*
- __blob__: \*/\*
- __formData__: multipart/form-data
- __json__: application/json
- __text__: text/\*

## Factory

The default export has 3 methods used to handle default options and APIs used
internally, namely `factory`, `extend` and `getArgs`.

### .factory

The factory method will return a new `rek` with completely new defaults.

```js
import fancyFetch, { FancyHeaders } from 'fancy-fetch'
import rek from 'rek'

const myRek = rek.factory({
  headers: {
    accept: 'application/html',
    'content-type': 'application/x-www-form-urlencoded',
  },
  credentials: 'omit',
}, {
  fetch: fancyfetch,
  Headers: FancyHeaders,
  URL,
})

myRek()
myRek.delete()
myRek.patch()
```

### .extend

The extend method will return a new `rek` with arguments (shallow) merged with
the previous values. If you need a deep merge, see [.getArgs](#getargs) below.

```js
import { FancyHeaders } from 'fancy-fetch'
import rek from 'rek'

const myRek = rek.extend({
  credentials: 'omit',
}, {
  Headers: FancyHeaders,
})

myRek()
myRek.delete()
myRek.patch()
```


### .getArgs

The `getArgs` method returns an array the current arguments.

```js
const [ defaults, api ] = rek.getArgs()
```

This is mainly done to enable custom (including deep) merging logic:

```js
const [ defaults ] = rek2.getArgs()

const rek3 = rek2.extend({
  headers: {
    ...defaults.headers,
    accept: 'text/html',
  },
})
```

## TypeScript

The TypeScript types used are as follows:

```ts
interface Options extends RequestInit {
  baseUrl?: string
}

interface API {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  URL: URL
  Headers: Headers
}

interface RekResponse extends Pick<Body, 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'>, PromiseLike<Response> {
  run(): Promise<Response>
}

export interface Rek {
  (url: string, options?: Options): RekResponse
  delete(url: string, options?: Options): RekResponse
  get(url: string, options?: Options): RekResponse
  head(url: string, options?: Options): RekResponse
  patch(url: string, body?: any, options?: Options): RekResponse
  post(url: string, body?: any, options?: Options): RekResponse
  put(url: string, body?: any, options?: Options): RekResponse

  factory(defaults?: Options, api?: API): Rek
  extend(newDefaults?: Options, newApi?: API): Rek
  getArgs(): [Options, API]
}

export default function factory(defaults: Options, api: API): Rek
```

## Credits

Very big thank you to [kolodny](https://github.com/kolodny) for releasing the
NPM name!
