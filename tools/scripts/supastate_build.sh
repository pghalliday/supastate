#!/usr/bin/env bash

set -e

INPUT_DIR=$1
DEPS_FILE=$2

rm -rf "${INPUT_DIR:?}/"lib
INPUT_FILES=$(npx tsc --project "$INPUT_DIR"/tsconfig.json --listFilesOnly)
npx tsc --project "$INPUT_DIR"/tsconfig.json
node "$INPUT_DIR"/lib/index.js "$INPUT_DIR" "$DEPS_FILE" "$INPUT_FILES"
