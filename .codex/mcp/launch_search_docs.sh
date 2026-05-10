#!/bin/zsh
set -eu

LOG_DIR="/private/tmp/proshop_mern_mcp_logs"
LOG_FILE="$LOG_DIR/search_docs.log"
mkdir -p "$LOG_DIR"

{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') launch_search_docs ==="
  echo "PWD: $(pwd)"
  echo "ARGS: $*"
} >> "$LOG_FILE"

export HF_HOME="/Users/darik/Work/proshop_mern/.cache/huggingface"
export TRANSFORMERS_CACHE="/Users/darik/Work/proshop_mern/.cache/huggingface/transformers"
export TORCH_HOME="/Users/darik/Work/proshop_mern/.cache/torch"

exec 2>>"$LOG_FILE"
exec /Users/darik/Work/proshop_mern/.venv/bin/python3 /Users/darik/Work/proshop_mern/backend/mcp/searchDocsServer.py
