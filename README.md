# Resume Builder

> A browser-based CV ingestion, normalization, ATS-oriented editing, and export prototype designed for stateless AI-agent maintenance.

Resume Builder explores a difficult document-engineering problem: accepting PDF, DOCX, pasted, or plain-text CV content; preserving useful structure; converting it into a canonical model; and producing editable, downloadable output. The repository also treats agent handoff as an engineering concern, with operating contracts, task history, forensic reports, rollback guidance, and cross-platform verification scripts.

## Implemented capabilities

- PDF and DOCX text extraction using vendored browser libraries.
- Fidelity-aware reading-order and line-preservation logic.
- Canonical CV parsing with a deterministic heuristic fallback.
- ATS-oriented labeling, prompt construction, optimization adapters, and editor rendering.
- Plain and styled editing modes with HTML sanitization.
- PDF/DOCX download paths, local state, validation, loading, and toast UI modules.
- Demo mode for exercising the interface without provider credentials.
- Supabase/Firebase integration adapters and setup documentation.
- Cross-platform environment, configuration, and HTTP smoke checks.

> [!NOTE]
> External authentication, hosting, and AI services require separate configuration. Demo mode is the default. Production AI calls should be routed through a server-side boundary; provider secrets must never be embedded in browser JavaScript.

## Run locally

```powershell
.\scripts\setup.ps1
.\scripts\run.ps1
.\scripts\test.ps1
```

```bash
./scripts/setup.sh
./scripts/run.sh
./scripts/test.sh
```

The default development URL is <http://localhost:8000>.

## Start here

| Guide | Purpose |
| --- | --- |
| [Engineering overview](ENGINEERING_OVERVIEW.md) | Architecture, interesting decisions, and honest boundaries |
| [Quick start](QUICK_START.md) | Demo and local setup |
| [Architecture](docs/ARCHITECTURE.md) | Major modules and data flow |
| [Agent guide](AGENT_GUIDE.md) | Stateless-maintainer operating contract |
| [Fidelity rules](docs/specs/FIDELITY_RENDERING_RULES_v1.3.md) | Document-preservation specification |
| [API integration](docs/API_INTEGRATION.md) | External-service boundaries |

## Project status

This is a substantial prototype, not a hosted production service. Core browser modules and smoke checks are present; real provider integrations, security review, and end-to-end document fidelity still require environment-specific validation.
