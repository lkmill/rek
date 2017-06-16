import { pick, omit, isPlainObject } from 'lowline'

let defaults = {
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'same-origin',
}

function responder (res) {
  const contentType = res.headers.get('content-type')

  if (res.ok) {
    if (contentType && contentType.includes('application/json')) {
      return res.json()
    }

    return res
  }

  if (contentType && contentType.includes('application/json')) {
    return res.json().then((json) => {
      const err = json.error || json.err || json

      throw Object.assign(new Error(err.message), omit(err, 'message'))
    })
  }

  throw Object.assign(new Error(res.statusText), pick(res, 'status', 'statusText', 'url', 'redirect'))
}

function rek (url, options) {
  options = Object.assign({}, defaults, options)

  if (isPlainObject(options.body)) {
    const contentType = (options.headers && (options.headers instanceof Headers && options.headers.get('content-type'))) || options.headers['content-type']

    if (contentType && contentType === 'application/json') {
      options.body = JSON.stringify(options.body)
    }
  }

  return fetch(url, options).then(responder)
}

function get (url, options) {
  return rek(url, Object.assign({ method: 'GET' }, options))
}

function del (url, options) {
  return rek(url, Object.assign({ method: 'DELETE' }, options))
}

function patch (url, body, options) {
  return rek(url, Object.assign({ body, method: 'PATCH' }, options))
}

function post (url, body, options) {
  return rek(url, Object.assign({ body, method: 'POST' }, options))
}

function setDefaults (options) {
  defaults = options
}

export default {
  get,
  post,
  patch,
  del,
  rek,
  setDefaults,
}

export {
  get,
  post,
  patch,
  del,
  rek,
  setDefaults,
}
