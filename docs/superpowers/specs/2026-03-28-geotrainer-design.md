# GeoTrainer — Design Spec

A GeoGuessr training web app built as a spaced-repetition flashcard game. Multiple choice questions across high-ROI meta categories help players systematically improve their country identification skills.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (static, hobby tier)
- **Data:** Static JSON files in the repo, imported at build time
- **State:** All user progress in `localStorage` — no backend, no accounts
- **Visual style:** Dark/gaming aesthetic — dark backgrounds, cyan (#00e5ff) accent, neon highlights

## Screens

### Home (Category Select)

- Grid of 6 category cards with checkboxes
- Each card shows: category name, total card count, cards due today
- "Start Practice" button — disabled until at least 1 category is selected
- Last category selection remembered in localStorage

### Quiz (Flashcard Review)

- Pulls due cards from selected categories, ordered most-overdue first
- Card displays: reference image, question text, hint text, 4 multiple choice options
- On answer: highlights correct/wrong choice, shows explanation text, "Next Card" button
- No manual difficulty rating — SM-2 runs automatically (correct = "Good", wrong = "Again")
- Header: progress counter (card X of Y due), category badge, streak counter
- Empty state when no cards due: "You're all caught up!" with next review time

### Stats (Progress Dashboard)

- Top row of 3 stats: total cards reviewed, overall accuracy %, current day streak
- Per-category mastery bars (% of cards with interval > 21 days)

## Categories (6 total, ~15-20 cards each)

### Bollards
Country-specific bollard styles. France (red top, white bands), Netherlands (red/white striped), Japan (flexible delineators), UK (black/white), South Korea, Italy, etc.

### Language & Script
Script and diacritic identification. Cyrillic variants (Russian vs Ukrainian vs Serbian), Southeast Asian scripts (Thai vs Khmer vs Lao), Latin diacritics (Turkish, Romanian, Polish, Czech, etc.).

### Road Lines & Markings
Line color and style patterns. Yellow center = Americas, white center = Europe/Asia, no lines = Africa/rural Asia, edge line styles and road surface textures.

### License Plates
Plate shape, color, and format. EU blue strip, UK/NL yellow rear plates, US state plates, Middle East bilingual, Japan kei-car yellow plates, etc.

### Google Coverage Meta
Camera generation (Gen 2/3/4 visual differences), coverage car colors (Kenya, Nigeria, Ghana, Senegal), antenna types, sky rift line patterns.

### Driving Side
Left-hand traffic identification with visual cues. UK, Japan, Australia, India, Thailand, Indonesia, and other left-driving countries.

## Card Data Model

```json
{
  "id": "bollard-france-01",
  "category": "bollards",
  "question": "Which country uses this bollard style?",
  "hint": "Note the red top with white reflective bands",
  "image": "/images/bollards/france-01.webp",
  "correctAnswer": "France",
  "wrongAnswers": ["Germany", "Belgium", "Switzerland"],
  "explanation": "French bollards typically have a red top section with white reflective bands. Found throughout mainland France and overseas territories."
}
```

Cards stored as static JSON files per category in `src/data/`. Images stored in `public/images/` organized by category.

## SM-2 Spaced Repetition (Simplified)

### Per-card progress (stored in localStorage)

```json
{
  "bollard-france-01": {
    "easeFactor": 2.5,
    "interval": 1,
    "repetitions": 0,
    "nextReview": "2026-03-28",
    "lastResult": null
  }
}
```

### Algorithm

- **New cards:** interval = 1 day, ease factor = 2.5
- **Correct answer:** repetitions++, interval grows (1d -> 6d -> interval * easeFactor), ease factor stays or nudges up (+0.1, max 2.5)
- **Wrong answer:** repetitions reset to 0, interval resets to 1 day, ease factor decreases by 0.2 (min 1.3)
- **Due cards:** any card where `nextReview <= today`
- **Queue order:** most overdue first within selected categories
- **New card cap:** max 5 new cards per day per category, shown after due reviews are cleared

The user never interacts with the scheduling directly. Correct/wrong drives everything automatically.

## Project File Structure

```
geotrainer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, dark theme, fonts
│   │   ├── page.tsx            # Home — category select
│   │   ├── quiz/page.tsx       # Quiz — flashcard review
│   │   └── stats/page.tsx      # Stats — progress dashboard
│   ├── components/
│   │   ├── CategoryCard.tsx    # Selectable category checkbox card
│   │   ├── FlashCard.tsx       # Question + image + choices
│   │   ├── FeedbackPanel.tsx   # Correct/wrong explanation
│   │   └── ProgressBar.tsx     # Reusable mastery bar
│   ├── data/
│   │   ├── bollards.json
│   │   ├── language.json
│   │   ├── road-lines.json
│   │   ├── license-plates.json
│   │   ├── coverage-meta.json
│   │   └── driving-side.json
│   ├── lib/
│   │   ├── sm2.ts              # SM-2 algorithm logic
│   │   ├── scheduler.ts        # Queue builder — due cards, new card cap
│   │   └── storage.ts          # localStorage read/write helpers
│   └── hooks/
│       └── useProgress.ts      # React hook wrapping storage + SM-2
├── public/
│   └── images/                 # Card reference images by category
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Key Design Decisions

1. **No backend / local storage only** — Keeps deployment free and simple. Cross-device sync can be added later with optional auth.
2. **Automatic SM-2 rating** — User just answers correct/wrong. No manual "Again/Hard/Good/Easy" buttons. Reduces friction, still effective.
3. **Curated static dataset** — Quality over quantity. ~90-120 cards total across 6 categories. Spaced repetition makes a small deck effective.
4. **5 new cards per session cap** — Prevents overwhelming new users while ensuring steady progression.
5. **Dark gaming aesthetic** — Matches GeoGuessr's competitive vibe. Cyan accent, dark backgrounds, neon highlights.
