# Learning OS

A hub of **interactive, self-contained learning modules**. Each module is a static
site you open in a browser — no accounts, no build step, no network. Progress is
saved only in your browser (`localStorage`).

## Open it

Open `index.html` (the hub) in a browser, then pick a module. Or open a module
directly, e.g. `modules/claude-agentic/index.html`.

## Modules

| Module | What it teaches |
|---|---|
| **[Working Agentically with Claude](modules/claude-agentic/index.html)** | A guided path from “what is an AI agent?” to orchestrating Claude across chat, Cowork, and Claude Code — with quizzes, a concept map, animated diagrams, and a decision playground. |

The registry lives in [`modules.js`](modules.js); the hub renders a card per entry.

## Design: one folder per topic

Every module lives in its own folder under `modules/`, fully self-contained (its
own copy of the generic engine). This is deliberate: a new module built in a
separate session never touches the existing ones — **isolation over shared code.**

```
learning_os/
├── index.html          # hub (lists modules)
├── hub.css
├── modules.js          # registry — one entry per module
└── modules/
    ├── _template/      # copy this to start a new topic
    └── claude-agentic/ # the first module
```

## Add a new module

```sh
cp -r modules/_template modules/<your-id>
```

Then edit `modules/<your-id>/js/data.js` (the only file you must write) and add an
entry to `modules.js`. Full instructions: [`modules/_template/README.md`](modules/_template/README.md).

Because content is entirely data-driven, building a new topic — say, financial
literacy — means authoring one `data.js`; the path, quizzes, concept map, lens
toggle, and progress tracking all come for free.
