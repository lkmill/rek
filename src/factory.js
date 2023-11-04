/**
 * @typedef {import('./types').Defaults} Defaults
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').Rek} Rek
 */

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
 *
 * @param {Defaults} defaults
 * @returns {Rek}
 */
export default function factory(defaults) {
  function rek(url, options) {
    if (typeof options === 'string') options = { response: options }

    options = Object.assign({}, defaults, options)

    if (options.baseUrl) {
      url = new URL(url, options.baseUrl).href
    }

    if (options.searchParams) {
      url = url.split('?')[0] + '?' + new URLSearchParams(options.searchParams)
    }

    options.headers = new options.Headers(Object.assign({}, defaults.headers, options.headers))

    const { body, headers, response, fetch } = options

    if (body && typeof body === 'object') {
      if (typeof body.append === 'function') {
        // is FormData or URLSearchParams
        headers.delete('content-type')
      } else if (
        typeof (body.getReader || body.stream) !== 'function' &&
        (typeof body.byteLength !== 'number' || typeof (body.slice || body.getInt8) !== 'function')
      ) {
        // `body` is not a valid `BodyInit` (needs to be ReadableStream
        // (.getReader), Blob (.stream), ArrayBuffer or DataView (.byteLength
        // and .slice or .getInt8)), stringifying
        options.body = JSON.stringify(body)
        headers.set('content-type', 'application/json')
      }
    }

    const onFullfilled =
      response &&
      (typeof response === 'function'
        ? response
        : (headers.set('accept', responseTypes[response]), (res) => (res.status === 204 ? null : res[response]())))

    const res = fetch(url, options).then((res) => {
      if (res.ok) return res

      return res
        .text()
        .then((text) => {
          try {
            return JSON.parse(text)
          } catch {
            return text || null
          }
        })
        .catch(() => null)
        .then((body) => {
          throw new FetchError(res, body)
        })
    })

    return res.then(onFullfilled)
  }

  requestMethods.forEach((method) => {
    rek[method] = (url, options) => rek(url, Object.assign({}, options, { method: method.toUpperCase() }))
  })

  dataMethods.forEach((method) => {
    rek[method] = (url, body, options) => rek(url, Object.assign({}, options, { body, method: method.toUpperCase() }))
  })

  rek.extend = (newDefaults) =>
    factory(
      Object.assign({}, defaults, newDefaults, {
        headers: Object.assign({}, defaults.headers, newDefaults.headers),
      }),
    )

  return rek
}
