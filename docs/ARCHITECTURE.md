# Architecture Document

> **Project Name:** NYANTET (Nyatet Keuangan Teratur)

## Architecture
- Client-side only
- Offline-first
- No backend

## Stack
- HTML5
- CSS3
- Vanilla JavaScript
- IndexedDB
- PWA

## Folder Structure

```text
project/
│ index.html
│ manifest.json
│ sw.js
│ README.md
├── css/
├── js/
├── assets/
└── docs/
    ├── PRD.md
    └── ARCHITECTURE.md
```

## Modules
- Dashboard
- Income
- Expense
- History
- Settings
- Database

## Database
IndexedDB stores:
- incomes
- expenses
- settings

## Data Flow

User Action
→ Validation
→ IndexedDB
→ Recalculate Summary
→ Refresh UI

## Principles
- Modular
- Responsive
- Minimal
- Easy to maintain

## Future
- Export CSV
- Export Excel
- Charts
- Search
- Backup
- Flutter migration
