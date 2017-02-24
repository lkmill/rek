# rek

Wrapper around the Fetch API, mainly meant for consuming JSON api's.

## Philosophy

While the Fetch API is a hell of a lot nicer to work with than XHR,
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

## Usage

All methods are exported as named exports, and as properties
on a default export.

```js
import { get, post } from 'rek'

get('/api/poops').then((users) => {
  console.log('users')
})

post('/api/poops', { color: 'brown', weight: '2kg' }).then((poop) => {
  console.log(poop.id, poop.createdAt)
})
```

or

```js
import rek from 'rek'

rek.get('/api/poops').then((users) => {
  console.log('users')
})

rek.post('/api/poops', { color: 'brown', weight: '2kg' }).then((poop) => {
  console.log(poop.id, poop.createdAt)
})
```

## Defaults

`rek` defines defaults that are used for every request.
If you pass an `options` object to any of `rek`s methods
that `options` object will be merge with the defaults.

The defaults are defined as follows:

```js
let defaults = {
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  credentials: 'same-origin'
}
```

### setDefaults(options)

Will completely override previous defaults (no merging or assigning done).

```js
import { setDefaults } from 'rek'

setDefaults(myOptions)
```


## Credits

Very big thank you to [kolodny](https://github.com/kolodny) for releasing the
NPM name!
