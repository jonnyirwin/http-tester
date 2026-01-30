import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { Environment } from '../types'

interface EnvironmentState {
  environments: Environment[]
  activeEnvironmentId: string | null
  isLoaded: boolean
  loadEnvironments: () => Promise<void>
  saveEnvironments: () => Promise<void>
  createEnvironment: (name: string) => void
  updateEnvironment: (id: string, updates: Partial<Environment>) => void
  deleteEnvironment: (id: string) => void
  setActiveEnvironment: (id: string | null) => void
  addVariable: (envId: string) => void
  updateVariable: (envId: string, index: number, key: string, value: string) => void
  removeVariable: (envId: string, index: number) => void
  getActiveVariables: () => Record<string, string>
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  environments: [],
  activeEnvironmentId: null,
  isLoaded: false,

  loadEnvironments: async () => {
    const [environments, activeId] = await Promise.all([
      window.api.getEnvironments(),
      window.api.getActiveEnvironment(),
    ])
    set({
      environments: environments || [],
      activeEnvironmentId: activeId,
      isLoaded: true,
    })
  },

  saveEnvironments: async () => {
    await window.api.saveEnvironments(get().environments)
  },

  createEnvironment: (name) => {
    const newEnv: Environment = {
      id: uuid(),
      name,
      variables: [{ key: '', value: '' }],
    }
    set((state) => ({ environments: [...state.environments, newEnv] }))
    get().saveEnvironments()
  },

  updateEnvironment: (id, updates) => {
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }))
    get().saveEnvironments()
  },

  deleteEnvironment: (id) => {
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
      activeEnvironmentId: state.activeEnvironmentId === id ? null : state.activeEnvironmentId,
    }))
    get().saveEnvironments()
    if (get().activeEnvironmentId === null) {
      window.api.saveActiveEnvironment(null)
    }
  },

  setActiveEnvironment: (id) => {
    set({ activeEnvironmentId: id })
    window.api.saveActiveEnvironment(id)
  },

  addVariable: (envId) => {
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === envId
          ? { ...e, variables: [...e.variables, { key: '', value: '' }] }
          : e
      ),
    }))
    get().saveEnvironments()
  },

  updateVariable: (envId, index, key, value) => {
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === envId
          ? {
              ...e,
              variables: e.variables.map((v, i) =>
                i === index ? { key, value } : v
              ),
            }
          : e
      ),
    }))
    get().saveEnvironments()
  },

  removeVariable: (envId, index) => {
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === envId
          ? { ...e, variables: e.variables.filter((_, i) => i !== index) }
          : e
      ),
    }))
    get().saveEnvironments()
  },

  getActiveVariables: () => {
    const { environments, activeEnvironmentId } = get()
    const activeEnv = environments.find((e) => e.id === activeEnvironmentId)
    if (!activeEnv) return {}
    return activeEnv.variables.reduce((acc, { key, value }) => {
      if (key) acc[key] = value
      return acc
    }, {} as Record<string, string>)
  },
}))
