#!/usr/bin/env bash

set -e

DEPS_FILE=$1
shift
INPUT_FILES=("$@")

echo "" > "$DEPS_FILE"

for input_file in "${INPUT_FILES[@]}"; do
  echo "$input_file: ${input_file/main\.sql/supastate/sql/supastate.sql}" >> "$DEPS_FILE"
done
