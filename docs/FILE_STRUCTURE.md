# File Structure Plan

## Directory Layout

```
Resume_Builder/
├── src/
│   ├── index.html              # Entry point (imports only, no logic)
│   ├── styles/
│   │   ├── main.css           # Global styles, CSS variables
│   │   ├── auth.css           # Authentication UI styles
│   │   ├── upload.css         # Upload interface styles
│   │   ├── editor.css         # Text editor styles
│   │   ├── output.css         # Output/download styles
│   │   └── components/        # Component-specific styles
│   │       ├── button.css
│   │       ├── card.css
│   │       ├── modal.css
│   │       └── toast.css
│   ├── js/
│   │   ├── main.js            # App initialization
│   │   ├── config/
│   │   │   ├── supabase.js    # Supabase client config
│   │   │   ├── firebase.js    # Firebase config
│   │   │   └── api.js         # API endpoints & keys (placeholder)
│   │   ├── auth/
│   │   │   ├── login.js       # Login logic
│   │   │   ├── register.js    # Registration logic
│   │   │   ├── logout.js      # Logout logic
│   │   │   └── session.js     # Session management
│   │   ├── upload/
│   │   │   ├── fileHandler.js      # File upload handler
│   │   │   ├── dragDrop.js         # Drag & drop functionality
│   │   │   ├── pasteHandler.js     # Paste functionality
│   │   │   ├── pdfParser.js        # PDF text extraction
│   │   │   ├── imageOCR.js         # Image OCR handling
│   │   │   └── textExtractor.js    # Generic text extraction
│   │   ├── editor/
│   │   │   ├── textEditor.js       # Rich text editor init
│   │   │   ├── validation.js       # CV content validation
│   │   │   └── autoSave.js         # Auto-save functionality
│   │   ├── ai/
│   │   │   ├── apiClient.js        # Claude API client
│   │   │   ├── promptBuilder.js    # Build AI prompts
│   │   │   ├── optimizer.js        # CV optimization logic
│   │   │   └── atsValidator.js     # ATS compatibility checker
│   │   ├── output/
│   │   │   ├── pdfGenerator.js     # Generate PDF
│   │   │   ├── docxGenerator.js    # Generate Word doc
│   │   │   ├── atsFormatter.js     # ATS-specific formatting
│   │   │   └── downloader.js       # Handle downloads
│   │   ├── state/
│   │   │   ├── appState.js         # Global state management
│   │   │   ├── userState.js        # User session state
│   │   │   └── cvState.js          # CV data state
│   │   ├── ui/
│   │   │   ├── router.js           # View routing
│   │   │   ├── toast.js            # Toast notifications
│   │   │   ├── modal.js            # Modal dialogs
│   │   │   ├── loader.js           # Loading indicators
│   │   │   └── progressBar.js      # Progress tracking
│   │   ├── utils/
│   │   │   ├── validators.js       # Input validation utilities
│   │   │   ├── formatters.js       # Text formatting utilities
│   │   │   ├── constants.js        # App constants
│   │   │   └── helpers.js          # Generic helper functions
│   │   └── views/
│   │       ├── authView.js         # Authentication view
│   │       ├── uploadView.js       # Upload view
│   │       ├── editorView.js       # Editor view
│   │       ├── processingView.js   # AI processing view
│   │       └── outputView.js       # Output/download view
│   ├── assets/
│   │   ├── icons/             # SVG icons
│   │   └── images/            # Images
│   └── data/
│       ├── jobLevels.json     # Job level definitions
│       └── atsRules.json      # ATS compliance rules
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FILE_STRUCTURE.md
│   ├── API_INTEGRATION.md     # How to integrate AI API
│   ├── SUPABASE_SETUP.md      # Supabase configuration
│   └── FIREBASE_SETUP.md      # Firebase configuration
```

## File Documentation Standards

Every file must include:

- File purpose comment at top
- Function/export documentation
- Parameter descriptions
- Return value descriptions
- Example usage where helpful
