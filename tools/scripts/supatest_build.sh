#!/usr/bin/env bash

set -e

INPUT_DIR=$1
DEPS_FILE=$2
OUTPUT_FILES=$3

rm -rf "${INPUT_DIR:?}/"lib
INPUT_FILES=$(npx tsc --project "$INPUT_DIR"/tsconfig.json --listFilesOnly)
# Output the deps file first to ensure it has an earlier filetime than the output files
echo "$OUTPUT_FILES : $(echo "$INPUT_FILES" | sed 's/$/ \\/')" > "$DEPS_FILE"
# Do a full build to ensure that the filetimes on the output files
# are updated (an incremental build may not change the known output files)
npx tsc --project "$INPUT_DIR"/tsconfig.json
