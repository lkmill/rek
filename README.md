# rek

Tiny  convience wrapper around the Fetch API aiming to
reduce boilerplate. The UMD build is ~811 bytes gzipped.

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
it still quickly becomes verbose to do simple tasks. To create a
relatively simple `POST` request using JSON, you often have to
write something like:

```js
fetch('/api/peeps', {
  method: 'POST',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
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
}).catch()
```

With `rek` this simply becomes:

```js
rek.post('/api/peeps', { name: 'James Brown' }).json().then((person) => {
  console.log(person)
}).catch()
```

## Browsers (CommonJS and ESM) and Node supported

This works in both Browsers and Node because the `main` field in package.json points
to a file that imports `node-fetch`, while the fields `browser` and `module` points
to files that do not.

NOTE: If using Node, make sure to install the optional dependency
[node-fetch](https://github.com/bitinn/node-fetch).

## Defaults

`rek` defines defaults that are used for every request.
If you pass an `options` object to any of `rek`s methods
that `options` object will be merged with the defaults.

The initial defaults are defined as follows:

```js
const defaults = {
  method: 'GET',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  credentials: 'same-origin',
}
```

See the [factory](#factory) section below for setting custom defaults.

## Usage

Calling `rek()` doesn't actually start the request and return the request promise. Instead
it returns a thenable with "aliases" for all body parsing methods. Calling 
`.then`, `.catch` or `.finally` will start the request and return the promise that resolves
to the `Response` instance, just like regular `fetch`.

```js
rek('/edge/of/glory').then(res => {})

const res = await rek('/edge/of/glory')
```

If one of the body methods is called, the correct `Accept` header will be
set before initiating the request and a promise that resolves to the
parsed body will be returned.

```js
rek('/lost/in/time').json().then(json => {})

const json = await rek('/lost/in/time').json()

rek('/under/the/weather').blob().then(blob => {})

const blob = await rek('/under/the/weather').blob()
```

Depending on parse method called, the following accept headers will be set:

- __arrayBuffer__: \*/\*
- __blob__: \*/\*
- __formData__: multipart/form-data
- __json__: application/json
- __text__: text/\*

### Automatically JSON.stringify body

If `body` is not a string and the `content-type` header is not set or is set to `application/json`,
`body` will be `JSON.stringify`:ed and the header will be set to `application/json`
(in case it is not set).


### HTTP Method Aliases

Convenience aliases for all relevant HTTP methods are available as methods on the
default export. Methods that support sending a body with
the request have a `body` argument (`body` will overwrite `options.body`).

- __rek.delete(url, options)__
- __rek.get(url, options)__ (Since method is 'GET' in the initial defaults, this is
  the same as the initial default export)
- __rek.head(url, options)__
- __rek.patch(url, body, options)__
- __rek.post(url, body, options)__
- __rek.put(url, body, options)__

```js
import rek from 'rek'


rek.delete('/api/peeps/1337').then((users) => {
  console.log(users)
})

rek.put('/api/peeps/14', { name: 'Max Powers' }).then((user) => {
  console.log(user.name)
})
```

### Factory:

The factory method on the default export will return a new `rek` with new defaults.

```js
import rek from 'rek'

const myRek = rek.factory({
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/html',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'omit',
})

myRek()
myRek.delete()
myRek.patch()
```

### baseUrl

The `baseUrl` option can be used to set a URL that all relative paths
will be calculated against. It uses the WHATWG URL to calculate like so:

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


## Credits

Very big thank you to [kolodny](https://github.com/kolodny) for releasing the
NPM name!
