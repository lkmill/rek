import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory({ credentials: 'same-origin', response: 'json' }, self)

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').API} API
 * @typedef {import('./types').Rek} Rek
 */
