import factory from './factory.js'

export { default as FetchError } from './error.js'
export default factory({ credentials: 'same-origin' }, self)
