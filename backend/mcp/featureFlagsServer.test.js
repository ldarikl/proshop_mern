import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

const sendMessage = (child, message) => {
  const body = JSON.stringify(message)
  child.stdin.write(
    `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`
  )
}

const readMessages = (rawOutput) => {
  const messages = []
  let buffer = rawOutput

  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n')

    if (headerEnd === -1) {
      break
    }

    const header = buffer.slice(0, headerEnd)
    const match = header.match(/Content-Length:\s*(\d+)/i)

    if (!match) {
      break
    }

    const contentLength = Number(match[1])
    const messageStart = headerEnd + 4
    const messageEnd = messageStart + contentLength

    if (buffer.length < messageEnd) {
      break
    }

    messages.push(JSON.parse(buffer.slice(messageStart, messageEnd)))
    buffer = buffer.slice(messageEnd)
  }

  return messages
}

test('feature flags MCP server exposes exactly the 3 spec tools', async () => {
  const child = spawn('node', ['backend/mcp/featureFlagsServer.js'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const stdoutChunks = []

  child.stdout.on('data', (chunk) => {
    stdoutChunks.push(chunk.toString())
  })

  sendMessage(child, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'node-test',
        version: '1.0.0'
      }
    }
  })

  sendMessage(child, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  })

  await new Promise((resolve) => setTimeout(resolve, 200))

  child.kill()
  await new Promise((resolve) => child.on('exit', resolve))

  const messages = readMessages(stdoutChunks.join(''))
  const toolsListResponse = messages.find((message) => message.id === 2)

  assert.ok(toolsListResponse, 'Expected a response for tools/list')
  assert.deepEqual(
    toolsListResponse.result.tools.map((tool) => tool.name),
    ['get_feature_info', 'set_feature_state', 'adjust_traffic_rollout']
  )
})
