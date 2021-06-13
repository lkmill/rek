class FetchError extends Error {
  /**
   * @param {Response} response
   * @param {any} [body]
   */
  constructor(response, body) {
    super(response.statusText)
    this.name = 'FetchError'
    this.status = response.status
    this.response = response
    this.body = body
  }
}

export default FetchError
