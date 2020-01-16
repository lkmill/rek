type PlainObject = {
  [name: string]: any
}

interface Options extends Omit<RequestInit, 'body'> {
  body?: string | PlainObject
  baseUrl?: string
  searchParams?: string | PlainObject
}

interface API {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  Headers: Headers
  URL: URL
  URLSearchParams: URLSearchParams
}

interface RekResponse
  extends Pick<Body, 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'>,
    Pick<Promise<Response>, 'then'> {
  run(): Promise<Response>
}

export interface Rek {
  (url: string, options?: Options): RekResponse
  delete(url: string, options?: Options): RekResponse
  get(url: string, options?: Options): RekResponse
  head(url: string, options?: Options): RekResponse
  patch(url: string, body?: any, options?: Options): RekResponse
  post(url: string, body?: any, options?: Options): RekResponse
  put(url: string, body?: any, options?: Options): RekResponse

  factory(defaults?: Options, api?: API): Rek
  extend(newDefaults?: Options, newApi?: API): Rek
  getArgs(): [Options, API]
}

declare let rek: Rek

export default rek
