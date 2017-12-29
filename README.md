# rek

Wrapper around the Fetch API, mainly meant for consuming JSON api's
but exposes a factory function for creating defaults for XML api's
or what not.

## Install

NPM:

```sh
$ npm install rek
```

CDN:

```html
<script src="https://unpkg.com/rek@latest/dist/rek.js"></script>

<!-- OR -->

<script src="https://unpkg.com/rek@latest/dist/rek.min.js"></script>
```


## Philosophy

While the Fetch API is significantly nicer to work with than XHR,
it still quickly becomes verbose to do simple tasks. `rek` is simply
meant as wrapper around Fetch with editable defaults that provides
methods for working against the standard HTTP methods.

To create a relatively simple `POST` request using JSON, you often
have to write something like:

```js
fetch('/api/peeps', {
  method: 'POST',
  body: JSON.stringify({
    name: 'James Brown',
  }),
  credentials: 'same-origin',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/json',
    accept: 'application/json',
  }
}).then((res) => {
  const contentType = res.headers.get('content-type')

  if (res.ok) {
    return res.json()
  }

  // request errored, handle
  return res.json().then((json) => {
    const err = json.error || json.err || json

    throw Object.assign(new Error(err.message), omit(err, 'message'))
  })
}).then((person) => {
  console.log(person.id, person.createdAt)
})
```

With `rek` this simply becomes:

```js
import { post } from 'rek'

post('/api/peeps', { name: 'James Brown' }).then((person) => {
  console.log(person.id, person.createdAt)
})
```

## Browsers (CommonJS and ESM) and Node supported

If using Node, make sure to install the optional dependency
[node-fetch](https://github.com/bitinn/node-fetch).

## Defaults

`rek` defines defaults that are used for every request.
If you pass an `options` object to any of `rek`s methods
that `options` object will be merge with the defaults.

The defaults are defined as follows:

```js
let defaults = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  credentials: 'same-origin'
}
```

See the [factory](#factory) section below for setting custom defaults.

## Exports

### Named exports

- __del__: make a request using the DELETE method
- __factory__: returns an object containing all methods with new default
  options and optionally another [responder](#the-responder)
- __get__: make a request using the GET method
- __patch__: make a request using PATCH method
- __post__: make a request using POST method

### Default export

The default export is the bare `rek` function, but with all other named exports added
as properties.

## Usage

All methods are exported as named exports, and as properties
on a default export.

### Named exports:

```js
import { get, post } from 'rek'

get('/api/peeps').then((users) => {
  console.log(users)
})

post('/api/peeps', { name: 'James Brown' }).then((user) => {
  console.log(user.id, user.createdAt)
})
```

### Default export:

```js
import rek from 'rek'

// the default http method in the initial defaults is 'GET', ie
// out of the box the regular `rek` function is equivalent to `rek.get`
rek('/api/peeps').then((users) => {
  console.log(users)
})

rek.get('/api/peeps').then((users) => {
  console.log(users)
})

rek.post('/api/peeps', { name: 'James Brown' }).then((user) => {
  console.log(user.id, user.createdAt)
})
```

### factory:

```js
factory(defaults, shouldMerge, responder)
```

`shouldMerge` decides whether to merge the passed in defaults with original defaults.
Pass responder to use custom [responder](#the-responder) instead of the provided.

```js
import { factory } from 'rek'

// the first call to factory will merge with initial defaults
const rek = factory({
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/html',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'omit',
}, true)

const { del, get, patch, post } = rek

// the following will merge newDefaults with the latest
// defaults, not initial defaults
const another = rek.factory(newDefaults, true)
```

or 

```js
import defaultRek from 'rek'

const rek = defaultRek.factory(defaults)
const { factory, del, get, patch, post } = rek
```

The factory will return a new `rek` function with it's own factory. Calling
this returned factory will merge defaults with previous factories defaults.

## The responder

The responder uses the headers to decide what to do with the response from server.

See [src/responder.js](https://github.com/lohfu/rek/blob/master/src/responder.js) for implementation details.

## Credits

Very big thank you to [kolodny](https://github.com/kolodny) for releasing the
NPM name!
