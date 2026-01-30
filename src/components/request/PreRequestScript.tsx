import { useRequestStore } from '../../stores/requestStore'
import { CodeEditor } from '../common/CodeEditor'

export function PreRequestScript() {
  const { request, setPreRequestScript } = useRequestStore()

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="text-sm text-app-text-muted mb-2">
          Write JavaScript that executes before the request is sent. Available APIs:
        </p>
        <ul className="text-sm text-app-text-muted list-disc list-inside space-y-1">
          <li><code className="text-orange-400">pm.environment.get(key)</code> - Get environment variable</li>
          <li><code className="text-orange-400">pm.environment.set(key, value)</code> - Set environment variable</li>
          <li><code className="text-orange-400">pm.request</code> - Access the current request object</li>
        </ul>
      </div>
      <CodeEditor
        value={request.preRequestScript}
        onChange={setPreRequestScript}
        language="javascript"
        placeholder="// Pre-request script\n// Example: pm.environment.set('timestamp', Date.now().toString())"
        minHeight="200px"
      />
    </div>
  )
}
