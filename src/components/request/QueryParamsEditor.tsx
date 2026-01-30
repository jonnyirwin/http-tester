import { useRequestStore } from '../../stores/requestStore'
import { KeyValueEditor } from '../common/KeyValueEditor'

export function QueryParamsEditor() {
  const { request, addQueryParam, updateQueryParam, removeQueryParam } = useRequestStore()

  return (
    <div className="p-4">
      <KeyValueEditor
        pairs={request.queryParams}
        onAdd={addQueryParam}
        onUpdate={updateQueryParam}
        onRemove={removeQueryParam}
        keyPlaceholder="Parameter name"
        valuePlaceholder="Parameter value"
      />
    </div>
  )
}
