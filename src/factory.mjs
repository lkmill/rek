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

function FetchError (response) {
  Error.captureStackTrace(this, FetchError)

  this.name = 'FetchError'
  this.message = response.statusText
  this.status = response.status
  this.response = response
}

FetchError.prototype = Object.create(Error.prototype)
FetchError.prototype.constructor = FetchError

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
    options = Object.assign({}, defaults, options)

    if (options.baseUrl) {
      url = (new URL(url, options.baseUrl)).href
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
      obj[type] = function () {
        headers.set('accept', responseTypes[type])

        return run(url, options).then(res => res[type]())
      }
    }

    return obj
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  rek.factory = factory

  return rek
}
