import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory({
  credentials: 'same-origin',
  response: 'json',
  fetch,
  Headers,
})

/**
 * @typedef {import('./types.js').Defaults} Defaults
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Rek} Rek
 */
