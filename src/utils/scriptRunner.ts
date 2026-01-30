import type { RequestConfig } from '../types'

interface ScriptContext {
  environment: {
    get: (key: string) => string | undefined
    set: (key: string, value: string) => void
  }
  request: {
    method: string
    url: string
    headers: Record<string, string>
    body: string | undefined
  }
  variables: Record<string, string>
}

export interface ScriptResult {
  success: boolean
  error?: string
  updatedVariables: Record<string, string>
}

export function runPreRequestScript(
  script: string,
  request: RequestConfig,
  variables: Record<string, string>
): ScriptResult {
  if (!script.trim()) {
    return { success: true, updatedVariables: variables }
  }

  const updatedVariables = { ...variables }

  const context: ScriptContext = {
    environment: {
      get: (key: string) => updatedVariables[key],
      set: (key: string, value: string) => {
        updatedVariables[key] = value
      },
    },
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers.reduce((acc, h) => {
        if (h.enabled && h.key) acc[h.key] = h.value
        return acc
      }, {} as Record<string, string>),
      body: request.body || undefined,
    },
    variables: updatedVariables,
  }

  try {
    const wrappedScript = `
      const pm = {
        environment: {
          get: context.environment.get,
          set: context.environment.set,
        },
        request: context.request,
        variables: context.variables,
      };
      ${script}
    `

    const fn = new Function('context', wrappedScript)
    fn(context)

    return { success: true, updatedVariables }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      updatedVariables: variables,
    }
  }
}
