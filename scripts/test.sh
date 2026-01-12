#!/bin/bash
# Master Test Script
# Runs: Environment -> Config -> Smoke
#!/bin/bash
set -euo pipefail

echo "=== Resume_Builder Test Suite ==="

# 1. Environment
bash ./scripts/validate-environment.sh

# 2. Config
bash ./scripts/validate-config.sh

# 3. Smoke Test (Node)
node scripts/smoke-test.js

echo "=== ALL TESTS PASSED ==="
