import { getStatusInfo, getStatusColorClass, getStatusBgClass } from '../../utils/httpStatusCodes'
import { formatBytes, formatDuration } from '../../utils/formatters'
import type { ResponseData } from '../../types'

interface StatusBarProps {
  response: ResponseData
}

export function StatusBar({ response }: StatusBarProps) {
  if (!response.success) {
    return (
      <div className="flex items-center gap-4 p-3 bg-red-500/20 border-b border-app-border">
        <span className="text-red-400 font-semibold">Error</span>
        <span className="text-red-300 text-sm">{response.error}</span>
        <span className="text-app-text-muted text-sm ml-auto">
          {formatDuration(response.duration)}
        </span>
      </div>
    )
  }

  const status = response.status || 0
  const statusInfo = getStatusInfo(status)
  const colorClass = getStatusColorClass(status)
  const bgClass = getStatusBgClass(status)

  return (
    <div className={`flex items-center gap-4 p-3 border-b border-app-border ${bgClass}`}>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${colorClass}`}>{status}</span>
        <span className={`text-sm ${colorClass}`}>{statusInfo.text}</span>
      </div>
      <span className="text-app-text-muted text-sm" title={statusInfo.description}>
        {statusInfo.description.length > 60
          ? statusInfo.description.substring(0, 60) + '...'
          : statusInfo.description}
      </span>
      <div className="flex items-center gap-4 ml-auto text-sm text-app-text-muted">
        <span>{formatDuration(response.duration)}</span>
        {response.size !== undefined && <span>{formatBytes(response.size)}</span>}
      </div>
    </div>
  )
}
