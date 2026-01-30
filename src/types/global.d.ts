import type { Collection, Environment, HistoryEntry, ResponseData, RequestConfig } from './index'

export interface HttpRequestConfig {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timeout?: number
}

interface ElectronAPI {
  sendRequest: (config: HttpRequestConfig) => Promise<ResponseData>
  getCollections: () => Promise<Collection[]>
  saveCollections: (collections: Collection[]) => Promise<boolean>
  getEnvironments: () => Promise<Environment[]>
  saveEnvironments: (environments: Environment[]) => Promise<boolean>
  getActiveEnvironment: () => Promise<string | null>
  saveActiveEnvironment: (envId: string | null) => Promise<boolean>
  getHistory: () => Promise<HistoryEntry[]>
  saveHistory: (history: HistoryEntry[]) => Promise<boolean>
  exportCollection: (collection: Collection) => Promise<{ success: boolean; path?: string }>
  importCollection: () => Promise<{ success: boolean; data?: { name?: string; description?: string; requests?: RequestConfig[] }; error?: string }>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
