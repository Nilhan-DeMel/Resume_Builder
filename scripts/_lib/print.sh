#!/bin/bash
PASS() { echo -e "\033[0;32m✅ PASS: $1\033[0m"; }
FAIL() { echo -e "\033[0;31m❌ FAIL: $1\033[0m"; }
WARN() { echo -e "\033[0;33m⚠️  WARN: $1\033[0m"; }
INFO() { echo -e "\033[0;36mℹ️  INFO: $1\033[0m"; }
