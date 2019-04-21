import { isPlainObject } from 'lowline'

const bodyMethods = [
  'arrayBuffer',
  'blob',
  'formData',
  'json',
  'text',
]

const requestMethods = [
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put',
]

export default function factory (defaults) {
  if (!defaults) {
    throw new Error('Defaults are required')
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

    for (const method of bodyMethods) {
      promise[method] = () => promise.then(res => res[method]())
    }

    return promise
  }

  for (const method of requestMethods) {
    rek[method] = (url, options) => rek(url, { ...options, method: method.toUpperCase() })
  }

  rek.factory = factory

  return rek
}
