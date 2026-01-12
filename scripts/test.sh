#!/bin/bash
# Master Test Script
# Runs: Environment -> Config -> Smoke

set -e

echo "=== Resumer_Builder Test Suite ==="

./scripts/validate-environment.sh
./scripts/validate-config.sh
node scripts/smoke-test.js

echo "=== ALL TESTS PASSED ==="
