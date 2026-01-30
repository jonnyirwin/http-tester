interface ResponseHeadersProps {
  headers: Record<string, string>
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const entries = Object.entries(headers)

  if (entries.length === 0) {
    return (
      <div className="p-4 text-app-text-muted text-sm">
        No headers in response
      </div>
    )
  }

  return (
    <div className="p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-app-text-muted border-b border-app-border">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, value]) => (
            <tr key={name} className="border-b border-app-border/50">
              <td className="py-2 pr-4 text-app-accent font-medium whitespace-nowrap">
                {name}
              </td>
              <td className="py-2 break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
