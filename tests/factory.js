import test from 'tape'
import sinon from 'sinon'

import factory from '../src/factory.js'
import FetchError from '../src/error.js'

const responseTypes = ['arrayBuffer', 'blob', 'formData', 'json', 'text']
const requestMethods = ['delete', 'get', 'head']
const dataMethods = ['patch', 'post', 'put']

class FakeHeaders extends Map {
  constructor(headers) {
    super(Object.entries(headers))
  }
}

test('returns a function', (t) => {
  t.equal(typeof factory({}, {}), 'function', 'is a function')

  t.end()
})

test('response type', async (t) => {
  let rek = factory({}, { Headers: FakeHeaders })

  t.throws(
    () => {
      rek('/', { response: 'not a valid response type' })
    },
    /Unknown response type/,
    'errors on invalid response type',
  )

  const fakeResponse = { ok: true, json: () => Promise.resolve({}) }

  rek = factory({}, { fetch: sinon.fake.resolves(fakeResponse), Headers: FakeHeaders })

  let res = await rek('/')

  t.equals(res, fakeResponse, 'defaults to no parsing, ie returns the response')

  res = await rek('/', { response: false })

  t.equals(res, fakeResponse, 'returns the response instance when `response: false`')

  res = await rek('/', { response: null })

  t.equals(res, fakeResponse, 'returns the response instance when `response: null`')

  for (const type of responseTypes) {
    t.test(`.${type}()`, async (ts) => {
      const bodyMethod = sinon.fake.resolves()
      const fetch = sinon.fake.resolves({ ok: true, [type]: bodyMethod })
      const rek = factory({}, { fetch, Headers: FakeHeaders })

      const accept = 'application/msword'
      await rek('/', { headers: { accept }, response: type })

      ts.notEquals(fetch.lastCall.args[1].headers.get('accept'), accept, 'changes accept header')
      ts.ok(bodyMethod.calledOnce, `res.${type}() called`)
    })
  }
})

test('http method helpers', async (t) => {
  const fetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })
  const rek = factory({}, { fetch, Headers: FakeHeaders })
  const init = { chache: 'no-store', redirect: 'follow' }
  const url = '/'

  for (const method of requestMethods) {
    const upperCase = method.toUpperCase()

    rek[method](url, init)

    t.ok(
      fetch.lastCall.calledWith(url, sinon.match({ ...init, method: upperCase })),
      `.${method}() adds \`method\` to init argument`,
    )
  }

  for (const method of dataMethods) {
    const upperCase = method.toUpperCase()
    const data = { nonStaticData: method }

    rek[method](url, data, init)

    t.ok(
      fetch.lastCall.calledWith(url, sinon.match({ ...init, body: JSON.stringify(data), method: upperCase })),
      `.${method}() adds \`method\` and \`body\` to init argument`,
    )
  }
})

test('stringifies plain object body', (t) => {
  const fetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })
  const rek = factory({}, { fetch, Headers: FakeHeaders })
  const url = '/a/deeper/url'
  let init = {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: { hello: 'again', another: 'prop' },
  }

  rek(url, {
    ...init,
  })

  let args = fetch.lastCall.args

  t.equals(args[1].body, JSON.stringify(init.body), 'stringifies when content-type is set to "application/json"')

  init = {
    method: 'POST',
    body: { hello: 'again', another: 'prop' },
  }
  rek(url, init)

  args = fetch.lastCall.args

  t.equals(
    args[1].headers.get('content-type'),
    'application/json',
    'sets content-type header to "application/json" if it is not set and body is a plain object',
  )
  t.equals(args[1].body, JSON.stringify(init.body), 'stringifies when no content-type and plain object body')

  t.end()
})

test('removes content-type when body is URLSearchParams or FormData', (t) => {
  class OtherClass {}
  class FakeFormData {}
  const fetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })
  const rek = factory({}, { fetch, Headers: FakeHeaders, FormData: FakeFormData, URLSearchParams })

  let init = {
    headers: { 'content-type': 'multipart/form-data' },
    body: new URLSearchParams({ param: 1, param2: 2 }),
  }

  rek('/', init)

  let args = fetch.lastCall.args

  t.notOk(args[1].headers.has('content-type'), 'content-type header removed when body is URLSearchParams')

  init = {
    headers: { 'content-type': 'multipart/form-data' },
    body: new FakeFormData(),
  }

  rek('/', init)

  args = fetch.lastCall.args

  t.notOk(args[1].headers.has('content-type'), 'content-type header removed when body is FormData')

  init = {
    headers: { 'content-type': 'multipart/form-data' },
    body: new OtherClass(),
  }

  rek('/', init)

  args = fetch.lastCall.args

  t.ok(args[1].headers.has('content-type'), 'content-type header not remove for other type')

  t.end()
})

test('.extend()', (t) => {
  t.test('.extend(defaults, api)', (ts) => {
    const fetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })
    const Headers = sinon.fake((headers) => new Map(Object.entries(headers)))
    const initialApi = { fetch, Headers }
    const initialDefaults = { response: 'text' }
    const url = '/'
    const rek = factory(initialDefaults, initialApi)

    rek(url)

    ts.equals(fetch.callCount, 1, 'original fetch called')
    ts.equals(Headers.callCount, 1, 'Headers called')
    ts.ok(fetch.lastCall.calledWith(url, sinon.match(initialDefaults)))

    const newDefaults = { method: 'post' }

    let newRek = rek.extend(newDefaults)

    newRek(url)

    ts.equals(fetch.callCount, 2, 'original fetch called')
    ts.equals(Headers.callCount, 2, 'Headers called')
    ts.ok(fetch.lastCall.calledWith(url, sinon.match({ ...initialDefaults, ...newDefaults })))

    const newFetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })

    newRek = newRek.extend(null, { fetch: newFetch })

    newRek(url)

    ts.equals(fetch.callCount, 2, 'original fetch not called again')
    ts.equals(newFetch.callCount, 1, 'new fetch called')
    ts.equals(Headers.callCount, 3, 'Headers called')
    ts.ok(fetch.lastCall.calledWith(url, sinon.match({ ...initialDefaults, ...newDefaults })), 'uses new defaults')

    ts.end()
  })

  t.test('.extend(() => [])', (ts) => {
    const fetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })
    const Headers = sinon.fake((headers) => new Map(Object.entries(headers)))
    const initialApi = { fetch, Headers }
    const initialDefaults = { response: 'text' }
    const url = '/'
    const rek = factory(initialDefaults, initialApi)

    rek.extend((defaults, api) => {
      ts.equals(defaults, initialDefaults, 'passes defaults argument to callback')
      ts.equals(api, initialApi, 'passes api argument to callback')

      return [defaults, api]
    })

    const newDefaults = { method: 'post' }
    let newRek = rek.extend((defaults, api) => [
      {
        ...defaults,
        ...newDefaults,
      },
      api,
    ])

    newRek(url)

    ts.equals(fetch.callCount, 1, 'original fetch called')
    ts.equals(Headers.callCount, 1, 'Headers called')
    ts.ok(fetch.lastCall.calledWith(url, sinon.match({ ...initialDefaults, ...newDefaults })))

    const newFetch = sinon.fake.returns({ then: () => ({ then: () => {} }) })

    newRek = newRek.extend(null, { fetch: newFetch })

    newRek(url)

    ts.equals(fetch.callCount, 1, 'original fetch not called again')
    ts.equals(newFetch.callCount, 1, 'new fetch called')
    ts.equals(Headers.callCount, 2, 'Headers called')
    ts.ok(fetch.lastCall.calledWith(url, sinon.match({ ...initialDefaults, ...newDefaults })), 'uses new defaults')

    ts.end()
  })
})

test('error', async (t) => {
  const baseResponse = {
    ok: false,
    status: 404,
    statusText: 'oh man so much status',
  }

  let body = { a: 'very', plain: 'object' }
  const response = {
    ...baseResponse,
    text: sinon.fake.resolves(JSON.stringify(body)),
  }
  let rek = factory(
    {},
    {
      fetch: sinon.fake.resolves(response),
      Headers: FakeHeaders,
    },
  )

  await rek('/').catch((err) => {
    t.ok(err instanceof FetchError, 'is instance of FetchError')
    t.equals(err.message, response.statusText, 'sets `message` to statusText of response')
    t.equals(err.status, response.status, 'sets `status`')
    t.equals(err.response, response, 'sets `response`')
    t.ok(typeof err.stack === 'string', 'has a stack')
    t.deepEquals(err.body, body, 'parses JSON response and sets as `body`')
  })

  body = 'a detailed explanation of a very unusual error'
  rek = factory(
    {},
    {
      fetch: sinon.fake.resolves({
        ...response,
        text: sinon.fake.resolves(body),
      }),
      Headers: FakeHeaders,
    },
  )

  await rek('/').catch((err) => {
    t.equals(err.body, body, 'sets text body when not valid JSON')
  })

  rek = factory(
    {},
    {
      fetch: sinon.fake.resolves({
        ...response,
        text: sinon.fake.rejects(),
      }),
      Headers: FakeHeaders,
    },
  )

  await rek('/').catch((err) => {
    t.equals(typeof err.body, 'undefined', 'undefined body if error parsing text')
  })
})
