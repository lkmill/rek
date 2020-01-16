import unfetch from 'unfetch'

import factory from './factory.mjs'

function URL(url, baseUrl) {
  this.href = baseUrl ? baseUrl + '/' + url : url
}

function URLSearchParams(obj) {
  let str = ''

  if (typeof obj === 'string') {
    str = obj
  } else {
    for (const key in obj) {
      str += `${str ? '&' : ''}${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    }
  }

  this._s = str
}

URLSearchParams.prototype.toString = function() {
  return this._s
}

function Headers(headers) {
  this.__h = {}

  for (const header in headers) {
    this.__h[header.toLowerCase()] = headers[header]
  }

  this.get = n => this.__h[n.toLowerCase()]
  this.set = (n, v) => (this.__h[n.toLowerCase()] = v)
}

function fetch(url, options) {
  options.headers = options.headers.__h

  return unfetch(url, options)
}

export default factory({ credentials: 'same-origin' }, { fetch, Headers, URL, URLSearchParams })
