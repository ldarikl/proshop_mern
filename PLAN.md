# M3 Homework Action Plan

**Source:** https://raw.githubusercontent.com/Serg1kk/aidev-course-materials/main/M3/assignment/homework-spec.md

## Summary

Complete the required M3 homework for `proshop_mern`: Feature Flags MCP, RAG over project docs, Search Docs MCP, both MCP servers connected to the agent, and logs in `report.md`.

## 1. Prepare Project Data

- [x] Download `features.json` from the course materials.
- [x] Put it into the backend, recommended path: `backend/features.json`.
- [x] Download the project documentation corpus from `M3/project-data/`.
- [x] Keep source docs or processed chunks in the repo so they are visible for review.

## 2. Feature Flags Runtime API

- [x] Add backend endpoint `GET /api/feature-flags`.
- [x] The endpoint must read the actual `backend/features.json` file on each request.
- [ ] Optional: add `GET /api/feature-flags/:name` for one feature.
- [x] Verify the endpoint returns all feature flags locally.

## 3. Admin Dashboard Features Page

- [x] Add a React admin-only page: `Dashboard Features`.
- [x] Show a table with `name`, `status`, `traffic_percentage`, `last_modified`, `depends_on`.
- [x] Add the page to the admin navigation.
- [x] Fetch data only through `GET /api/feature-flags`, not by reading the JSON file directly.

## 4. Feature Flags MCP Server

- [x] Create an MCP server for `backend/features.json`.
- [x] Implement `list_features()`.
- [x] Implement `get_feature_info(feature_name)`.
- [x] Implement `set_feature_state(feature_name, state)`.
- [x] Implement `adjust_traffic_rollout(feature_name, percentage)`.
- [x] Enforce validation: a feature cannot be set to `Enabled` if any dependency is `Disabled`.
- [x] Enforce validation: traffic above `0` is not allowed when feature status is `Disabled`.
- [x] Update `last_modified` after mutations.

## 5. RAG Pipeline

- [x] Automate RAG ingestion and querying with Python scripts instead of manual chunking.
- [ ] Use Python FastMCP for MCP servers.
- [x] Use local Qdrant in Docker as the vector DB.
- [x] Use BGE-M3 via `sentence-transformers` for embeddings.
- [x] Ingest markdown documentation from the course materials.
- [x] Split docs into chunks with metadata: `source_file`, `file_path`, `type`, `title`, `parent_headings`.
- [x] Save chunks to `docs/rag/chunks.jsonl`.
- [x] Add ingestion script: `scripts/rag/ingest.py`.
- [x] Add query script: `scripts/rag/query.py`.
- [x] Make `ingest.py` read markdown docs, generate chunks, create embeddings, write `chunks.jsonl`, and upload vectors to Qdrant.
- [x] Make `query.py` accept a question, search Qdrant, and print top-K chunks with scores and metadata.
- [ ] Run the 3 required homework queries and save top-K results for the report.

## 6. Search Docs MCP Server

- [x] Create MCP tool `search_project_docs(query, top_k=5)`.
- [x] Return chunks with `source_file`, `file_path`, `title`, `parent_headings`, `score`, `snippet`.
- [x] Tool description must say to use it first for product docs, architecture, ADR, runbooks, incidents, glossary, and feature explanations.
- [x] Tool description must say not to use it for current feature flag state; use Feature Flags MCP for that.

## 7. MCP Agent Configuration

- [x] Add both MCP servers to project-level Codex config: `.codex/config.toml`.
- [ ] Confirm both servers are visible to the agent.
- [x] Confirm Feature Flags MCP shows 4 tools.
- [x] Confirm Search Docs MCP shows 1 tool.

Current status:
- `feature_flags` is already connected in `.codex/config.toml`
- `feature_flags` handshake was verified locally and the MCP exposes 4 tools
- `search_docs` is now connected in `.codex/config.toml`

## 8. Agent Rules

- [ ] Update `AGENTS.md`.
- [ ] Add rule: for product questions, use `search_project_docs` first.
- [ ] Add rule: fallback to grep/read only if vector search is not enough.
- [ ] Add rule: for feature flag status or mutations, use Feature Flags MCP tools.
- [ ] Add rule: never edit `backend/features.json` manually when the user asks to change flags.

## 9. Report

- [ ] Update `report.md` with section `## M3`.
- [ ] Add Feature Flags MCP log for `search_v2`: check status, set `Testing`, set traffic `25%`, confirm final state.
- [ ] Add Search Docs MCP log for question 1: Which DB is used and why?
- [ ] Add Search Docs MCP log for question 2: Which features depend on `search_v2`?
- [ ] Add Search Docs MCP log for question 3: What happened during the latest checkout incident?
- [ ] Add end-to-end log for `semantic_search` using both MCP servers.
- [ ] Add reflection: chosen stack, what was difficult, what could be improved.
- [ ] Mention which IDE/agent config was used.

## 10. Final Verification

- [ ] Verify `GET /api/feature-flags` returns the feature list.
- [ ] Verify the admin page renders the feature table.
- [ ] Verify Feature Flags MCP mutates `backend/features.json`.
- [ ] Verify Search Docs MCP returns relevant chunks.
- [ ] Verify the end-to-end scenario uses both MCP servers.
- [x] Run `npm run build --prefix frontend`.

## Optional Part 4

- [ ] Add hybrid search: BM25 + vector search + RRF.
- [ ] Add reranker.
- [ ] Compare baseline RAG, hybrid search, and hybrid + reranker.
- [ ] Add comparison table and short reflection to `report.md`.

## Assumptions

- Main IDE/agent config for submission is Codex CLI, so MCP config goes in `.codex/config.toml`.
- Optional Part 4, Hybrid Search + Reranker, is not included in the required plan and can be done only if time allows.
