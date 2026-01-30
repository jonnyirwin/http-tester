export function resolveVariables(text: string, variables: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match
  })
}

export function findVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g)
  if (!matches) return []
  return [...new Set(matches.map((m) => m.slice(2, -2)))]
}

export function highlightVariables(text: string): string {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    '<span class="text-orange-400 font-semibold">{{$1}}</span>'
  )
}
