from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
RAG_DIR = ROOT_DIR / 'scripts' / 'rag'
if str(RAG_DIR) not in sys.path:
  sys.path.insert(0, str(RAG_DIR))

from common import DEFAULT_TOP_K, search_docs


TOOLS = [
  {
    'name': 'search_project_docs',
    'description': (
      'Search project docs semantically. Use this first for product docs, '
      'architecture, ADR, runbooks, incidents, glossary, and feature explanations. '
      'Do not use this for current feature flag state; use Feature Flags MCP for that.'
    ),
    'inputSchema': {
      'type': 'object',
      'properties': {
        'query': {'type': 'string'},
        'top_k': {
          'type': 'integer',
          'minimum': 1,
          'maximum': 10,
          'default': DEFAULT_TOP_K
        }
      },
      'required': ['query'],
      'additionalProperties': False
    }
  }
]


def send_message(message: dict) -> None:
  encoded = json.dumps(message).encode('utf-8')
  sys.stdout.buffer.write(
    f'Content-Length: {len(encoded)}\r\n\r\n'.encode('utf-8') + encoded
  )
  sys.stdout.buffer.flush()


def send_response(request_id, result: dict) -> None:
  send_message({
    'jsonrpc': '2.0',
    'id': request_id,
    'result': result
  })


def send_error(request_id, code: int, message: str) -> None:
  send_message({
    'jsonrpc': '2.0',
    'id': request_id,
    'error': {
      'code': code,
      'message': message
    }
  })


def make_tool_result(payload: dict, is_error: bool = False) -> dict:
  return {
    'content': [
      {
        'type': 'text',
        'text': json.dumps(payload, ensure_ascii=False, indent=2)
      }
    ],
    'structuredContent': payload,
    'isError': is_error
  }


def handle_tool_call(request_id, params: dict) -> None:
  tool_name = params.get('name')
  arguments = params.get('arguments', {})

  try:
    if tool_name != 'search_project_docs':
      send_error(request_id, -32601, f"Unknown tool '{tool_name}'.")
      return

    query = arguments.get('query', '').strip()
    top_k = arguments.get('top_k', DEFAULT_TOP_K)

    if not query:
      send_response(
        request_id,
        make_tool_result({'error': 'query must be a non-empty string'}, True)
      )
      return

    if not isinstance(top_k, int) or top_k < 1 or top_k > 10:
      send_response(
        request_id,
        make_tool_result({'error': 'top_k must be an integer between 1 and 10'}, True)
      )
      return

    matches = search_docs(query=query, top_k=top_k)
    send_response(
      request_id,
      make_tool_result({
        'query': query,
        'top_k': top_k,
        'matches': matches
      })
    )
  except Exception as error:
    send_response(
      request_id,
      make_tool_result({'error': str(error)}, True)
    )


def handle_request(message: dict) -> None:
  request_id = message.get('id')
  method = message.get('method')
  params = message.get('params', {})

  if method == 'initialize':
    send_response(request_id, {
      'protocolVersion': '2024-11-05',
      'capabilities': {
        'tools': {}
      },
      'serverInfo': {
        'name': 'search-docs-mcp',
        'version': '1.0.0'
      }
    })
    return

  if method == 'notifications/initialized':
    return

  if method == 'tools/list':
    send_response(request_id, {'tools': TOOLS})
    return

  if method == 'tools/call':
    handle_tool_call(request_id, params)
    return

  send_error(request_id, -32601, f"Method '{method}' is not supported.")


def main() -> None:
  buffer = ''
  while True:
    chunk = sys.stdin.read(1)
    if chunk == '':
      break

    buffer += chunk

    while True:
      header_end = buffer.find('\r\n\r\n')
      if header_end == -1:
        break

      header = buffer[:header_end]
      content_length = None
      for line in header.split('\r\n'):
        if line.lower().startswith('content-length:'):
          content_length = int(line.split(':', 1)[1].strip())
          break

      if content_length is None:
        buffer = ''
        break

      message_start = header_end + 4
      message_end = message_start + content_length
      if len(buffer) < message_end:
        break

      raw_message = buffer[message_start:message_end]
      buffer = buffer[message_end:]

      try:
        handle_request(json.loads(raw_message))
      except json.JSONDecodeError:
        send_error(None, -32700, 'Invalid JSON received by Search Docs MCP server.')


if __name__ == '__main__':
  main()
