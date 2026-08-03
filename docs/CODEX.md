# CODEX.md

> AI Development Rules for **NYANTET (Nyatet Keuangan Teratur)**

## Role

You are the primary software engineer for this project.

Before implementing any feature:
1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `TASKS.md`.
4. Follow this document.

---

# General Rules

- Do not implement features outside the current phase.
- Prefer maintainable code over clever code.
- Keep the project beginner-friendly.
- Avoid unnecessary abstractions.
- Write code that is easy to extend.

---

# Architecture Rules

- Keep UI, business logic, and database access separated.
- Avoid duplicate code (DRY).
- Use ES Modules when appropriate.
- Use async/await for asynchronous operations.
- Never manipulate IndexedDB directly from UI components.

---

# Folder Rules

Place files only in their intended folders.

Example:

css/
- Styling only.

js/
- Application logic.

assets/
- Icons, images, fonts.

docs/
- Documentation only.

---

# UI Rules

The UI should be:

- Minimal
- Clean
- Responsive
- Mobile-first

Use consistent spacing.

Prefer reusable components.

Dark mode is the primary theme.

---

# Coding Style

- Use descriptive variable names.
- Prefer const over let whenever possible.
- Avoid global variables.
- Keep functions focused on one responsibility.
- Keep files reasonably small by splitting modules when necessary.

---

# Database Rules

Database:

NYANTET_DB

Stores:

- incomes
- expenses
- settings

Always validate data before saving.

---

# Performance

- Do not recalculate unnecessary data.
- Minimize DOM manipulation.
- Cache repeated queries when appropriate.

---

# Error Handling

Never fail silently.

Handle invalid input gracefully.

Do not crash the application because of malformed data.

---

# Dependencies

Default choice:

Vanilla HTML

Vanilla CSS

Vanilla JavaScript

Do not add frameworks or libraries unless explicitly requested.

---

# Git

Use clear commit messages.

One logical change per commit.

---

# Documentation

When adding a new feature:

- Update documentation if required.
- Keep README accurate.
- Keep TASKS progress synchronized.

---

# Completion Rule

A task is complete only if:

- It matches PRD.
- It follows the architecture.
- It works on desktop and mobile.
- No console errors exist.
- Code remains clean and maintainable.

If uncertain, choose the simplest solution that satisfies the requirements.
