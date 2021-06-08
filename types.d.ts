type PlainObject = {
  [name: string]: any
}

interface Options extends Omit<RequestInit, 'body'> {
  body?: string | PlainObject
  baseUrl?: string
  response: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text' | false
  searchParams?: string | PlainObject
}

interface API {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  FormData: FormData
  Headers: Headers
  URL: URL
  URLSearchParams: URLSearchParams
}

type RekResponse = Promise<ArrayBuffer | Blob | FormData | PlainObject | Response | string>

export interface Rek {
  (url: string, options?: Options): RekResponse
  delete(url: string, options?: Options): RekResponse
  get(url: string, options?: Options): RekResponse
  head(url: string, options?: Options): RekResponse
  patch(url: string, body?: any, options?: Options): RekResponse
  post(url: string, body?: any, options?: Options): RekResponse
  put(url: string, body?: any, options?: Options): RekResponse

  extend(defaults?: Options, api: API): Rek
  extend(fnc: (defaults?: Options, api?: API) => [Options, API]): Rek
}

declare let rek: Rek

export default rek
