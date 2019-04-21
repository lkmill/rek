import { merge, isPlainObject } from 'lowline'

const requestMethods = [
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put',
]

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

  for (const method of requestMethods) {
    rek[method] = (url, options) => rek(url, { ...options, method: method.toUpperCase() })
  }

  rek.factory = factory

  return rek
}
