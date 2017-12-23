import factory from './factory'

const {
  del,
  get,
  patch,
  post,
  rek,
} = factory()

rek.factory = factory

export default rek

export {
  del,
  factory,
  get,
  patch,
  post,
  rek,
}
