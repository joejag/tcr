#!/usr/bin/env bash
set -euo pipefail

rm -rf /tmp/playground || true
mkdir /tmp/playground
cp test/example_file.rb /tmp/playground
cd /tmp/playground
git init
git add .
git commit -m 'Initial Commit'
cd -
