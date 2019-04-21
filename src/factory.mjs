const requestMethods = [
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put',
]

const responseTypes = {
  arrayBuffer: '*/*',
  blob: '*/*',
  formData: 'multipart/form-data',
  json: 'application/json',
  text: 'text/*',
}

class FetchError extends Error {
  constructor (response) {
    super(response.statusText)

    this.status = response.status
    this.response = response
  }
}

function run (url, options) {
  return fetch(url, options).then(res => {
    if (!res.ok) {
      throw new FetchError(res)
    }

    return res
  })
}

export default function factory (defaults = {}) {
  function rek (url, options) {
    options = {
      ...defaults,
      ...options,
    }

    const headers = options.headers = new Headers(Object.assign({}, defaults.headers, options.headers))

    if (options.json) {
      headers.set('content-type', 'application/json')

      options.body = JSON.stringify(options.json)
    }

    const obj = {
      then: (onResolved, onRejected) => run(url, options).then(onResolved, onRejected),
      catch: (onRejected) => run(url, options).catch(onRejected),
      finally: (onFinally) => run(url, options).finally(onFinally),
    }

    for (const type in responseTypes) {
      obj[type] = () => {
        headers.set('accept', responseTypes[type])

        return run(url, options).then(res => res[type]())
      }
    }

    return obj
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, { ...options, method: method.toUpperCase() })
  })

  rek.factory = factory

  return rek
}
