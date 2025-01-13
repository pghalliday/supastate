#!/usr/bin/env bash

set -e

INPUT_DIR=$1
DEPS_FILE=$2

rm -rf "${INPUT_DIR:?}/"lib
INPUT_FILES=$(npx tsc --project "$INPUT_DIR"/tsconfig.json --listFiles)
EXIT_CODE=$?
echo "$INPUT_FILES" | grep "^[^/]" || true
if [ "$EXIT_CODE" -eq "0" ]; then
  node "$INPUT_DIR"/lib/index.js "$INPUT_DIR" "$DEPS_FILE" "$(echo "$INPUT_FILES" | grep "^/" || true)"
else
  exit $EXIT_CODE
fi
