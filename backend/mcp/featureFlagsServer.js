import process from 'process'
import {
  adjustTrafficRollout,
  getFeatureInfo,
  setFeatureState,
  toErrorResponse
} from '../utils/featureFlags.js'

const tools = [
  {
    name: 'get_feature_info',
    description: 'Get the complete current state of a single feature flag by feature_id.',
    inputSchema: {
      type: 'object',
      properties: {
        feature_id: { type: 'string' }
      },
      required: ['feature_id'],
      additionalProperties: false
    }
  },
  {
    name: 'set_feature_state',
    description: "Set a feature flag state to Disabled, Testing, or Enabled. Updates last_modified and keeps traffic/state rules consistent.",
    inputSchema: {
      type: 'object',
      properties: {
        feature_id: { type: 'string' },
        state: {
          type: 'string',
          enum: ['Disabled', 'Testing', 'Enabled']
        }
      },
      required: ['feature_id', 'state'],
      additionalProperties: false
    }
  },
  {
    name: 'adjust_traffic_rollout',
    description: "Adjust traffic_percentage for a feature in Testing state. Use 0-100 integers only.",
    inputSchema: {
      type: 'object',
      properties: {
        feature_id: { type: 'string' },
        percentage: { type: 'integer' }
      },
      required: ['feature_id', 'percentage'],
      additionalProperties: false
    }
  }
]

const sendMessage = (message) => {
  const json = JSON.stringify(message)
  process.stdout.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`)
}

const sendResponse = (id, result) => {
  sendMessage({
    jsonrpc: '2.0',
    id,
    result
  })
}

const sendError = (id, code, message, data) => {
  sendMessage({
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data ? { data } : {})
    }
  })
}

const makeToolResult = (payload, isError = false) => ({
  content: [
    {
      type: 'text',
      text: JSON.stringify(payload, null, 2)
    }
  ],
  structuredContent: payload,
  isError
})

const handleToolCall = async (id, params) => {
  const toolName = params?.name
  const args = params?.arguments || {}

  try {
    if (toolName === 'get_feature_info') {
      const result = await getFeatureInfo(args.feature_id)
      return sendResponse(id, makeToolResult(result))
    }

    if (toolName === 'set_feature_state') {
      const result = await setFeatureState(args.feature_id, args.state)
      return sendResponse(id, makeToolResult(result))
    }

    if (toolName === 'adjust_traffic_rollout') {
      const result = await adjustTrafficRollout(args.feature_id, args.percentage)
      return sendResponse(id, makeToolResult(result))
    }

    return sendError(id, -32601, `Unknown tool '${toolName}'.`)
  } catch (error) {
    return sendResponse(
      id,
      makeToolResult(toErrorResponse(error, args.feature_id), true)
    )
  }
}

const handleRequest = async (message) => {
  const { id, method, params } = message

  if (method === 'initialize') {
    return sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'feature-flags-mcp',
        version: '1.0.0'
      }
    })
  }

  if (method === 'notifications/initialized') {
    return
  }

  if (method === 'tools/list') {
    return sendResponse(id, { tools })
  }

  if (method === 'tools/call') {
    return handleToolCall(id, params)
  }

  return sendError(id, -32601, `Method '${method}' is not supported.`)
}

let buffer = ''

const consumeBuffer = async () => {
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n')

    if (headerEnd === -1) {
      return
    }

    const header = buffer.slice(0, headerEnd)
    const match = header.match(/Content-Length:\s*(\d+)/i)

    if (!match) {
      buffer = ''
      return
    }

    const contentLength = Number(match[1])
    const messageStart = headerEnd + 4
    const messageEnd = messageStart + contentLength

    if (buffer.length < messageEnd) {
      return
    }

    const rawMessage = buffer.slice(messageStart, messageEnd)
    buffer = buffer.slice(messageEnd)

    try {
      const message = JSON.parse(rawMessage)
      await handleRequest(message)
    } catch (error) {
      sendError(null, -32700, 'Invalid JSON received by Feature Flags MCP server.')
    }
  }
}

process.stdin.setEncoding('utf8')
process.stdin.on('data', async (chunk) => {
  buffer += chunk
  await consumeBuffer()
})
