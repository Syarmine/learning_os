# Module template

This folder is a **ready-to-copy scaffold** for a new learning module. The engine
(everything in `js/` except `data.js`, plus `css/styles.css` and `index.html`) is
**generic and content-agnostic** — it renders whatever `js/data.js` describes.

## Create a new module

```sh
cp -r modules/_template modules/<your-id>
```

Then:

1. Open `modules/<your-id>/js/data.js` and set `MODULE.id` to `<your-id>`.
2. Fill in `STAGES`, `CONCEPT_MAP`, and `PLAYGROUND` with your content
   (leave `DIAGRAMS = {}` unless you want custom animations — see below).
3. Register it in the repo-root `modules.js`:

   ```js
   {
     id: '<your-id>',
     title: 'Your Title',
     emoji: '🧠',
     path: 'modules/<your-id>/index.html',
     description: '…',
     tags: ['…'],
     status: 'ready',
   }
   ```

That's it — open the repo-root `index.html` and your module appears on the hub.
Progress is namespaced by `MODULE.id`, so modules never clobber each other's
`localStorage`.

## What you can author (in `data.js`)

- **Stages** — the linear curriculum (basic → advanced). Each maps to a mastery
  tier and holds lessons + a quiz.
- **Lessons** — an always-on `analogy` plus two lenses: `simple` (plain language)
  and `mechanics` (technical). Content blocks: `{p}`, `{list}`, `{steps}`,
  `{code}`, `{tip}`.
- **Quiz** — per-stage questions with `answer`, a `why`, and a `tier`. Passing
  `PASS_RATIO` clears the stage and advances the tier / DIKW meter.
- **Concept map** — nodes (`core`/`surface`/`concept`) + labeled edges; auto-laid-out.
- **Playground** — a tag-based decision tool.

## Optional: custom animated diagrams

`DIAGRAMS = {}` disables embedded animations (everything else still works). To add
one, define a `DIAGRAMS[<id>]` entry (steps + captions) in `data.js`, add a matching
SVG scaffold in `js/diagrams.js` (`SCAFFOLDS[<id>]`), and map a lesson to it in
`js/path.js` (`LESSON_DIAGRAM`). See `modules/claude-agentic` for a full example.

## Do not edit the engine (usually)

`app.js`, `state.js`, `path.js`, `quiz.js`, `conceptmap.js`, `playground.js`,
`util.js`, `css/styles.css`, and `index.html` are shared boilerplate. Keeping them
unchanged means a new chat building a different topic never touches your module —
each folder is fully self-contained.
