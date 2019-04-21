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

export default function factory (defaults = {}) {
  function rek (url, options) {
    options = {
      ...defaults,
      ...options,
      headers: new Headers(Object.assign({}, defaults.headers, options.headers)),
    }

    if (options.json) {
      options.headers.set('content-type', 'application/json')

      options.body = JSON.stringify(options.json)
    }

    const promise = fetch(url, options)

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
