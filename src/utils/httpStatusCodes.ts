export const HTTP_STATUS_CODES: Record<number, { text: string; description: string }> = {
  // 1xx Informational
  100: { text: 'Continue', description: 'The server has received the request headers, and the client should proceed to send the request body.' },
  101: { text: 'Switching Protocols', description: 'The server is switching protocols as requested by the client.' },
  102: { text: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.' },
  103: { text: 'Early Hints', description: 'Used to return some response headers before final HTTP message.' },

  // 2xx Success
  200: { text: 'OK', description: 'The request was successful.' },
  201: { text: 'Created', description: 'The request has been fulfilled and a new resource has been created.' },
  202: { text: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.' },
  203: { text: 'Non-Authoritative Information', description: 'The returned information is from a cached copy, not the original server.' },
  204: { text: 'No Content', description: 'The server successfully processed the request but is not returning any content.' },
  205: { text: 'Reset Content', description: 'The server successfully processed the request and is asking the client to reset the document view.' },
  206: { text: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.' },
  207: { text: 'Multi-Status', description: 'The message body contains multiple status codes for multiple independent operations.' },
  208: { text: 'Already Reported', description: 'The members of a DAV binding have already been enumerated in a previous reply.' },
  226: { text: 'IM Used', description: 'The server has fulfilled a GET request for the resource with instance-manipulations applied.' },

  // 3xx Redirection
  300: { text: 'Multiple Choices', description: 'There are multiple options for the resource that the client may follow.' },
  301: { text: 'Moved Permanently', description: 'The resource has been moved permanently to a new URL.' },
  302: { text: 'Found', description: 'The resource has been found at a different URL temporarily.' },
  303: { text: 'See Other', description: 'The response to the request can be found under a different URL.' },
  304: { text: 'Not Modified', description: 'The resource has not been modified since the last request.' },
  305: { text: 'Use Proxy', description: 'The requested resource must be accessed through the proxy given in the Location header.' },
  307: { text: 'Temporary Redirect', description: 'The resource has been temporarily moved to another URL.' },
  308: { text: 'Permanent Redirect', description: 'The resource has been permanently moved to another URL.' },

  // 4xx Client Error
  400: { text: 'Bad Request', description: 'The server cannot process the request due to a client error.' },
  401: { text: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.' },
  402: { text: 'Payment Required', description: 'Reserved for future use. Originally intended for digital payment systems.' },
  403: { text: 'Forbidden', description: 'The server understood the request but refuses to authorize it.' },
  404: { text: 'Not Found', description: 'The requested resource could not be found on the server.' },
  405: { text: 'Method Not Allowed', description: 'The request method is not supported for the requested resource.' },
  406: { text: 'Not Acceptable', description: 'The requested resource cannot generate content acceptable according to the Accept headers.' },
  407: { text: 'Proxy Authentication Required', description: 'Authentication with the proxy is required.' },
  408: { text: 'Request Timeout', description: 'The server timed out waiting for the request.' },
  409: { text: 'Conflict', description: 'The request could not be completed due to a conflict with the current state of the resource.' },
  410: { text: 'Gone', description: 'The requested resource is no longer available and will not be available again.' },
  411: { text: 'Length Required', description: 'The request did not specify the length of its content.' },
  412: { text: 'Precondition Failed', description: 'The server does not meet one of the preconditions specified in the request.' },
  413: { text: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process.' },
  414: { text: 'URI Too Long', description: 'The URI provided was too long for the server to process.' },
  415: { text: 'Unsupported Media Type', description: 'The media format of the requested data is not supported by the server.' },
  416: { text: 'Range Not Satisfiable', description: 'The range specified in the Range header cannot be fulfilled.' },
  417: { text: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request-header field.' },
  418: { text: "I'm a teapot", description: 'The server refuses to brew coffee because it is a teapot. (RFC 2324)' },
  421: { text: 'Misdirected Request', description: 'The request was directed at a server that is not able to produce a response.' },
  422: { text: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  423: { text: 'Locked', description: 'The resource that is being accessed is locked.' },
  424: { text: 'Failed Dependency', description: 'The request failed due to failure of a previous request.' },
  425: { text: 'Too Early', description: 'The server is unwilling to risk processing a request that might be replayed.' },
  426: { text: 'Upgrade Required', description: 'The client should switch to a different protocol.' },
  428: { text: 'Precondition Required', description: 'The origin server requires the request to be conditional.' },
  429: { text: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.' },
  431: { text: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because its header fields are too large.' },
  451: { text: 'Unavailable For Legal Reasons', description: 'The resource is unavailable for legal reasons.' },

  // 5xx Server Error
  500: { text: 'Internal Server Error', description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.' },
  501: { text: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.' },
  502: { text: 'Bad Gateway', description: 'The server received an invalid response from an upstream server.' },
  503: { text: 'Service Unavailable', description: 'The server is currently unavailable (overloaded or down).' },
  504: { text: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server.' },
  505: { text: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request.' },
  506: { text: 'Variant Also Negotiates', description: 'The server has an internal configuration error.' },
  507: { text: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.' },
  508: { text: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.' },
  510: { text: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it.' },
  511: { text: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.' },
}

export function getStatusInfo(status: number): { text: string; description: string } {
  return HTTP_STATUS_CODES[status] || { text: 'Unknown', description: 'Unknown status code' }
}

export function getStatusColorClass(status: number): string {
  if (status >= 100 && status < 200) return 'text-blue-400'
  if (status >= 200 && status < 300) return 'text-status-success'
  if (status >= 300 && status < 400) return 'text-status-redirect'
  if (status >= 400 && status < 500) return 'text-status-client-error'
  if (status >= 500) return 'text-status-server-error'
  return 'text-app-text-muted'
}

export function getStatusBgClass(status: number): string {
  if (status >= 100 && status < 200) return 'bg-blue-400/20'
  if (status >= 200 && status < 300) return 'bg-status-success/20'
  if (status >= 300 && status < 400) return 'bg-status-redirect/20'
  if (status >= 400 && status < 500) return 'bg-status-client-error/20'
  if (status >= 500) return 'bg-status-server-error/20'
  return 'bg-app-panel'
}
