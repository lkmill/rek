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

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').API} API
 * @typedef {import('./types').Rek} Rek
 */

/**
 * @param {Options | null | undefined} defaults
 * @param {API} api
 * @returns {Rek}
 */
export default function factory(defaults, api) {
  const { fetch, Headers, URL, URLSearchParams } = api

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
    if (typeof options === 'string') options = { response: options }

    options = Object.assign({}, defaults, options)

    if (options.baseUrl) {
      url = new URL(url, options.baseUrl).href
    }

    if (options.searchParams) {
      url = url.split('?')[0] + '?' + new URLSearchParams(options.searchParams)
    }

    const headers = (options.headers = new Headers(Object.assign({}, defaults.headers, options.headers)))

    const body = options.body

    if (body && typeof body === 'object') {
      // check if FormData or URLSearchParams
      if (typeof body.append === 'function') headers.delete('content-type')
      // check if ReadableStream (.tee()) or Blob (.stream())
      else if (typeof (body.getReader || body.stream) !== 'function') {
        options.body = JSON.stringify(body)
        headers.set('content-type', 'application/json')
      }
    }

    const response = options.response

    let onFullfilled

    if (response) {
      if (typeof response === 'function') {
        onFullfilled = response
      } else if (response in responseTypes) {
        headers.set('accept', responseTypes[response])

        onFullfilled = (res) => (res.status === 204 ? null : res[response]())
      } else {
        throw new Error('Unknown response type: ' + response)
      }
    }

    const res = makeRequest(url, options)

    return onFullfilled ? res.then(onFullfilled) : res
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  dataMethods.forEach((method) => {
    rek[method] = (url, body, options) => rek(url, Object.assign({}, options, { body, method: method.toUpperCase() }))
  })

  rek.extend = (newDefaults, newApi) =>
    factory.apply(
      this,
      typeof newDefaults === 'function'
        ? newDefaults(defaults, api)
        : [Object.assign({}, defaults, newDefaults), Object.assign({}, api, newApi)],
    )

  return rek
}
