#!/usr/bin/env bash

set -e

INPUT_DIR=$1
DEPS_FILE=$2

CURRENT_DIR=$(pwd)
TSC_COMMAND="npm run --silent tsc -- --project ""$CURRENT_DIR""/""$INPUT_DIR""/tsconfig.json"

SUPASTATE_SQL_SCRIPT=$INPUT_DIR/sql/supastate.sql
SUPASTATE_INPUT_FILES=$($TSC_COMMAND --listFiles --noEmit | sed 's/$/ \\/')

rm -rf "${INPUT_DIR:?}/"lib
echo "$SUPASTATE_SQL_SCRIPT: $SUPASTATE_INPUT_FILES" > "$DEPS_FILE"
$TSC_COMMAND
npm run createState -- -c "$CURRENT_DIR"/"$INPUT_DIR"/supastate.json
