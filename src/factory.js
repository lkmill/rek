import { isPlainObject } from 'lowline'

import defaultResponder from './responder'

let initialDefaults = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'same-origin',
}

export default function factory (defaults = initialDefaults, merge = true, responder = defaultResponder) {
  if (defaults !== initialDefaults && merge) {
    // conditional is to guard against null
    defaults = defaults ? {
      credentials: defaults.credentials || initialDefaults.credentials,
      headers: Object.assign({}, initialDefaults.headers, defaults.headers),
    } : initialDefaults
  }

  function rek (url, options) {
    options = Object.assign({}, defaults, options)

    if (isPlainObject(options.body)) {
      const contentType = (options.headers && (options.headers instanceof Headers && options.headers.get('content-type'))) || options.headers['content-type']

      if (contentType && contentType === 'application/json') {
        options.body = JSON.stringify(options.body)
      }
    }

    const promise = fetch(url, options)

    if (options.raw) {
      return promise
    }

    return promise.then(responder)
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

  Object.assign(rek, { del, get, patch, post })

  return {
    rek,
    get,
    del,
    patch,
    post,
  }
}
