from __future__ import annotations

import argparse
from pathlib import Path

from common import (
  CHUNKS_OUTPUT_PATH,
  DEFAULT_COLLECTION,
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_QDRANT_URL,
  DOCS_SOURCE_DIR,
  build_chunks,
  write_chunks_jsonl
)


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(
    description='Chunk markdown project docs, save JSONL, and upload embeddings to Qdrant.'
  )
  parser.add_argument(
    '--source-dir',
    type=Path,
    default=DOCS_SOURCE_DIR,
    help='Directory with markdown documentation.'
  )
  parser.add_argument(
    '--output',
    type=Path,
    default=CHUNKS_OUTPUT_PATH,
    help='Path to chunks JSONL output.'
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
  chunks = build_chunks(args.source_dir)
  write_chunks_jsonl(chunks, args.output)

  if not chunks:
    print('No markdown chunks found.')
    return

  from qdrant_client import QdrantClient
  from qdrant_client.models import Distance, PointStruct, VectorParams
  from sentence_transformers import SentenceTransformer

  print(f'Generated {len(chunks)} chunks -> {args.output}')
  print(f'Loading embedding model: {args.embedding_model}')
  model = SentenceTransformer(args.embedding_model)

  texts = [chunk['text'] for chunk in chunks]
  embeddings = model.encode(
    texts,
    batch_size=16,
    normalize_embeddings=True,
    show_progress_bar=True
  )

  vector_size = len(embeddings[0])
  client = QdrantClient(url=args.qdrant_url)
  client.recreate_collection(
    collection_name=args.collection,
    vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
  )

  points = []
  for index, (chunk, vector) in enumerate(zip(chunks, embeddings)):
    payload = {key: value for key, value in chunk.items() if key != 'text'}
    payload['text'] = chunk['text']
    points.append(
      PointStruct(
        id=index,
        vector=vector.tolist(),
        payload=payload
      )
    )

  client.upsert(collection_name=args.collection, points=points)
  print(
    f'Uploaded {len(points)} vectors to {args.collection} at {args.qdrant_url}'
  )


if __name__ == '__main__':
  main()
