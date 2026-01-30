interface CookiesViewerProps {
  cookies: string
}

interface ParsedCookie {
  name: string
  value: string
  attributes: Record<string, string>
}

function parseCookies(cookieString: string): ParsedCookie[] {
  if (!cookieString) return []

  return cookieString.split(',').map((cookie) => {
    const parts = cookie.trim().split(';').map((p) => p.trim())
    const [nameValue, ...attrs] = parts
    const [name, value] = nameValue.split('=')

    const attributes: Record<string, string> = {}
    attrs.forEach((attr) => {
      const [key, val] = attr.split('=')
      attributes[key.toLowerCase()] = val || 'true'
    })

    return { name: name || '', value: value || '', attributes }
  })
}

export function CookiesViewer({ cookies }: CookiesViewerProps) {
  const parsedCookies = parseCookies(cookies)

  if (parsedCookies.length === 0) {
    return (
      <div className="p-4 text-app-text-muted text-sm">
        No cookies in response
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {parsedCookies.map((cookie, index) => (
        <div key={index} className="bg-app-bg border border-app-border rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-app-accent">{cookie.name}</span>
            <span className="text-app-text-muted">=</span>
            <span className="text-sm break-all">{cookie.value}</span>
          </div>
          {Object.keys(cookie.attributes).length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(cookie.attributes).map(([key, val]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-app-panel rounded text-app-text-muted"
                >
                  {key}
                  {val !== 'true' && `=${val}`}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
