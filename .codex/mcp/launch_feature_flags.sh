#!/bin/zsh
set -eu

LOG_DIR="/private/tmp/proshop_mern_mcp_logs"
LOG_FILE="$LOG_DIR/feature_flags.log"
mkdir -p "$LOG_DIR"

{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') launch_feature_flags ==="
  echo "PWD: $(pwd)"
  echo "ARGS: $*"
} >> "$LOG_FILE"

exec 2>>"$LOG_FILE"
exec /Users/darik/.nvm/versions/node/v20.5.1/bin/node /Users/darik/Work/proshop_mern/backend/mcp/featureFlagsServer.js
