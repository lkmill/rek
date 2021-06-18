# rek

Tiny, isomorphic convenience wrapper around the [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) aiming to
reduce boilerplate, especially when sending and receiving JSON.

| Build            | Unminified | Minified | Gzipped |
| ---------------- | ---------- | -------- | ------- |
| ESM bundle       | 3.54 kB    | 1.60 kB  | 847 B   |
| UMD bundle       | 4.08 kB    | 1.75 kB  | 904 B   |
| UMD bundle (ES5) | 4.32 kB    | 1.89 kB  | 926 B   |

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Quick Start](#quick-start)
  - [NPM](#npm)
  - [CDN (Unpkg)](#cdn-unpkg)
- [Why?](#why)
  - [Less Boilerplate](#less-boilerplate)
  - [Isomorphism & Full ESM Support](#isomorphism--full-esm-support)
- [Package Exports](#package-exports)
  - ['rek'](#rek)
  - ['rek/error'](#rekerror)
  - ['rek/factory'](#rekfactory)
  - [CDN (Unpkg)](#cdn-unpkg-1)
- [API](#api)
  - [Usage](#usage)
    - [rek(url, options)](#rekurl-options)
    - [rek\[method\](url, body?, options?)](#rek%5Cmethod%5Curl-body-options)
  - [Options](#options)
    - [`baseUrl`](#baseurl)
    - [`body`](#body)
    - [`response`](#response)
    - [`searchParams`](#searchparams)
  - [.extend(defaults, api) || .extend(fnc)](#extenddefaults-api--extendfnc)
  - [Factory](#factory)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

### NPM
```sh
$ npm install rek
```

```js
import rek, { FetchError } from 'rek'
// or
const rek = require('rek')

rek('/get-stuff').then(json => console.log(json))
rek('/get-stuff', { response: 'blob' }).then(blob => console.log(blob))
rek.post('/do-stuff', { stuff: 'to be done' }).then(json => console.log(json))

rek.put('/do-stuff', { stuff: 'to be done' }, { response: 'text' }).then(text => console.log(text))
```

### CDN (Unpkg)

```html
<script src="https://unpkg.com/rek"></script>
```

```js
import rek, { FetchError } from 'https://unpkg.com/rek/dist/rek.esm.min.js'
```

## Why?

### Less Boilerplate

Even though the [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is
significantly nicer to work with than XHR, it still quickly becomes verbose to
do simple tasks. To create a relatively simple `POST` request using JSON, `fetch`
requires something like:

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
  if (res.ok) {
    return res.json()
  }

  const err = new Error(response.statusText)

  err.response = response
  err.status = response.status

  throw err
}).then((person) => {
  console.log(person)
}).catch(...)
```

With `rek` this simply becomes:

```js
rek.post('/api/peeps', { name: 'James Brown' }).then((person) => {
  console.log(person)
}).catch(...)
```

### Isomorphism & Full ESM Support

`rek` uses [conditional
exports](https://nodejs.org/api/packages.html#packages_conditions_definitions)
to load Node or browser (and Deno) compatible ESM or CJS files. `main` and
`module` are also set in `package.json` for compatibility with legacy Node and
legacy build systems. In Node, the main entry point uses
[node-fetch](https://github.com/node-fetch/node-fetch), which needs to be
installed manually. In all other environments, the main entry point uses
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers),
[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL),
[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) and
[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) defined in the
global scope.

Internally, the ESM & CJS entry points use the same CJS files to prevent the
dual package hazard. See [the Node
documentation](https://nodejs.org/api/packages.html#packages_dual_commonjs_es_module_packages)
for more information.

## Package Exports

### 'rek'

The main entry point returns a `rek` instance. When using `import`, a named
export `FetchError` is also exposed.

```js
import rek, { FetchError } from 'rek'
// or
const rek = require('rek')
```

The browser/Deno version is created using (see [factory](#factory) for details):

```js
export default factory(
  { credentials: 'same-origin',  response: 'json' },
  { fetch, Headers, URL, URLSearchParams },
)
// or
export default factory({ credentials: 'same-origin',  response: 'json' }, self)
```

Note: if the global object (such as `self` above) is passed as the API argument
and `rek.extend()` is later called, the new api will be merged with all
properties on the global object.

The Node version is created using:

```js
import { URL, URLSearchParams } from 'url'
import fetch from 'node-fetch'

export default factory(
  { credentials: 'same-origin', response: 'json' },
  { fetch, Headers: fetch.Headers, URL, URLSearchParams },
)
```

The main entry exposes TypeScript types:

```ts
import { API, Options, Rek } from 'rek'
```

### 'rek/error'

Exports the `FetchError`. Both `import` and `require` will load
`./dist/error.cjs` in all environments.

```js
// import
import FetchError from 'rek/error'
// require
const FetchError = require('rek/error')
// legacy
const FetchError = require('rek/dist/error.cjs')
```

### 'rek/factory'

Exports the [factory](#factory) function that creates `rek` instances with new
defaults and api. Both `import` and `require` will load `./dist/factory.cjs` in
all environments.

```js
import factory from 'rek/factory'
// require
const factory = require('rek/factory')
// legacy
const factory = require('rek/dist/factory.cjs')
```

The factory entry also exposes TypeScript types:

```ts
import { API, Options, Rek } from 'rek'
```

### CDN (Unpkg)

On top of CJS and ESM files, bundles to be consumed through
[unpkg.com](https://unpkg.com) are built into `./dist/`. The `unpkg` field
in `package.json` points at the minified UMD build. This means:

```html
<script src="https://unpkg.com/rek"></script>
```

is the same as

```html
<script src="https://unpkg.com/rek/dist/rek.umd.min.js"></script>
```

To use the ES5 compatible UMD bundle:

```html
<script src="https://unpkg.com/rek/dist/rek.umd.es5.min.js"></script>
```

The ESM bundle can be imported from a JS file:

```js
import rek, { FetchError } from 'https://unpkg.com/rek/dist/rek.esm.min.js'
```

The following bundles are available in the dist folder:

+ `./dist/rek.esm.js` - ESM bundle
+ `./dist/rek.esm.min.js` - Minified ESM bundle
+ `./dist/rek.umd.js` - UMD bundle
+ `./dist/rek.umd.min.js` - Minified UMD bundle
+ `./dist/rek.umd.es5.js` - ES5 compatible UMD bundle
+ `./dist/rek.umd.es5.min.js` - Minified ES5 compatible UMD bundle

## API

### Usage

#### rek(url, options)

Makes a request with `fetch` and returns a parsed response body or the
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) (depending
on the [response](#response) option). If `res.ok` is not true, an error is thrown.
See [options](#options) below for differences to native `fetch` options.

```js
rek('/url').then(json => { ... })
rek('/url', { response: 'text' }).then(text => { ... })
rek('/url', { body: { plain: 'object' }, method: 'post' }).then(json => { ... })
```

#### rek\[method\](url, body?, options?)

`rek` has convenience methods for all relevant HTTP request methods. They
set the correct `option.method` and have an extra `body` argument
when the request can send bodies (the `body` argument overwrites `options.body`).

- __rek.delete(url, options?)__
- __rek.get(url, options?)__
- __rek.head(url, options?)__
- __rek.patch(url, body?, options?)__
- __rek.post(url, body?, options?)__
- __rek.put(url, body?, options?)__

```js
rek.delete('/api/peeps/1337')
// is the same as
rek('/api/peeps/1337', { method: 'DELETE' })

rek.post('/api/peeps/14', { name: 'Max Powers' })
// is the same as
rek('/api/peeps/14', { method: 'POST', body: { name: 'Max Powers' } })
```

### Options

`rek` supports three arguments on top of the default fetch
options:
[baseUrl](#baseurl), [response](#response) and [searchParams](#searchParams). It also handles
`body` differently to native `fetch()`.

Options passed to `rek` will be merged with the `defaults` defined in the [factory](#factory).

#### `baseUrl`

A URL that relative paths will be resolved against.

Setting this in `defaults` is very useful for SSR and similar.

#### `body`

Depending on the type of body passed, it could be converted to a JSON string
and the `content-type` header could be removed or set

+ __FormData || URLSearchParams__: `body` will not be modified but
  `content-type` will be unset (setting `content-type` prevents the browser
  setting `content-type` with the boundary expression used to delimit form
  fields in the request body).
+ __Blob || ReadableStream__: Neither `body` nor `content-type` will be
  modified.
+ __All other (object) types__: `body` will be converted to a JSON string, and
  `content-type` will be set to `application/json` (even if it is already set).

#### `response`

Sets how to parse the response body.  It needs to be either
a valid `Body` [read
method](https://developer.mozilla.org/en-US/docs/Web/API/Body#methods) name, a function
accepting the response or
falsy if the response should be returned without parsing the body. In the `rek`
instance returned by the main entry, `response` defaults to 'json'.

```js
typeof await rek('/url') === 'object' // is JSON

typeof await rek('/url', { response: 'text' }) === 'string'

await rek('/url', { response: 'blob' }) instanceof Blob

// will throw
rek('/url', { response: 'invalid response' })

await rek('/url', { response: false }) instanceof Response

await rek('/url', { response: (res) => 'return value' }) === 'return value'
```

Depending on the `response`, the following `Accept` header will be set:

- __arrayBuffer__: \*/\*
- __blob__: \*/\*
- __formData__: multipart/form-data
- __json__: application/json
- __text__: text/\*

#### `searchParams`

A valid
[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
constructor argument used to add a query string to the URL. A query string already present in the `url` passed to `rek`
will be overwritten.

```js
rek('/url', { searchParams: 'foo=1&bar=2' })
rek('/url', { searchParams: '?foo=1&bar=2' })

// sequence of pairs
rek('/url', { searchParams: [['foo', '1'], ['bar', '2']] })

// plain object
rek('/url', { searchParams: { foo: 1, bar: 2 } })

// URLSearchParams
rek('/url', { searchParams: new URLSearchParams({ foo: 1, bar: 2 }) })
```

### .extend(defaults, api) || .extend(fnc)

The extend method will return a new `rek` instance with arguments (shallow)
merged with the previous values. If a deep or custom merge is required, pass a
function returning an array of new arguments instead.

```js
// shallow
const myRek = rek.extend({ baseUrl: 'http://localhost:1337' })
const myRek = rek.extend({ credentials: 'omit' }, { fetch: myFetch })

// custom
const myRek = rek.extend((defaults, api) => [{
  ...defaults,
  headers: {
    ...defaults.headers,
    'authorization': 'Basic YWxhZGRpbjpvcGVuc2VzYW1l', 
  }
}, api])
```

### Factory

```js
import factory from 'rek/factory'
// or
const factory = require('rek/factory')

const myRek = factory({
  headers: {
    accept: 'application/html',
    'content-type': 'application/x-www-form-urlencoded',
  },
  credentials: 'omit',
}, {
  fetch: fancyfetch,
  Headers: FancyHeaders,
  FormData,
  URL,
  URLSearchParams
})

myRek()
myRek.delete()
myRek.patch()
```

In environments that have all required APIs natively, simply pass the global
object:

```js
const myRek = factory({ ... }, globalThis)
```

## TypeScript

The main entry exposes most types

```js
import { API, Options, Rek } from 
```

## Credits

Very big thank you to [kolodny](https://github.com/kolodny) for releasing the
NPM name!
