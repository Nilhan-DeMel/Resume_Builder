# Environment Guide

## 1. Supported Operating Systems

- **Windows 10/11**: PowerShell (Recommended)
- **Linux/macOS**: Bash

## 2. Runtime Requirements

To run the local development server, you need one of the following:

- **Python 3.x** (Preferred): `python --version`
- **Node.js** (Alternative): `node --version`

## 3. Local Development Rule (CRITICAL)

This application uses **ES Modules**.

- **DO NOT** open `src/index.html` directly via the file system (`file:///...`). Browsers block CORS and Module loading for local files.
- **MUST** be served via an HTTP server.

## 4. Default Ports

- **Application**: `http://localhost:8000`
- If 8000 is authenticated/busy, scripts may fail or need adjustment.

## 5. Internet Connectivity

- Required for CDN dependencies (Supabase, etc.) unless cached or purely local mocks are fully implemented (Stage 2).
