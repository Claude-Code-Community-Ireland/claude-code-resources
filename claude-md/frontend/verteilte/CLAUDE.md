# Verteilte - German Vocabulary Learning App

A spaced repetition flashcard app for learning German vocabulary, built with Tauri 2, Vue 3, and TypeScript.

---

## 📁 Project Structure

```
verteilte/
├── src/                          # Frontend (Vue 3 + TypeScript)
│   ├── App.vue                   # Main app (1077 lines) - all UI logic
│   ├── lib/
│   │   ├── database.ts           # User vocabulary database (SQLite)
│   │   ├── dictionary.ts         # German-English dictionary (200k+ words)
│   │   └── utils.ts              # Utility functions
│   ├── components/ui/            # Shadcn-vue UI components
│   └── main.ts                   # App entry point
├── src-tauri/                    # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs                # Dictionary decompression + migrations
│   │   └── main.rs               # App entry
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
├── public/
│   └── dictionary.db.gz          # Compressed dictionary (52MB → 150MB)
├── scripts/
│   └── build-dictionary-db.cjs   # Dictionary builder script
└── package.json                  # npm dependencies
```

---

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Styling
- **Shadcn-vue** - UI components (Button, Card, Input)
- **Lucide Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Tauri 2** - Rust-based desktop framework
- **Rust** - Native performance
- **SQLite** - Two databases:
  1. `words.db` - User's vocabulary cards
  2. `dictionary.db` - German-English dictionary (200k+ entries)

### Key Dependencies
```json
{
  "@tauri-apps/plugin-sql": "SQLite plugin",
  "@tauri-apps/plugin-clipboard-manager": "Clipboard access",
  "pako": "gzip compression (dictionary)",
  "flate2": "Rust gzip decompression"
}
```

---

## 🎯 Core Features

### 1. **Spaced Repetition System**
- **Algorithm**: SM-2 inspired exponential intervals
- **Scoring**:
  - `Bad`: -2 score, 10 min interval
  - `Good`: +1 score, exponential growth
  - `Great`: +2 score, 2x exponential growth
- **Auto-rating**:
  - ✅ Correct spelling → Auto "Great"
  - ❌ Wrong spelling → Show answer, manual "Next" (auto "Bad")

### 2. **Dictionary Integration**
- **200,000+ German words** with English translations
- **Source**: German-English dictionary database
- **Compressed**: 52MB gzipped → 150MB SQLite
- **Features**:
  - German → English autocomplete (prefix matching)
  - English → German fuzzy search (Levenshtein distance)
  - Phrase-based matching (splits by comma)
  - Returns 10 best suggestions

### 3. **Card Interface**
- **Front**: Shows translation, user types German word
- **Letter-by-letter input**: One input box per character
- **Auto-check**: Validates when complete
- **Flip animation**: CSS 3D transform
- **Score display**: Top-left corner
- **Last reviewed**: Top-right corner
- **Responsive text**: Scales down if word is long

### 4. **Keyboard Shortcuts**
- **Backspace**: Navigate between input boxes
- **Enter**: Click "Next" button (when answer is wrong)
- **Paste**: Fill all boxes at once
- **Blocked during flip**: Prevents interrupting animations

### 5. **Data Management**
- **Export**: Copy all words to clipboard (TSV format)
- **Import**: Paste TSV data to bulk add words
- **Auto-save**: Every card review updates database
- **Sorting**: Cards ordered by `nextReviewAt` timestamp

---

## 🗄️ Database Schema

### User Vocabulary (`words.db`)

**⚠️ IMPORTANT**: Database uses **camelCase** column names (createdAt, lastReviewedAt, nextReviewAt)!

```sql
CREATE TABLE words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original TEXT NOT NULL,           -- German word
  translation TEXT NOT NULL,         -- English translation
  article TEXT NOT NULL DEFAULT '',  -- der/die/das
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Legacy column (unused)
  score INTEGER NOT NULL DEFAULT 0,  -- Spaced repetition score
  createdAt INTEGER NOT NULL,        -- Timestamp (ms) - ACTUAL COLUMN USED
  lastReviewedAt INTEGER NOT NULL,   -- Timestamp (ms) - ACTUAL COLUMN USED
  nextReviewAt INTEGER NOT NULL      -- Timestamp (ms) - ACTUAL COLUMN USED
);
```

**Migrations**:
- Migration 1: Creates table with `created_at`
- Migration 2: Adds spaced repetition fields with camelCase names
- ~~Migration 3: DO NOT ADD - causes duplicate column errors!~~

### Dictionary (`dictionary.db`)
```sql
CREATE TABLE dictionary (
  word TEXT PRIMARY KEY,             -- German word
  pronunciation TEXT,                -- IPA pronunciation
  gender TEXT,                       -- der/die/das
  meanings TEXT,                     -- JSON array of English meanings
  notes TEXT,                        -- JSON array of usage notes
  synonyms TEXT,                     -- JSON array of German synonyms
  seeAlso TEXT                       -- JSON array of related words
);
```

---

## 🧮 Spaced Repetition Algorithm

```typescript
function calculateNextReview(score: number, adjustment: number): number {
  const newScore = Math.max(0, score + adjustment);
  
  // Exponential intervals based on SM-2
  const intervals = [
    10 * 60 * 1000,        // 0: 10 minutes
    1 * 60 * 60 * 1000,    // 1: 1 hour
    4 * 60 * 60 * 1000,    // 2: 4 hours
    1 * 24 * 60 * 60 * 1000,   // 3: 1 day
    3 * 24 * 60 * 60 * 1000,   // 4: 3 days
    7 * 24 * 60 * 60 * 1000,   // 5: 1 week
    14 * 24 * 60 * 60 * 1000,  // 6: 2 weeks
    30 * 24 * 60 * 60 * 1000,  // 7: 1 month
    90 * 24 * 60 * 60 * 1000,  // 8: 3 months
    180 * 24 * 60 * 60 * 1000  // 9+: 6 months
  ];
  
  const interval = intervals[Math.min(newScore, intervals.length - 1)];
  return Date.now() + interval;
}
```

**Rating Actions**:
- **Bad**: `score - 2`, 10 minutes
- **Good**: `score + 1`, exponential
- **Great**: `score + 2`, exponential (2x jump)

---

## 🔍 Dictionary Search Algorithm

### German → English (Prefix Matching)
```typescript
SELECT * FROM dictionary 
WHERE LOWER(word) LIKE 'haus%'
ORDER BY LENGTH(word), word
LIMIT 10
```

### English → German (Fuzzy Matching)
```typescript
// 1. Query 200 entries containing search term
SELECT * FROM dictionary 
WHERE LOWER(meanings) LIKE '%house%'
LIMIT 200

// 2. Fuzzy match in TypeScript
meanings.split(',').forEach(phrase => {
  const distance = levenshteinDistance(searchTerm, phrase.trim());
  const score = distance + (phraseIndex * 0.5); // Position penalty
});

// 3. Sort by score (lower = better)
// 4. Return top 10 matches
```

**Levenshtein Distance**: Measures edit distance between strings
- Handles typos (e.g., "sciense" → "science")
- Prefers earlier phrases in comma-separated lists
- Matches full phrases, not individual words

---

## 🚀 Build & Development

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js (v18+)
# Install dependencies
npm install
```

### Development
```bash
# Start dev server (Vite + Tauri hot reload)
npm run tauri dev

# Build dictionary database (if changed)
npm run build-dictionary
```

### Production Build
```bash
# Build optimized binary
npm run tauri build

# Output: src-tauri/target/release/bundle/
```

---

## 📝 Recent Changes (2024-11-15)

### 1. **"Later" Button (Replaced Skip)**
   - New **"Later"** button (4th button in rating row)
   - Shows card again in 1 minute
   - Does NOT affect score
   - Perfect for when you're not ready to review a specific card right now
   - Uses `Date.now() + 60000` (60 seconds)

### 2. **Debug Reset Button (Enhanced)**
   - New **"Reset All Cards"** button in Debug Info
   - Sets all cards to score 0
   - Makes all cards due immediately (`nextReviewAt = now`)
   - Useful for testing or starting fresh
   - Shows confirmation dialog (cannot be undone!)
   - **Now available on "All Caught Up" screen too!**

### 3. **Time-Based Card Filtering**
   - Cards only appear when they're due for review
   - No more seeing cards before their scheduled time
   - Respects `nextReviewAt` timestamp
   - Shows "All caught up!" message when no cards are due

### 3. **Fixed Mobile Keyboard Input Issues**
   - Replaced `setTimeout` with Vue's `nextTick()` for better reactivity
   - Added cursor positioning to prevent autocorrect interference
   - Added mobile-specific input attributes (`inputmode="text"`, `enterkeyhint="next"`)
   - Fast typing no longer misses letters

### 4. **Added Enter Key for Next Button**
   - Press **Enter** to move to next card when answer is wrong
   - Works the same as clicking "Next" button
   - Faster workflow

### 5. **Fixed Flip Interruption Issue**
   - Keyboard input blocked during check/flip animation
   - Prevents accidental typing from canceling flip
   - Ensures smooth review process

### 6. **Smart Auto-Rating System**
   - ✅ **Correct**: Auto "Great" (+2), auto-advance
   - ❌ **Incorrect**: Show answer, disable rating buttons, show "Next"
   - Forces review of correct answer before continuing
   - Maximizes learning efficiency

### 7. **Improved English Dictionary Search**
   - Queries 200 results, fuzzy matches in TypeScript
   - Splits meanings by comma into phrases
   - Levenshtein distance for typo tolerance
   - Returns top 10 best phrase matches
   - Example: "house, home, dwelling" → matches each separately

### 5. **More Suggestions**
   - German autocomplete: 10 suggestions (was 5)
   - English autocomplete: 10 suggestions (was 5)
   - Better chance of finding what you need

---

## 🎨 UI/UX Details

### Dark Mode
- Auto-detects system preference
- Manual toggle in top-right corner
- Purple accent color (`bg-purple-500`)

### Card Sizing
- Text scales down if word is too long
- Letter boxes: 40px wide, 48px tall
- Max width: container-based, responsive

### Animations
- **Card flip**: 600ms ease transition
- **3D transform**: `rotateY(180deg)`
- **Color transitions**: Green (correct) / Red (incorrect)
- **Border glow**: Ring effect on input boxes

### Input Behavior
- Auto-focus first input on new card
- Auto-advance to next input on type
- Backspace navigates backward if empty
- Paste fills all boxes at once
- Disabled during result checking

---

## 🐛 Known Limitations

### Browser Mode
- No persistent storage (in-memory only)
- No dictionary (requires Tauri file access)
- Limited to session-only data

### Dictionary
- English → German search is approximate (fuzzy)
- Some compound words may not match perfectly
- 200 result limit for performance

### Platform
- Desktop only (Tauri limitation)
- No mobile support
- No web version (requires SQLite)

---

## 🔧 Configuration Files

### `tauri.conf.json`
```json
{
  "identifier": "com.sheaksadi.verteilte",
  "productName": "Verteilte",
  "bundle": {
    "resources": ["../public/dictionary.db.gz"]  // Embedded dictionary
  }
}
```

### `package.json` Scripts
```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "tauri": "tauri",
  "build-dictionary": "node scripts/build-dictionary-db.cjs"
}
```

---

## 📚 Learning Resources

### Spaced Repetition
- [SM-2 Algorithm](https://en.wikipedia.org/wiki/SuperMemo#SM-2_algorithm)
- Intervals: 10m → 1h → 4h → 1d → 3d → 1w → 2w → 1mo → 3mo → 6mo

### Tauri Resources
- [Tauri Docs](https://tauri.app)
- [SQL Plugin](https://github.com/tauri-apps/tauri-plugin-sql)
- [Vue 3 Integration](https://tauri.app/v1/guides/getting-started/setup/vite)

---

## 🎯 Future Improvements

- [ ] Statistics dashboard (words learned, review accuracy)
- [ ] Custom word categories/tags
- [ ] Audio pronunciation (TTS)
- [ ] Export to Anki format
- [ ] Mobile version (Tauri Mobile)
- [ ] More haptic feedback for button clicks

---

## 👨‍💻 Development Notes

### Main Components
- **App.vue** (1077 lines): All application logic, no sub-components
- **Single-file architecture**: Easier to understand, fewer abstractions
- **Reactive state**: Vue 3 `ref()` and `computed()` for reactivity
- **Type safety**: Full TypeScript coverage

### Code Style
- **Minimal comments**: Code is self-documenting
- **Descriptive names**: `calculateNextReview()`, `handleKeydown()`
- **Functional approach**: Pure functions where possible
- **Error handling**: Try-catch with user-friendly messages

---

## 📄 License

MIT License - Feel free to use and modify

---

**Built with ❤️ for German language learners**
