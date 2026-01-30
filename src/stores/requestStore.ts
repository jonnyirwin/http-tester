import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { RequestConfig, HttpMethod, BodyType, KeyValuePair, AuthConfig } from '../types'

interface RequestState {
  request: RequestConfig
  isLoading: boolean
  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setBody: (body: string) => void
  setBodyType: (bodyType: BodyType) => void
  setHeaders: (headers: KeyValuePair[]) => void
  addHeader: () => void
  updateHeader: (id: string, field: keyof KeyValuePair, value: string | boolean) => void
  removeHeader: (id: string) => void
  setQueryParams: (params: KeyValuePair[]) => void
  addQueryParam: () => void
  updateQueryParam: (id: string, field: keyof KeyValuePair, value: string | boolean) => void
  removeQueryParam: (id: string) => void
  setAuth: (auth: AuthConfig) => void
  setPreRequestScript: (script: string) => void
  setName: (name: string) => void
  setDescription: (description: string) => void
  setIsLoading: (loading: boolean) => void
  loadRequest: (request: RequestConfig) => void
  resetRequest: () => void
}

const createEmptyRequest = (): RequestConfig => ({
  id: uuid(),
  name: 'New Request',
  description: '',
  method: 'GET',
  url: '',
  headers: [{ id: uuid(), key: '', value: '', enabled: true }],
  queryParams: [{ id: uuid(), key: '', value: '', enabled: true }],
  body: '',
  bodyType: 'none',
  auth: { type: 'none' },
  preRequestScript: '',
})

export const useRequestStore = create<RequestState>((set) => ({
  request: createEmptyRequest(),
  isLoading: false,

  setMethod: (method) =>
    set((state) => ({ request: { ...state.request, method } })),

  setUrl: (url) =>
    set((state) => ({ request: { ...state.request, url } })),

  setBody: (body) =>
    set((state) => ({ request: { ...state.request, body } })),

  setBodyType: (bodyType) =>
    set((state) => ({ request: { ...state.request, bodyType } })),

  setHeaders: (headers) =>
    set((state) => ({ request: { ...state.request, headers } })),

  addHeader: () =>
    set((state) => ({
      request: {
        ...state.request,
        headers: [...state.request.headers, { id: uuid(), key: '', value: '', enabled: true }],
      },
    })),

  updateHeader: (id, field, value) =>
    set((state) => ({
      request: {
        ...state.request,
        headers: state.request.headers.map((h) =>
          h.id === id ? { ...h, [field]: value } : h
        ),
      },
    })),

  removeHeader: (id) =>
    set((state) => ({
      request: {
        ...state.request,
        headers: state.request.headers.filter((h) => h.id !== id),
      },
    })),

  setQueryParams: (queryParams) =>
    set((state) => ({ request: { ...state.request, queryParams } })),

  addQueryParam: () =>
    set((state) => ({
      request: {
        ...state.request,
        queryParams: [...state.request.queryParams, { id: uuid(), key: '', value: '', enabled: true }],
      },
    })),

  updateQueryParam: (id, field, value) =>
    set((state) => ({
      request: {
        ...state.request,
        queryParams: state.request.queryParams.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      },
    })),

  removeQueryParam: (id) =>
    set((state) => ({
      request: {
        ...state.request,
        queryParams: state.request.queryParams.filter((p) => p.id !== id),
      },
    })),

  setAuth: (auth) =>
    set((state) => ({ request: { ...state.request, auth } })),

  setPreRequestScript: (preRequestScript) =>
    set((state) => ({ request: { ...state.request, preRequestScript } })),

  setName: (name) =>
    set((state) => ({ request: { ...state.request, name } })),

  setDescription: (description) =>
    set((state) => ({ request: { ...state.request, description } })),

  setIsLoading: (isLoading) => set({ isLoading }),

  loadRequest: (request) => set({ request: { ...request, id: request.id || uuid() } }),

  resetRequest: () => set({ request: createEmptyRequest() }),
}))
