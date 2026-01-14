# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server on port 3000
npm run build     # Production build with Vite
npm run preview   # Preview production build
```

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` (currently unused but configured in Vite).

## Architecture

This is a React + TypeScript + Vite application for Dr. Javier Barrios' plastic surgery practice. It serves as a lead capture landing page with an integrated CRM.

### Application Flow

The app has three views controlled by simple state-based routing in `App.tsx`:
1. **LinktreeView** (`/`) - Social links hub and entry point
2. **LandingPage** - VSL-style marketing page with consultation form modal
3. **CRM** (`/crm`) - Password-protected lead management dashboard

### Data Layer

- **Google Sheets as Backend**: All lead data is stored in Google Sheets via Google Apps Script
- **API Service** (`services/sheetApi.ts`): Handles CRUD operations using `no-cors` mode for POST requests (due to Google Scripts limitations)
- **Lead Classification**: Automatic hot/warm/cold status based on budget range

### Key Files

- `config.ts` - Google Script URL and CRM password
- `types.ts` - TypeScript interfaces for Lead/LeadData, plus constants for procedures, budgets, and sources
- `components/ConsultationForm.tsx` - Multi-step form for lead capture
- `components/LegalModals.tsx` - Privacy policy and terms modals

### Styling

Uses Tailwind CSS with custom brand colors defined as CSS variables:
- `brand-dark` - Dark background
- `brand-gold`, `brand-goldLight`, `brand-goldDark` - Gold accent colors

Custom CSS classes like `marble-texture`, `animate-shimmer`, and `reveal-on-scroll` are used for visual effects.

### Path Alias

`@` is aliased to project root in `vite.config.ts`.
