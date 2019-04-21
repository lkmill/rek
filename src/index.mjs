import responder from './responder'
import baseFactory from './factory'

let defaults = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'same-origin',
}

const rek = baseFactory(defaults, responder)

export default rek
