import factory from './factory'

Object.assign(factory, factory())

const {
  get,
  post,
  patch,
  del,
  rek,
} = factory

export default factory

export {
  get,
  post,
  patch,
  del,
  rek,
}
