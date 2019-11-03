const requestMethods = [
  'delete',
  'get',
  'head',
]

const dataMethods = [
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

export default function factory (defaults, api) {
  defaults = defaults || {}
  api = api || window

  const fetch = api.fetch
  const Headers = api.Headers

  function makeRequest (url, options) {
    return fetch(url, options).then(res => {
      if (!res.ok) {
        throw new FetchError(res)
      }

      return res
    })
  }

  function rek (url, options) {
    options = Object.assign({}, defaults, options)

    if (options.baseUrl) {
      url = (new URL(url, options.baseUrl)).href
    }

    const headers = options.headers = new Headers(Object.assign({}, defaults.headers, options.headers))

    const { body } = options

    if (body && typeof body !== 'string' && (!headers.has('content-type') || headers.get('content-type').includes('application/json'))) {
      headers.set('content-type', 'application/json')

      options.body = JSON.stringify(body)
    }

    const obj = {
      then: (onResolved, onRejected) => makeRequest(url, options).then(onResolved, onRejected),
      catch: (onRejected) => makeRequest(url, options).catch(onRejected),
      finally: (onFinally) => makeRequest(url, options).finally(onFinally),
    }

    for (const type in responseTypes) {
      obj[type] = () => {
        if (!headers.has('accept')) {
          headers.set('accept', responseTypes[type])
        }

        return makeRequest(url, options).then(res => res[type]())
      }
    }

    return obj
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  dataMethods.forEach((method) => {
    rek[method] = (url, body, options) => rek(url, Object.assign({}, options, { body, method: method.toUpperCase() }))
  })

  rek.factory = factory

  return rek
}
