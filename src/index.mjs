import factory from './factory'

const defaults = {
  method: 'GET',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'same-origin',
}

export default factory(defaults)
