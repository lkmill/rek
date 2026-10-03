import factory from './factory.js'

export default factory({
  credentials: 'same-origin',
  response: 'json',
  fetch,
  Headers,
})

/**
 * @typedef {import('./types.ts').Defaults} Defaults
 * @typedef {import('./types.ts').Options} Options
 * @typedef {import('./types.ts').Rek} Rek
 */
