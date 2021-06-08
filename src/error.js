class FetchError extends Error {
  constructor(response, body) {
    super(response.statusText)
    this.name = 'FetchError'
    this.status = response.status
    this.response = response
    this.body = body
  }
}

export default FetchError
