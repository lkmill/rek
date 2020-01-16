const requestMethods = ['delete', 'get', 'head']

const dataMethods = ['patch', 'post', 'put']

const responseTypes = {
  arrayBuffer: '*/*',
  blob: '*/*',
  formData: 'multipart/form-data',
  json: 'application/json',
  text: 'text/*',
}

export function FetchError(response) {
  this.name = 'FetchError'
  this.message = response.statusText
  this.status = response.status
  this.response = response
  this.stack = new Error().stack
}

FetchError.prototype = Object.create(Error.prototype)
FetchError.prototype.constructor = FetchError

export default function factory(defaults, api) {
  api =
    api ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof globalThis !== 'undefined' && globalThis)

  const fetch = api.fetch
  const Headers = api.Headers
  const URL = api.URL
  const URLSearchParams = api.URLSearchParams

  function makeRequest(url, options) {
    return fetch(url, options).then(res => {
      if (!res.ok) {
        throw new FetchError(res)
      }

      return res
    })
  }

  function rek(url, options) {
    options = Object.assign({}, defaults, options)

    if (options.baseUrl) {
      url = new URL(url, options.baseUrl).href
    }

    if (options.searchParams) {
      url = `${url.split('?')[0]}?${new URLSearchParams(options.searchParams)}`
    }

    const headers = (options.headers = new Headers(Object.assign({}, defaults.headers, options.headers)))

    const body = options.body

    if (body && typeof body !== 'string') {
      let contentType = headers.get('content-type')

      if (!contentType) {
        headers.set('content-type', (contentType = 'application/json'))
      }

      if (contentType.includes('application/json')) {
        options.body = JSON.stringify(body)
      }
    }

    const obj = {
      run: () => makeRequest(url, options),
      then: (onResolved, onRejected) => makeRequest(url, options).then(onResolved, onRejected),
    }

    for (const type in responseTypes) {
      obj[type] = () => {
        headers.set('accept', responseTypes[type])

        return makeRequest(url, options).then(res => res[type]())
      }
    }

    return obj
  }

  requestMethods.forEach(method => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  dataMethods.forEach(method => {
    rek[method] = (url, body, options) => rek(url, Object.assign({}, options, { body, method: method.toUpperCase() }))
  })

  rek.extend = (newDefaults, newApi) =>
    factory(
      newDefaults ? Object.assign({}, defaults, newDefaults) : defaults,
      newApi ? Object.assign({}, api, newApi) : api,
    )
  rek.factory = factory
  rek.getArgs = () => [defaults, api]

  return rek
}
