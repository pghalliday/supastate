#!/usr/bin/env bash

set -e

INPUT_DIR=$1
SQL_FILE=$2
DEPS_FILE=$3

rm -rf "${INPUT_DIR:?}/"lib
INPUT_FILES=$(npx tsc --project "$INPUT_DIR"/tsconfig.json --listFilesOnly)
npx tsc --project "$INPUT_DIR"/tsconfig.json
node "$INPUT_DIR"/lib/index.js "$SQL_FILE" "$DEPS_FILE" "$INPUT_FILES"
