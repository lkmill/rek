import { merge, isPlainObject } from 'lowline'

export default function baseFactory (defaults, responder) {
  if (!defaults || !responder) {
    throw new Error('Defaults and responder are required')
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

  function factory (_defaults = defaults, shouldMerge = true, _responder = responder) {
    if (shouldMerge && _defaults !== defaults) {
      _defaults = merge({}, defaults, _defaults)
    } else if (!_defaults) {
      // guard against null
      _defaults = defaults
    }

    return baseFactory(_defaults, _responder)
  }

  function get (url, options) {
    return rek(url, Object.assign({}, options, { method: 'GET' }))
  }

  function del (url, options) {
    return rek(url, Object.assign({}, options, { method: 'DELETE' }))
  }

  function patch (url, body, options) {
    return rek(url, Object.assign({}, options, { body, method: 'PATCH' }))
  }

  function post (url, body, options) {
    return rek(url, Object.assign({}, options, { body, method: 'POST' }))
  }

  return Object.assign(rek, { del, get, patch, post, factory })
}
