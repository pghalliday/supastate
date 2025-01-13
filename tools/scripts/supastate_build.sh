#!/usr/bin/env bash

set -e
set -E

INPUT_DIR=$1
DEPS_FILE=$2

CURRENT_DIR=$(pwd)
TSC_COMMAND="npx tsc --project ""$CURRENT_DIR""/""$INPUT_DIR""/tsconfig.json"

SUPASTATE_SQL_SCRIPT=$INPUT_DIR/sql/supastate.sql

rm -rf "${INPUT_DIR:?}/"lib
if SUPASTATE_INPUT_FILES=$($TSC_COMMAND --listFiles); then
  echo "$SUPASTATE_SQL_SCRIPT: $(echo "$SUPASTATE_INPUT_FILES" | sed 's/$/ \\/')" > "$DEPS_FILE"
  cd "$INPUT_DIR"/lib
  node index.js
else
  EXIT_CODE=$?
  echo "$SUPASTATE_INPUT_FILES" | grep ": error"
  exit $EXIT_CODE
fi
