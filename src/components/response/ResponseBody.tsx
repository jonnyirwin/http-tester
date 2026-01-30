import { useState } from 'react'
import { CodeEditor } from '../common/CodeEditor'
import { formatJson, formatXml, detectContentType } from '../../utils/formatters'

interface ResponseBodyProps {
  body: string
}

export function ResponseBody({ body }: ResponseBodyProps) {
  const [isFormatted, setIsFormatted] = useState(true)
  const contentType = detectContentType(body)

  const displayBody = isFormatted
    ? contentType === 'json'
      ? formatJson(body)
      : contentType === 'xml'
        ? formatXml(body)
        : body
    : body

  const language = contentType === 'json' ? 'json' : contentType === 'xml' ? 'xml' : 'text'

  if (!body) {
    return (
      <div className="p-4 text-app-text-muted text-sm">
        No body in response
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-app-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormatted(true)}
            className={`px-3 py-1 text-sm rounded ${
              isFormatted
                ? 'bg-app-accent text-white'
                : 'text-app-text-muted hover:text-app-text'
            }`}
          >
            Pretty
          </button>
          <button
            onClick={() => setIsFormatted(false)}
            className={`px-3 py-1 text-sm rounded ${
              !isFormatted
                ? 'bg-app-accent text-white'
                : 'text-app-text-muted hover:text-app-text'
            }`}
          >
            Raw
          </button>
        </div>
        <span className="text-xs text-app-text-muted uppercase">{contentType}</span>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={displayBody}
          onChange={() => {}}
          language={language}
          readOnly
          minHeight="100%"
        />
      </div>
    </div>
  )
}
