import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory({
  credentials: 'same-origin',
  response: 'json',
  fetch,
  Headers,
})

/**
 * @typedef {import('./types').Defaults} Defaults
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').Rek} Rek
 */
