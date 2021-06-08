import FetchError from './error.js'

const requestMethods = ['delete', 'get', 'head']

const dataMethods = ['patch', 'post', 'put']

const responseTypes = {
  arrayBuffer: '*/*',
  blob: '*/*',
  formData: 'multipart/form-data',
  json: 'application/json',
  text: 'text/*',
}

export default function factory(defaults, api) {
  const { fetch, FormData, Headers, URL, URLSearchParams } = api

  function makeRequest(url, options) {
    return fetch(url, options).then((res) => {
      if (!res.ok) {
        return res
          .text()
          .then((text) => {
            try {
              return JSON.parse(text)
            } catch {
              return text
            }
          })
          .catch(() => {})
          .then((body) => {
            throw new FetchError(res, body)
          })
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

    if (typeof body === 'object') {
      const prototype = Object.getPrototypeOf(body)

      if (prototype === null || prototype === Object.prototype) {
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json')
        }

        if (headers.get('content-type').includes('application/json')) {
          options.body = JSON.stringify(body)
        }
      } else if ((FormData && body instanceof FormData) || body instanceof URLSearchParams) {
        headers.delete('content-type')
      }
    }

    if (options.response === false) return makeRequest(url, options)

    const response = options.response || 'json'

    if (!(response in responseTypes)) throw new Error('Unknown response type: ' + response)

    headers.set('accept', responseTypes[response])

    return makeRequest(url, options).then((res) => (res.status === 204 ? null : res[response]()))
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  dataMethods.forEach((method) => {
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
