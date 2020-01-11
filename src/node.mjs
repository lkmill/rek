import { URL } from 'url'
import fetch, { Headers } from 'node-fetch'

import factory from './factory.mjs'

export default factory({ credentials: 'same-origin' }, { fetch, Headers, URL })
