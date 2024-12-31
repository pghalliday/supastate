#!/usr/bin/env bash

adjust_path () {
  for test_file; do
    echo "${test_file/../.}"
  done
}

test_files=("$@")
adjusted_test_files=()
while IFS='' read -r line; do
  adjusted_test_files+=("$line")
done < <(adjust_path "${test_files[@]}")
supabase test db "${adjusted_test_files[@]}"
