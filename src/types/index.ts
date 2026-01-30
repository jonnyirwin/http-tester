export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer' | 'apikey'
  username?: string
  password?: string
  token?: string
  apiKey?: string
  apiKeyName?: string
  apiKeyIn?: 'header' | 'query'
}

export interface RequestConfig {
  id: string
  name: string
  description: string
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  queryParams: KeyValuePair[]
  body: string
  bodyType: BodyType
  auth: AuthConfig
  preRequestScript: string
}

export interface ResponseData {
  success: boolean
  status?: number
  statusText?: string
  headers?: Record<string, string>
  cookies?: string
  body?: string
  duration: number
  size?: number
  error?: string
}

export interface Collection {
  id: string
  name: string
  description: string
  requests: RequestConfig[]
  createdAt: string
  updatedAt: string
}

export interface Environment {
  id: string
  name: string
  variables: { key: string; value: string }[]
}

export interface HistoryEntry {
  id: string
  method: HttpMethod
  url: string
  status?: number
  duration: number
  timestamp: string
  request: RequestConfig
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

export type BodyType = 'none' | 'json' | 'xml' | 'text' | 'form-urlencoded'

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'text', label: 'Raw Text' },
  { value: 'form-urlencoded', label: 'Form URL Encoded' },
]
