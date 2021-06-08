import { URL, URLSearchParams } from 'url'
import fetch from 'node-fetch'

import factory from './factory.js'

export default factory({ credentials: 'same-origin' }, { fetch, Headers: fetch.Headers, URL, URLSearchParams })
