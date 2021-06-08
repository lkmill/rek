import { URL, URLSearchParams } from 'url'
// eslint-disable-next-line import/no-unresolved
import fetch from 'node-fetch'
import factory from './factory.js'

export { default as FetchError } from './error.js'

export default factory({ credentials: 'same-origin' }, { fetch, Headers: fetch.Headers, URL, URLSearchParams })
