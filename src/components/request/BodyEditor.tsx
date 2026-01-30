import { useRequestStore } from '../../stores/requestStore'
import { CodeEditor } from '../common/CodeEditor'
import { BODY_TYPES, type BodyType } from '../../types'
import { formatJson } from '../../utils/formatters'

export function BodyEditor() {
  const { request, setBody, setBodyType } = useRequestStore()

  const handleFormat = () => {
    if (request.bodyType === 'json') {
      setBody(formatJson(request.body))
    }
  }

  const getLanguage = (): 'json' | 'xml' | 'text' => {
    switch (request.bodyType) {
      case 'json':
        return 'json'
      case 'xml':
        return 'xml'
      default:
        return 'text'
    }
  }

  if (request.bodyType === 'none') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          {BODY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="bodyType"
                value={type.value}
                checked={request.bodyType === type.value}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
                className="text-app-accent focus:ring-app-accent"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
        <p className="text-app-text-muted text-sm">
          This request does not have a body
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {BODY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="bodyType"
                value={type.value}
                checked={request.bodyType === type.value}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
                className="text-app-accent focus:ring-app-accent"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
        {request.bodyType === 'json' && (
          <button
            onClick={handleFormat}
            className="text-sm text-app-accent hover:text-app-accent-hover transition-colors"
          >
            Format JSON
          </button>
        )}
      </div>
      <CodeEditor
        value={request.body}
        onChange={setBody}
        language={getLanguage()}
        placeholder={`Enter ${request.bodyType.toUpperCase()} body...`}
        minHeight="250px"
      />
    </div>
  )
}
