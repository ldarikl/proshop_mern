from __future__ import annotations

import argparse
import json

from common import (
  DEFAULT_COLLECTION,
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_QDRANT_URL,
  DEFAULT_TOP_K,
  search_docs
)


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(
    description='Search project docs in Qdrant and print top matching chunks.'
  )
  parser.add_argument('question', help='Natural language question to search for.')
  parser.add_argument(
    '--top-k',
    type=int,
    default=DEFAULT_TOP_K,
    help='Number of chunks to return.'
  )
  parser.add_argument(
    '--collection',
    default=DEFAULT_COLLECTION,
    help='Qdrant collection name.'
  )
  parser.add_argument(
    '--qdrant-url',
    default=DEFAULT_QDRANT_URL,
    help='Qdrant HTTP URL.'
  )
  parser.add_argument(
    '--embedding-model',
    default=DEFAULT_EMBEDDING_MODEL,
    help='SentenceTransformers model name.'
  )
  return parser.parse_args()


def main() -> None:
  args = parse_args()
  print(f'Loading embedding model: {args.embedding_model}')
  results = search_docs(
    query=args.question,
    top_k=args.top_k,
    collection=args.collection,
    qdrant_url=args.qdrant_url,
    embedding_model=args.embedding_model
  )

  if not results:
    print('No results found.')
    return

  for result in results:
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
  main()
