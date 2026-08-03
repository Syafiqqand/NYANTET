# Product Requirements Document (PRD)

> **Project Name:** NYANTET (Nyatet Keuangan Teratur)

## Overview
A lightweight personal finance tracker for personal use. Offline-first and installable as a PWA.

## Goals
- Record income
- Record expenses
- Display current balance
- Show total income and expense
- Filter by date range
- Work offline
- Install on Android

## Out of Scope (V1)
- Login
- Cloud sync
- Budget
- Savings
- Categories
- Multiple wallets
- Notifications

## Features
### Dashboard
- Current Balance
- Total Income
- Total Expense
- Recent Transactions
- Default filter: Current Month
- Custom date range

### Income
Fields:
- Amount
- Source
- Date

Default sources:
- Salary
- Freelance
- Bonus
- THR
- Parents
- Other

### Expense
Fields:
- Amount
- Description
- Date

### History
- Combined transaction list
- Newest first
- Group by date
- Delete transaction
- Edit (future)

### Settings
- Initial Balance

## Formula
Current Balance = Initial Balance + Total Income - Total Expense

## Data Models
Income:
- id
- amount
- source
- date
- createdAt

Expense:
- id
- amount
- description
- date
- createdAt

## Tech
- HTML
- CSS
- JavaScript
- IndexedDB
- PWA

## Success Criteria
- Add transaction <10 seconds
- Offline
- Installable
