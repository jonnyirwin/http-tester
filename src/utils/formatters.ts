export function formatJson(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return json
  }
}

export function formatXml(xml: string): string {
  let formatted = ''
  let indent = ''
  const tab = '  '

  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length)
    }
    formatted += indent + '<' + node + '>\n'
    if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith('?')) {
      indent += tab
    }
  })

  return formatted.substring(1, formatted.length - 2)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function isJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function isXml(str: string): boolean {
  return str.trim().startsWith('<') && str.trim().endsWith('>')
}

export function detectContentType(body: string): 'json' | 'xml' | 'text' {
  if (isJson(body)) return 'json'
  if (isXml(body)) return 'xml'
  return 'text'
}
