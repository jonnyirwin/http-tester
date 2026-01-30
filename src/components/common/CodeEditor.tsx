import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from '@codemirror/theme-one-dark'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'json' | 'javascript' | 'xml' | 'text'
  readOnly?: boolean
  placeholder?: string
  minHeight?: string
}

const languageExtensions = {
  json: [json()],
  javascript: [javascript()],
  xml: [xml()],
  text: [],
}

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder,
  minHeight = '200px',
}: CodeEditorProps) {
  return (
    <div className="border border-app-border rounded overflow-hidden" style={{ minHeight }}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={languageExtensions[language]}
        theme={oneDark}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
        style={{ height: '100%', minHeight }}
      />
    </div>
  )
}
