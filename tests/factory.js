import test from 'tape'
import factory from '../src/factory.js'

const requestMethods = ['delete', 'get', 'head']
const dataMethods = ['patch', 'post', 'put']

test('returns a function', (t) => {
  const rek = factory()
  t.equal(typeof rek, 'function', 'is a function')
  t.end()
})

test('has request methods', (t) => {
  const rek = factory()

  for (const method of [...requestMethods, ...dataMethods]) {
    t.equal(typeof rek[method], 'function', `has ${method}`)
  }

  t.end()
})
