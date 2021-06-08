function FetchError(response, details) {
  this.name = 'FetchError'
  this.message = response.statusText
  this.status = response.status
  Object.assign(this, details)
  this.response = response
  this.stack = new Error().stack
}

FetchError.prototype = Object.create(Error.prototype)
FetchError.prototype.constructor = FetchError

export default FetchError
