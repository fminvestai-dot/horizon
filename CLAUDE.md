# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QLM Hansei OS is a personal operating system for high-performers, built with Next.js 16 and React 19. The application implements Japanese lean manufacturing principles (Hoshin Kanri, Hansei reflection, Kaizen) applied to personal productivity and goal management.

## Commands

**Development:**
```bash
npm run dev    # Start development server on http://localhost:3000
npm run build  # Build production bundle
npm start      # Start production server
npm run lint   # Run ESLint
```

## Architecture

### Core Concepts

The application is built around Japanese manufacturing methodologies adapted for personal performance:

- **Hoshin Kanri**: Annual goal planning system organized by quadrants (Business, Vitality, Mindset, Relations)
- **PEI (Performance Effectiveness Index)**: Daily performance metric calculated as Availability × Performance × Quality
- **Takt Timeline**: Time-blocked daily schedule aligned with Hoshin goals
- **Hansei**: Structured reflection system (daily → weekly → monthly → quarterly → yearly)
- **Muda**: Daily waste identification and elimination

### Data Structure Hierarchy

The type system (src/types/hansei.d.ts) defines a hierarchical data model:

```
HanseiData
  └─ YearData (contains hoshinPlan)
      └─ QuarterData
          └─ MonthData
              └─ WeekData (contains weekly Ishikawa/5-Whys analysis)
                  └─ DailyLog (contains taktTimeline, PEI, muda)
```

Key interfaces:
- `Hoshin`: Annual goals with quarterly breakdown
- `DailyLog`: Daily performance tracking with FIRE checklist (Focus, Intention, Review, Execution)
- `PEI`: Performance metrics (0-1 range for each component)
- `TaktBlock`: Time-blocked schedule items
- `WeeklyReview`: Contains PEI trends, Ishikawa fishbone analysis, 5 Whys, and Poka-Yoke improvements
- `Ishikawa`: Fishbone diagram structure with 6Ms (Methods, Machines, Manpower, Materials, Measurements, Environment)

### Project Structure

- **src/app/**: Next.js App Router structure
  - `page.tsx`: Home page rendering DailyCockpit component
  - `layout.tsx`: Root layout with Inter and JetBrains Mono fonts
  - `components/`: React components (currently DailyCockpit)
  - `mock/`: Mock data for development (hoshin.ts)
- **src/types/**: TypeScript type definitions (hansei.d.ts)
- **Styling**: Tailwind CSS with custom zen theme (zen-black, zen-white, zen-gray, zen-accent)

### Path Aliases

TypeScript is configured with `@/*` alias pointing to `src/*`

### Styling System

Custom Tailwind configuration with:
- Zen color palette (zen-black: #121212, zen-white: #F5F5F5, zen-gray: #808080, zen-accent: #00A8E8)
- Hairline borders (0.25px)
- Dot pattern background (5mm grid)
- Font families: Inter (sans) and JetBrains Mono (mono)

## Development Notes

- The app uses React 19 with "use client" directives for interactive components
- Mock data in src/app/mock/ should be replaced with real data persistence layer
- DailyCockpit is the main UI component implementing the daily productivity interface
- PEI calculation: V (Availability) × L (Performance) × Q (Quality) × 100
