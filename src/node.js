import { URL, URLSearchParams } from 'url'
// eslint-disable-next-line import/no-unresolved
import fetch from 'node-fetch'
import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory(
  { credentials: 'same-origin', response: 'json' },
  { fetch, Headers: fetch.Headers, URL, URLSearchParams },
)

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').API} API
 * @typedef {import('./types').Rek} Rek
 */
