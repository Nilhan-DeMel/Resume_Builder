# Resume_Builder Architecture

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Hosting**: Firebase Hosting
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage
- **AI Integration**: Anthropic Claude API (via proxy/backend)

## Application Flow

1. User Authentication (Supabase)
2. CV Upload (PDF/Word/Image/Text/Drag-drop/Paste)
3. Job Level Selection (Junior Executive, Senior Manager, C-Suite)
4. Job Description Upload (PDF/Image/Text/Drag-drop/Paste)
5. CV Text Editor (Pre-AI, user edits original)
6. AI Processing (Send to Claude API with optimization parameters)
7. Output Generation (ATS-optimized Word + PDF)
8. Edit Tracking (10 free edits, then $1/edit)
9. Download/Re-edit Loop

## Micro-Modular File Structure Philosophy

- One function per file where logical
- Imports centralized in index.html
- No business logic in index.html
- Clear directory structure for agent navigation
- Full inline documentation
