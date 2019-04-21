import factory from './factory'

const defaults = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'same-origin',
}

export default factory(defaults)
