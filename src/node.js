// eslint-disable-next-line import/no-unresolved
import fetch from 'node-fetch'
import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory({
  credentials: 'same-origin',
  response: 'json',
  fetch,
  Headers: fetch.Headers,
})

/**
 * @typedef {import('./type').Defaults} Defaults
 * @typedef {import('./type').Options} Options
 * @typedef {import('./type').Rek} Rek
 */
