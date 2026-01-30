import type { KeyValuePair } from '../../types'

interface KeyValueEditorProps {
  pairs: KeyValuePair[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof KeyValuePair, value: string | boolean) => void
  onRemove: (id: string) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export function KeyValueEditor({
  pairs,
  onAdd,
  onUpdate,
  onRemove,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueEditorProps) {
  return (
    <div className="space-y-2">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={(e) => onUpdate(pair.id, 'enabled', e.target.checked)}
            className="w-4 h-4 rounded border-app-border bg-app-bg text-app-accent focus:ring-app-accent"
          />
          <input
            type="text"
            value={pair.key}
            onChange={(e) => onUpdate(pair.id, 'key', e.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1 px-2 py-1.5 bg-app-bg border border-app-border rounded text-sm"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => onUpdate(pair.id, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1 px-2 py-1.5 bg-app-bg border border-app-border rounded text-sm"
          />
          <button
            onClick={() => onRemove(pair.id)}
            className="p-1.5 text-app-text-muted hover:text-red-400 transition-colors"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm text-app-accent hover:text-app-accent-hover transition-colors"
      >
        + Add new
      </button>
    </div>
  )
}
