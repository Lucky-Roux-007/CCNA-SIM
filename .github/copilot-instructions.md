# CCNA Exam Simulator - AI Agent Instructions

## Project Overview
A React + Vite application for CCNA 200-301 exam preparation with two primary modes: **Practice Mode** (learn with explanations) and **Exam Mode** (timed simulation with scoring).

## Architecture & Data Flow

### State Management
- **Single Context Pattern**: All app state lives in [src/context/AppContext.jsx](src/context/AppContext.jsx) using `useReducer`
- **Two Question Lists**: `practiceQuestions` (for learning) and `examQuestions` (for exams) are separate arrays derived from the same source
- **Mode Switching**: `state.mode` determines active question list via `getActiveQuestions(state)`
- Access state via `useApp()` hook anywhere in the component tree

### Question Data Structure
Questions in [src/data/questions.js](src/data/questions.js) support three types:
1. **multiple-choice**: Standard with `options` object (A, B, C, D) and `correctAnswer` array
2. **drag-drop**: Uses `pairs: [{left, right}]` array; `correctAnswer` auto-generated as `["L0:R0", "L1:R1", ...]` if missing
3. **simple**: Text-only questions

**Critical**: `correctAnswer` is ALWAYS an array (even for single-answer questions). Use `validateAnswer()` from [src/utils/validateAnswer.js](src/utils/validateAnswer.js) which sorts and compares arrays.

### Question Processing Pipeline
On mount, [AppContext.jsx](src/context/AppContext.jsx) runs `processQuestions()` to:
- Add default `imagePath: /question-${id}.png` when `hasImage: true` but no path specified
- Generate `correctAnswer` for drag-drop questions from `pairs` if missing
- This happens once via `useMemo` to avoid re-processing

### Image Fallback Pattern
Both ExamMode and LearnMode implement progressive image format fallback:
```javascript
const [imgSrc, setImgSrc] = useState(`/question-${q.id}.png`)
const onImgError = () => {
  if (imgSrc.endsWith('.png')) setImgSrc(imgSrc.replace('.png', '.jpg'))
  else if (imgSrc.endsWith('.jpg')) setImgSrc(imgSrc.replace('.jpg', '.jpeg'))
  else if (imgSrc.endsWith('.jpeg')) setImgSrc(imgSrc.replace('.jpeg', '.webp'))
}
```
Apply this pattern when adding image support to new question types.

### Scoring System
[src/utils/scoreExam.js](src/utils/scoreExam.js) implements weighted scoring:
- Single-choice: 1.0 point
- Multi-choice: 1.5 points (detected by `correctAnswer.length > 1`)
- Drag-drop: 2.5 points
- Returns `scaledScore` (0-1000 scale) where 800+ = passing

## Routing & Navigation

[src/router/AppRouter.jsx](src/router/AppRouter.jsx) defines the flow:
- `/` → Home (mode selection)
- `/practice` → Category list → `/practice/:category` (LearnMode)
- `/exam` → Setup → `/exam/start` (ExamMode) → `/exam/result` → `/exam/review`

**Exam Mode Constraints**:
- One-way navigation only (no back button between questions)
- Timer stored in `state.examSettings.timer` (minutes)
- Navigation to `/exam/result` triggers scoring via `calculateScore()`

## Development Workflow

### Build Commands
```bash
npm run dev      # Start dev server on :5173
npm run build    # Production build
npm run preview  # Preview production build
```

### Key Configuration
- **Misspelled publicDir**: `vite.config.js` uses `publicDir: 'pubilc'` (not 'public') - maintain this quirk
- **Tailwind v4**: Uses `@tailwindcss/vite` plugin, configured in [vite.config.js](vite.config.js)
- **React Router v7**: Uses `createBrowserRouter` with data router pattern

## Component Patterns

### DragMatch Component
[src/components/UI/DragMatch.jsx](src/components/UI/DragMatch.jsx) manages drag-drop questions:
- Uses token format `"L0:R2"` to encode left-index:right-index pairings
- Shuffles right-side options once on mount (stays stable per question)
- `onChange` callback receives array of tokens like `["L0:R1", "L1:R0"]`
- In reveal mode, compares `assigned` state against `correctTokens` prop

### Answer Selection Pattern
Both ExamMode and LearnMode follow this pattern:
```javascript
const [selected, setSelected] = useState([])
const onSelect = (key) => {
  if (isMulti) {
    const next = selected.includes(key) 
      ? selected.filter(k => k !== key) 
      : [...selected, key]
    setSelected(next)
    answerQuestion(q.id, next)
  } else {
    setSelected([key])
    answerQuestion(q.id, [key])
  }
}
```
Always store as array, even for single selections.

### useEffect Hook Ordering
In LearnMode and ExamMode, hooks run before conditional returns. Pattern:
```javascript
// 1. All hooks first
const [state, setState] = useState()
useEffect(...)
// 2. Then conditional returns
if (!data) return <Loading />
```

## Adding New Questions
1. Open [src/data/questions.js](src/data/questions.js)
2. Add object with unique `id`, matching one of: `Network Fundamentals`, `Network Access`, `IP Connectivity`, `IP Services`, `Security Fundamentals`, `Automation and Programmability`
3. For images: set `hasImage: true` and place file as `/pubilc/question-{id}.png`
4. Multi-answer questions: include all correct keys in `correctAnswer` array
5. Drag-drop: define `pairs`, omit `correctAnswer` (auto-generated in order)

## Utility Functions
- **shuffle.js**: Fisher-Yates shuffle for randomization
- **selectRandom.js**: Pick N random items from array
- **filterByCategory.js**: Filter questions by category string match
- **validateAnswer.js**: Sort-and-compare arrays for answer validation
- **scoreExam.js**: Weighted scoring with scaled 0-1000 output

## External Dependencies
- **Vercel Analytics**: Integrated via `@vercel/analytics` in [src/main.jsx](src/main.jsx)
- **Lucide React**: Icon library used throughout (no custom icons)
- **Tailwind CSS**: All styling via utility classes (no separate CSS files except [index.css](src/index.css))
