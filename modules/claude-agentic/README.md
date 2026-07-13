# Working Agentically with Claude — module

An interactive, visual course on working agentically with Claude across the
**chat**, **Cowork**, and **Claude Code** surfaces. Sequenced basic → advanced,
with an audience lens for non-technical and technical learners.

## Run it

Open `index.html` in a browser (double-click, or via the repo-root hub). No build
step, no server, no network — everything is self-contained.

## What's inside

- **Guided path** — 5 stages (Foundations → Chat → Cowork → Code → Mastery),
  each a Dreyfus tier. Clearing a stage's quiz advances your tier + DIKW meter.
- **Audience lens** — toggle every lesson between *Explain it simply* and
  *Show the mechanics*.
- **Concept map** — the relationship view (harness at the centre, surfaces and
  concepts radiating out).
- **Decision playground** — “which surface + mechanism should I use?”
- **Animated diagrams** — the agent loop, fan-out vs. pipeline, MCP/Connectors,
  and the hook lifecycle.
- **Mastery Challenge** — a capstone assessment mixing every stage's questions,
  ordered Novice → Expert, returning a final mastery verdict on the DIKW/Dreyfus
  spine (best score saved).

## Files

| File | Role |
|---|---|
| `js/data.js` | **All content** — stages, lessons, quizzes, concept map, diagrams, playground. |
| `js/app.js` | Bootstrap: onboarding, header, lens/theme, view switching. |
| `js/state.js` | Progress + preferences in `localStorage` (namespaced by module id). |
| `js/path.js` | The guided curriculum view. |
| `js/quiz.js` · `conceptmap.js` · `diagrams.js` · `playground.js` · `challenge.js` | The interactives + capstone. |
| `js/util.js` | Shared rendering helpers. |
| `css/styles.css` | Design system (light/dark, responsive). |

Everything except `data.js` is generic engine code shared with `modules/_template`.

## Accuracy note

Content reflects Claude's products as of mid-2026 (models, surfaces, Skills,
Connectors/MCP, Cowork). Where product specifics evolve quickly, lessons teach the
concept and hedge exact strings. Not affiliated with Anthropic.
