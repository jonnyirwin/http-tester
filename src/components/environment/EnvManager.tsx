import { useState } from 'react'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { Modal } from '../common/Modal'

interface EnvManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function EnvManager({ isOpen, onClose }: EnvManagerProps) {
  const {
    environments,
    activeEnvironmentId,
    createEnvironment,
    deleteEnvironment,
    setActiveEnvironment,
    addVariable,
    updateVariable,
    removeVariable,
    updateEnvironment,
  } = useEnvironmentStore()

  const [newEnvName, setNewEnvName] = useState('')
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null)

  const handleCreate = () => {
    if (newEnvName.trim()) {
      createEnvironment(newEnvName.trim())
      setNewEnvName('')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Environments">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newEnvName}
            onChange={(e) => setNewEnvName(e.target.value)}
            placeholder="New environment name"
            className="flex-1 px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate} className="btn btn-primary">
            Add
          </button>
        </div>

        {environments.length === 0 ? (
          <p className="text-app-text-muted text-sm text-center py-4">
            No environments yet. Create one to get started.
          </p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {environments.map((env) => (
              <div
                key={env.id}
                className={`border rounded p-3 ${
                  activeEnvironmentId === env.id
                    ? 'border-app-accent bg-app-accent/10'
                    : 'border-app-border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="activeEnv"
                      checked={activeEnvironmentId === env.id}
                      onChange={() => setActiveEnvironment(env.id)}
                      className="text-app-accent"
                    />
                    {editingEnvId === env.id ? (
                      <input
                        type="text"
                        value={env.name}
                        onChange={(e) => updateEnvironment(env.id, { name: e.target.value })}
                        onBlur={() => setEditingEnvId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingEnvId(null)}
                        className="px-2 py-1 bg-app-bg border border-app-border rounded text-sm"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="font-medium cursor-pointer hover:text-app-accent"
                        onClick={() => setEditingEnvId(env.id)}
                      >
                        {env.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this environment?')) {
                        deleteEnvironment(env.id)
                      }
                    }}
                    className="text-app-text-muted hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  {env.variables.map((variable, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={variable.key}
                        onChange={(e) => updateVariable(env.id, index, e.target.value, variable.value)}
                        placeholder="Variable name"
                        className="flex-1 px-2 py-1 bg-app-bg border border-app-border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => updateVariable(env.id, index, variable.key, e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-2 py-1 bg-app-bg border border-app-border rounded text-sm"
                      />
                      <button
                        onClick={() => removeVariable(env.id, index)}
                        className="p-1 text-app-text-muted hover:text-red-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addVariable(env.id)}
                    className="text-sm text-app-accent hover:text-app-accent-hover"
                  >
                    + Add variable
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
