type Primitive = bigint | boolean | null | number | string | symbol | undefined

type ValidJSON = Primitive | ValidJSON[] | JSONObject

interface JSONObject {
  [key: string]: ValidJSON
}

type responseType = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'

export declare interface Options extends Omit<RequestInit, 'body'> {
  baseUrl?: string
  body?: BodyInit | any
  response?: responseType | null | ((res: Response) => any)
  searchParams?: JSONObject | URLSearchParams | string
}

export declare interface API {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  Headers: Headers
  URL: URL
  URLSearchParams: URLSearchParams
}

export type WithoutBodyMethod = <Type = ArrayBuffer | Blob | FormData | ValidJSON | Response | string | null>(
  url: string,
  options?: Options | responseType,
) => Promise<Type>

export type BodyMethod = <Type = ArrayBuffer | Blob | FormData | ValidJSON | Response | string | null>(
  url: string,
  body?: BodyInit | any,
  options?: Options | responseType,
) => Promise<Type>

export declare interface Rek extends WithoutBodyMethod {
  delete: WithoutBodyMethod
  get: WithoutBodyMethod
  head: WithoutBodyMethod
  patch: BodyMethod
  post: BodyMethod
  put: BodyMethod

  extend(defaults?: Options, api?: API): Rek
  extend(fnc: (defaults?: Options, api?: API) => [Options, API]): Rek
}
