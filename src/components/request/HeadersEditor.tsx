import { useRequestStore } from '../../stores/requestStore'
import { KeyValueEditor } from '../common/KeyValueEditor'

export function HeadersEditor() {
  const { request, addHeader, updateHeader, removeHeader } = useRequestStore()

  return (
    <div className="p-4">
      <KeyValueEditor
        pairs={request.headers}
        onAdd={addHeader}
        onUpdate={updateHeader}
        onRemove={removeHeader}
        keyPlaceholder="Header name"
        valuePlaceholder="Header value"
      />
    </div>
  )
}
