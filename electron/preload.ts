import { contextBridge, ipcRenderer } from 'electron'

export interface HttpRequestConfig {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timeout?: number
}

export interface HttpResponse {
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
  requests: SavedRequest[]
  createdAt: string
  updatedAt: string
}

export interface SavedRequest {
  id: string
  name: string
  description: string
  method: string
  url: string
  headers: { key: string; value: string; enabled: boolean }[]
  queryParams: { key: string; value: string; enabled: boolean }[]
  body: string
  bodyType: string
  auth: AuthConfig
  preRequestScript: string
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

export interface Environment {
  id: string
  name: string
  variables: { key: string; value: string }[]
}

export interface HistoryEntry {
  id: string
  method: string
  url: string
  status?: number
  duration: number
  timestamp: string
  request: SavedRequest
}

const api = {
  sendRequest: (config: HttpRequestConfig): Promise<HttpResponse> =>
    ipcRenderer.invoke('send-http-request', config),

  getCollections: (): Promise<Collection[]> =>
    ipcRenderer.invoke('get-collections'),

  saveCollections: (collections: Collection[]): Promise<boolean> =>
    ipcRenderer.invoke('save-collections', collections),

  getEnvironments: (): Promise<Environment[]> =>
    ipcRenderer.invoke('get-environments'),

  saveEnvironments: (environments: Environment[]): Promise<boolean> =>
    ipcRenderer.invoke('save-environments', environments),

  getActiveEnvironment: (): Promise<string | null> =>
    ipcRenderer.invoke('get-active-environment'),

  saveActiveEnvironment: (envId: string | null): Promise<boolean> =>
    ipcRenderer.invoke('save-active-environment', envId),

  getHistory: (): Promise<HistoryEntry[]> =>
    ipcRenderer.invoke('get-history'),

  saveHistory: (history: HistoryEntry[]): Promise<boolean> =>
    ipcRenderer.invoke('save-history', history),

  exportCollection: (collection: Collection): Promise<{ success: boolean; path?: string }> =>
    ipcRenderer.invoke('export-collection', collection),

  importCollection: (): Promise<{ success: boolean; data?: Collection; error?: string }> =>
    ipcRenderer.invoke('import-collection'),
}

contextBridge.exposeInMainWorld('api', api)

declare global {
  interface Window {
    api: typeof api
  }
}
