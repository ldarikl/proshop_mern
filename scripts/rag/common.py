from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


ROOT_DIR = Path(__file__).resolve().parents[2]
DOCS_SOURCE_DIR = ROOT_DIR / 'docs' / 'm3-project-data'
CHUNKS_OUTPUT_PATH = ROOT_DIR / 'docs' / 'rag' / 'chunks.jsonl'
DEFAULT_COLLECTION = os.getenv('QDRANT_COLLECTION', 'project_docs')
DEFAULT_QDRANT_URL = os.getenv('QDRANT_URL', 'http://127.0.0.1:6333')
DEFAULT_EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'BAAI/bge-m3')
DEFAULT_TOP_K = 5
HEADING_RE = re.compile(r'^(#{1,6})\s+(.*\S)\s*$')
_MODEL = None
_CLIENT = None


@dataclass
class Section:
  heading: str
  parent_headings: list[str]
  content_lines: list[str]


def slugify(value: str) -> str:
  normalized = re.sub(r'[^a-zA-Z0-9]+', '-', value.strip().lower())
  return normalized.strip('-') or 'section'


def detect_doc_type(file_path: Path) -> str:
  parts = file_path.relative_to(DOCS_SOURCE_DIR).parts
  if len(parts) > 1:
    return parts[0]
  return 'root'


def read_markdown_files(source_dir: Path = DOCS_SOURCE_DIR) -> list[Path]:
  return sorted(path for path in source_dir.rglob('*.md') if path.is_file())


def extract_document_title(lines: list[str], file_path: Path) -> str:
  for line in lines:
    match = HEADING_RE.match(line)
    if match:
      return match.group(2).strip()

  return file_path.stem.replace('-', ' ').replace('_', ' ').strip() or file_path.name


def split_into_sections(lines: list[str], document_title: str) -> list[Section]:
  sections: list[Section] = []
  heading_stack: list[tuple[int, str]] = []
  current = Section(heading=document_title, parent_headings=[], content_lines=[])

  for line in lines:
    match = HEADING_RE.match(line)
    if not match:
      current.content_lines.append(line)
      continue

    if current.content_lines and ''.join(current.content_lines).strip():
      sections.append(current)

    level = len(match.group(1))
    heading_text = match.group(2).strip()

    while heading_stack and heading_stack[-1][0] >= level:
      heading_stack.pop()

    parent_headings = [heading for _, heading in heading_stack]
    heading_stack.append((level, heading_text))
    current = Section(
      heading=heading_text,
      parent_headings=parent_headings,
      content_lines=[]
    )

  if current.content_lines and ''.join(current.content_lines).strip():
    sections.append(current)

  return sections


def normalize_paragraphs(content_lines: Iterable[str]) -> list[str]:
  content = '\n'.join(content_lines)
  raw_paragraphs = re.split(r'\n\s*\n', content)
  paragraphs = []

  for paragraph in raw_paragraphs:
    normalized = '\n'.join(line.rstrip() for line in paragraph.splitlines()).strip()
    if normalized:
      paragraphs.append(normalized)

  return paragraphs


def chunk_paragraphs(
  paragraphs: list[str],
  max_chars: int = 1200,
  min_chars: int = 300
) -> list[str]:
  chunks: list[str] = []
  current_parts: list[str] = []
  current_length = 0

  for paragraph in paragraphs:
    paragraph_length = len(paragraph)

    if paragraph_length >= max_chars:
      if current_parts:
        chunks.append('\n\n'.join(current_parts))
        current_parts = []
        current_length = 0

      start = 0
      while start < paragraph_length:
        end = min(start + max_chars, paragraph_length)
        chunks.append(paragraph[start:end].strip())
        start = end
      continue

    projected = current_length + paragraph_length + (2 if current_parts else 0)
    if current_parts and projected > max_chars:
      chunks.append('\n\n'.join(current_parts))
      current_parts = [paragraph]
      current_length = paragraph_length
      continue

    current_parts.append(paragraph)
    current_length = projected

  if current_parts:
    remaining_text = '\n\n'.join(current_parts)
    if chunks and len('\n\n'.join(current_parts)) < min_chars:
      chunks[-1] = f'{chunks[-1]}\n\n{remaining_text}'
    else:
      chunks.append(remaining_text)

  return [chunk for chunk in chunks if chunk.strip()]


def build_chunks(source_dir: Path = DOCS_SOURCE_DIR) -> list[dict]:
  documents: list[dict] = []

  for file_path in read_markdown_files(source_dir):
    lines = file_path.read_text(encoding='utf-8').splitlines()
    document_title = extract_document_title(lines, file_path)
    sections = split_into_sections(lines, document_title)

    for section_index, section in enumerate(sections):
      paragraphs = normalize_paragraphs(section.content_lines)
      text_chunks = chunk_paragraphs(paragraphs)

      for chunk_index, chunk_text in enumerate(text_chunks):
        heading_slug = slugify(section.heading)
        relative_path = file_path.relative_to(ROOT_DIR)
        documents.append({
          'id': f"{relative_path.as_posix()}::{heading_slug}::{section_index}-{chunk_index}",
          'text': chunk_text,
          'source_file': file_path.name,
          'file_path': relative_path.as_posix(),
          'type': detect_doc_type(file_path),
          'title': section.heading,
          'parent_headings': section.parent_headings
        })

  return documents


def ensure_output_dir(output_path: Path = CHUNKS_OUTPUT_PATH) -> None:
  output_path.parent.mkdir(parents=True, exist_ok=True)


def write_chunks_jsonl(chunks: list[dict], output_path: Path = CHUNKS_OUTPUT_PATH) -> None:
  ensure_output_dir(output_path)
  with output_path.open('w', encoding='utf-8') as file_obj:
    for chunk in chunks:
      file_obj.write(json.dumps(chunk, ensure_ascii=False) + '\n')


def get_embedding_model(model_name: str = DEFAULT_EMBEDDING_MODEL):
  global _MODEL

  if _MODEL is None:
    from sentence_transformers import SentenceTransformer

    _MODEL = SentenceTransformer(model_name)

  return _MODEL


def get_qdrant_client(qdrant_url: str = DEFAULT_QDRANT_URL):
  global _CLIENT

  if _CLIENT is None:
    from qdrant_client import QdrantClient

    _CLIENT = QdrantClient(url=qdrant_url)

  return _CLIENT


def make_snippet(text: str, limit: int = 400) -> str:
  normalized = re.sub(r'\s+', ' ', text).strip()
  return normalized[:limit]


def search_docs(
  query: str,
  top_k: int = DEFAULT_TOP_K,
  collection: str = DEFAULT_COLLECTION,
  qdrant_url: str = DEFAULT_QDRANT_URL,
  embedding_model: str = DEFAULT_EMBEDDING_MODEL
) -> list[dict]:
  model = get_embedding_model(embedding_model)
  query_vector = model.encode(query, normalize_embeddings=True).tolist()

  client = get_qdrant_client(qdrant_url)
  results = client.search(
    collection_name=collection,
    query_vector=query_vector,
    limit=top_k
  )

  records = []
  for index, result in enumerate(results, start=1):
    payload = dict(result.payload or {})
    text = payload.pop('text', '')
    records.append({
      'rank': index,
      'score': result.score,
      'source_file': payload.get('source_file'),
      'file_path': payload.get('file_path'),
      'title': payload.get('title'),
      'parent_headings': payload.get('parent_headings', []),
      'snippet': make_snippet(text)
    })

  return records
