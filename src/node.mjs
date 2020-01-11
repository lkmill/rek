import { URL } from 'url'
import fetch from 'node-fetch'

import factory from './factory.mjs'

export default factory({ credentials: 'same-origin' }, { fetch, Headers: fetch.Headers, URL })
