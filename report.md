# Report

## Local Run Confirmation

Запустил проект локально через Docker MongoDB (`mongo:7` на `27017`) и `npm run dev`: backend ответил на `http://127.0.0.1:5005` строкой `API is running....`, `http://127.0.0.1:5005/api/products` вернул seeded products, frontend ответил на `http://127.0.0.1:3000`.

## Project Overview

MERN eCommerce application with Node.js/Express backend and React frontend.

Main functionality:
- Product catalog
- Authentication (JWT)
- Cart and orders
- Admin features

---

## What Was Missing

Initial repository issues:

- No structured documentation
- No clear architecture overview
- Missing development rules
- No guidance for working with AI
- Hidden runtime dependencies (MongoDB, proxy, env)

---

## What I Did

- Generated initial AGENTS.md using AI
- Refined it manually:
  - added Architecture with real entry points
  - added Git workflow and team conventions
  - added MERN-specific gotchas
  - added deployment quirks
  - added "What NOT to do" section
  - added AI usage rules
- Reduced file size and removed generic content

---

## Rules Diff (IMPORTANT)

Manual improvements over auto-generated version:

- Added unwritten rules (MERN-specific runtime issues)
- Added Git workflow (commit/PR conventions)
- Added AI usage constraints to control generation quality
- Replaced generic descriptions with concrete project details
- Structured architecture with real file paths

---

## How I Used AI

- Used AI to analyze repository structure
- Generated initial AGENTS.md
- Iteratively refined output with targeted prompts
- Used AI for improvement suggestions, not blind generation


## Key Decisions

- Kept AGENTS.md under 200 lines for better usability
- Focused on actionable rules instead of generic documentation
- Prioritized developer experience and onboarding clarity
- Avoided introducing new dependencies or refactoring core logic

---

## Primary IDE

- **IDE**: Antigravity
- **Rules File**: `AGENTS.md` (Main and only rules file used for this project)

## M3

### Stack Chosen

- RAG ingestion/query: Python scripts in `scripts/rag/`
- Vector DB: local Qdrant in Docker
- Embeddings: `BAAI/bge-m3` via `sentence-transformers`
- Feature Flags MCP: project-local stdio MCP server over `backend/features.json`
- Search Docs MCP: project-local stdio MCP server over Qdrant-backed semantic search

### MCP Agent Configuration

- Added project-level MCP config in `.codex/config.toml` for `feature_flags` and `search_docs`.
- Local handshake verification passed:
  - `feature_flags` exposes 4 tools
  - `search_docs` exposes 1 tool: `search_project_docs`
- Codex CLI session startup still timed out while attaching MCP clients, so the logs below were captured via direct local MCP/server validation instead of agent-attached MCP tools.

### Feature Flags MCP Log

Target flag: `search_v2`

1. Checked current state:
   - status: `Testing`
   - traffic: `15`
   - last_modified: `2026-03-10`
2. Set state to `Testing`:
   - status remained `Testing`
   - traffic remained `15`
   - last_modified updated to `2026-05-10`
3. Adjusted rollout to `25`:
   - status: `Testing`
   - traffic: `25`
   - last_modified: `2026-05-10`
4. Confirmed final state:
   - status: `Testing`
   - traffic: `25`

### Search Docs MCP Log

Question 1: Which DB is used and why?

- Top result: `docs/m3-project-data/adrs/adr-001-mongodb-vs-postgres.md` → `Decision`
- Answer: the project uses MongoDB via Mongoose as the primary database. The main reasons were document-model flexibility for product attributes, embedded order item snapshots, and the team’s desire to gain MongoDB experience.

Question 2: Which features depend on `search_v2`?

- Top result: `docs/m3-project-data/feature-flags-spec.md` → ``semantic_search` — Semantic Vector Search`
- Answer: the explicit dependent feature is `semantic_search`. The spec says `search_v2` must be `Enabled` first.

Question 3: What happened during the latest checkout incident?

- Initial semantic search for the exact question retrieved the PayPal payment outage runbook first, so this query needed refinement.
- Refined answer from the incident corpus: during the major checkout/payments incident `i-001`, PayPal sandbox fired `onApprove` twice under certain network conditions. The backend had no idempotency guard on `PUT /api/orders/:id/pay`, so some orders were marked paid twice and a few products had stock decremented twice. No customer was actually charged twice.

### End-to-End `semantic_search` Log

1. Search Docs lookup:
   - semantic search is an embedding-based retrieval feature
   - it depends on `search_v2`
   - docs say `search_v2` must be `Enabled` first
2. Feature Flags lookup:
   - `semantic_search` current status: `Disabled`
   - `semantic_search` traffic: `0`
   - dependency list: `[search_v2]`
   - `search_v2` current status after validation: `Testing`
   - `search_v2` traffic after validation: `25`
3. Combined conclusion:
   - `semantic_search` should not be enabled yet
   - the dependency is not satisfied because `search_v2` is still `Testing`, not `Enabled`

### Reflection

- Chosen stack worked well for a small local RAG setup: Python scripts were quick to iterate on, Qdrant was easy to run in Docker, and BGE-M3 gave relevant results on architecture/feature-flag queries.
- The hardest part was not the servers themselves but Codex CLI MCP startup. Both servers worked locally and passed stdio handshake checks, but the agent session still timed out while attaching them.
- The main improvement would be to move the Search Docs server to a runtime that supports faster cold start and to use a Python version compatible with FastMCP out of the box.

### IDE / Agent Config Used

- **IDE / Agent**: Codex CLI
- **Project MCP Config**: `.codex/config.toml`
