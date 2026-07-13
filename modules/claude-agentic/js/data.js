// ============================================================================
// data.js — single source of truth for the "claude-agentic" learning module.
// The engine (app/path/state/quiz/conceptmap/diagrams/playground) is generic
// and renders everything from the exports below. To build a NEW topic module,
// copy modules/_template and rewrite THIS file only.
// ============================================================================

const MODULE = {
  id: 'claude-agentic',
  title: 'Working Agentically with Claude',
  subtitle: 'chat · Cowork · Code — from knowing to expert',
  blurb:
    'A guided path from “what is an AI agent?” to orchestrating Claude across ' +
    'chat, Cowork, and Claude Code. Built for the curious and the technical alike.',
};

// The maturity spine. Stage N unlocks Dreyfus tier N and advances the DIKW meter.
const TIERS = ['Novice', 'Advanced Beginner', 'Competent', 'Proficient', 'Expert'];
const DIKW = ['Data', 'Information', 'Knowledge', 'Wisdom'];

// Passing this fraction of a stage's quiz clears the stage (unlocks the next tier).
const PASS_RATIO = 0.6;

// ---------------------------------------------------------------------------
// Content-block helpers (authored, trusted HTML in `p` strings is allowed:
// <code> <strong> <em> only). The renderer supports these block shapes:
//   { p: '…' }            paragraph
//   { list: ['…', …] }    bulleted list
//   { steps: ['…', …] }   numbered steps
//   { code: '…' }         monospace block
//   { tip: '…' }          highlighted callout
// ---------------------------------------------------------------------------

const STAGES = [
  // =========================================================================
  // STAGE 1 — FOUNDATIONS · NOVICE
  // =========================================================================
  {
    id: 'foundations',
    n: 1,
    title: 'Foundations',
    tier: 'Novice',
    dikw: 'Data',
    tagline: 'What “agentic” means, where you use it, and which model to pick.',
    intro:
      'Before any buttons or settings: the one idea that makes everything else ' +
      'click. An agent is not a chatbot that answers — it is a worker that acts, ' +
      'in a loop, until a goal is done.',
    lessons: [
      {
        id: 'harness',
        title: 'The agent loop (the “harness”)',
        icon: '🔄',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'Think of a capable assistant you hand a goal to — “book me a good ' +
          'flight.” They look things up, make a choice, check it’s right, and ' +
          'adjust. They loop until it’s done. That loop is the whole trick.',
        simple: [
          { p: 'A <strong>chatbot</strong> answers a question. An <strong>agent</strong> works toward a goal — it can look things up, take actions, notice mistakes, and try again.' },
          { p: 'It runs a simple loop, over and over:' },
          { steps: [
            '<strong>Gather</strong> — read the files, search, look at what’s there.',
            '<strong>Act</strong> — take a step: write something, run something, change something.',
            '<strong>Verify</strong> — check the result. Did it work? If not, loop back.',
          ] },
          { p: 'You stay in charge. You set the goal, you can interrupt, and you steer. The loop just means you don’t have to spell out every single step yourself.' },
          { tip: 'Everything else in this course — models, chat, Cowork, Code, skills, connectors — is a variation on this one loop.' },
        ],
        mechanics: [
          { p: 'The loop is often called the <strong>harness</strong> (or agent loop). It is the runtime that turns a language model into an agent by repeatedly letting it call <em>tools</em> and read the results back into its context.' },
          { p: 'One turn of the loop:' },
          { steps: [
            '<strong>Gather context</strong> — read files, grep/glob, search the web, inspect state.',
            '<strong>Act</strong> — the model emits a tool call (edit a file, run a command, fetch a URL); the harness executes it.',
            '<strong>Verify</strong> — the tool result feeds back in; the model decides the next step, or stops when the goal is met.',
          ] },
          { p: 'You remain in the loop: interrupt at any point, add context, or redirect. The same harness powers chat, Cowork, and Claude Code — they differ in UX and how much they can touch, not in this core cycle.' },
          { tip: 'A question may need only “gather.” A bug fix may cycle gather→act→verify many times. The loop adapts to the task.' },
        ],
      },
      {
        id: 'surfaces',
        title: 'The three surfaces: chat · Cowork · Code',
        icon: '🖥️',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'Same brain, three doors. Chat is a conversation. Cowork is handing a ' +
          'teammate a whole project to run. Code is sitting at the workbench with ' +
          'full control of the tools.',
        simple: [
          { p: 'You’ll meet Claude through three products. They share the same agent loop; they differ in how much they do for you and how hands-on you are.' },
          { list: [
            '<strong>Claude chat</strong> — the everyday conversation (web, desktop, mobile). Ask, upload files, get interactive answers. Most approachable.',
            '<strong>Claude Cowork</strong> — Claude as an autonomous teammate for real, multi-step work. You hand off a whole task; it runs it — even in the background.',
            '<strong>Claude Code</strong> — the power tool for software work. Full control over tools, permissions, and automation.',
          ] },
          { p: 'A rough rule: <strong>chat</strong> to think and create, <strong>Cowork</strong> to delegate a project, <strong>Code</strong> to build and automate with precision.' },
        ],
        mechanics: [
          { p: 'All three run the same agentic architecture; they trade approachability for control:' },
          { list: [
            '<strong>Claude chat</strong> (claude.ai + desktop + mobile) — conversational agent with Artifacts, Projects, file/web context, extended thinking, Skills, and Connectors (MCP).',
            '<strong>Claude Cowork</strong> — a Claude-Code-style agent for general (non-terminal) knowledge work. Takes on complex multi-step tasks, can run in the background / on a schedule, uses browser/computer access, and coordinates sub-agents. GA April 2026, on Pro and up; available on desktop, web, and mobile.',
            '<strong>Claude Code</strong> — the developer surface (CLI, IDE extensions, desktop, web, Slack, CI). Exposes the full harness: tools, subagents, hooks, permission/plan modes, CLAUDE.md, slash commands, MCP.',
          ] },
          { tip: 'The capstone lesson (“which surface + pattern?”) turns this into a decision you can make quickly. The Decision Playground practises it.' },
        ],
      },
      {
        id: 'models',
        title: 'The models: capability vs. cost & speed',
        icon: '🧠',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'Like choosing a vehicle: a race car for the hardest climbs, a reliable ' +
          'daily sedan for most trips, a nimble scooter for quick errands. Bigger ' +
          'isn’t always better — matching the job is.',
        simple: [
          { p: 'Claude comes in a family. Higher tiers are more capable but cost more and can be slower. You match the model to the job.' },
          { list: [
            '<strong>Fable 5</strong> — the most capable, for the hardest, longest tasks.',
            '<strong>Opus 4.8</strong> — very strong all-rounder for complex work.',
            '<strong>Sonnet 5</strong> — the everyday default: great balance of smart and fast.',
            '<strong>Haiku 4.5</strong> — fastest and cheapest, for quick or high-volume tasks.',
          ] },
          { p: 'Start with Sonnet 5 for most things; reach for Opus/Fable when a task is genuinely hard; use Haiku for speed and volume.' },
        ],
        mechanics: [
          { p: 'Current lineup (model ID · input/output per 1M tokens · context):' },
          { list: [
            '<code>claude-fable-5</code> — $10 / $50 · 1M ctx · most capable, long-horizon agentic work.',
            '<code>claude-opus-4-8</code> — $5 / $25 · 1M ctx · complex agentic + knowledge work.',
            '<code>claude-sonnet-5</code> — $3 / $15 ($2/$10 intro through 2026-08-31) · 1M ctx · production default.',
            '<code>claude-haiku-4-5</code> — $1 / $5 · 200K ctx · fast, cost-effective, near-frontier.',
          ] },
          { p: 'These models use <strong>adaptive thinking</strong> (they decide how much to reason) plus an <strong>effort</strong> control. In Claude Code you can switch with <code>/model &lt;name&gt;</code>; a common pattern is Haiku for cheap subagent work and Opus/Fable for the hard reasoning.' },
          { tip: 'There is no “Claude 5” family — Fable is the top tier above Opus, Sonnet, and Haiku.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'What most distinguishes an “agent” from a plain chatbot?',
        options: [
          'It writes longer answers',
          'It works toward a goal by acting and checking in a loop',
          'It never makes mistakes',
          'It only runs in the terminal',
        ],
        answer: 1,
        why: 'An agent runs the gather → act → verify loop toward a goal, rather than just replying once.',
        tier: 'Novice',
      },
      {
        q: 'The three phases of the agent loop (the harness) are:',
        options: [
          'Plan, pay, publish',
          'Gather context, act via tools, verify results',
          'Prompt, wait, copy',
          'Compile, test, deploy',
        ],
        answer: 1,
        why: 'Gather → act → verify, repeated until the goal is met, is the core cycle every surface shares.',
        tier: 'Novice',
      },
      {
        q: 'You want to hand off a whole multi-step project and let it run, even in the background. Which surface fits best?',
        options: ['Claude chat', 'Claude Cowork', 'Claude Code', 'None of these'],
        answer: 1,
        why: 'Cowork is the agentic-teammate surface for multi-step knowledge work, including background/scheduled runs.',
        tier: 'Advanced Beginner',
      },
      {
        q: 'For a simple, high-volume classification task where speed and cost matter most, a good default model is:',
        options: ['claude-fable-5', 'claude-opus-4-8', 'claude-haiku-4-5', 'There is no cheap model'],
        answer: 2,
        why: 'Haiku 4.5 is the fastest and cheapest tier — ideal for quick, high-volume work.',
        tier: 'Advanced Beginner',
      },
    ],
  },

  // =========================================================================
  // STAGE 2 — CLAUDE CHAT · ADVANCED BEGINNER
  // =========================================================================
  {
    id: 'chat',
    n: 2,
    title: 'Claude chat',
    tier: 'Advanced Beginner',
    dikw: 'Information',
    tagline: 'The everyday surface: goals, context, Artifacts, and Projects.',
    intro:
      'Chat is where most people meet Claude. Working well here is mostly about ' +
      'two things: giving a good goal, and feeding the right context.',
    lessons: [
      {
        id: 'good-goals',
        title: 'Giving good goals & context',
        icon: '🎯',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'Briefing a talented freelancer: tell them the outcome you want, who ' +
          'it’s for, and hand over the relevant files. Vague brief, vague result.',
        simple: [
          { p: 'The quality of what you get back tracks the quality of your brief. Aim for: the <strong>outcome</strong> you want, <strong>who it’s for</strong>, and any <strong>constraints</strong>.' },
          { list: [
            'Say the goal and the “done” state — “a one-page summary a busy exec can skim.”',
            'Give context: paste or upload the source material instead of describing it.',
            'Let it use tools it has (web search, files) rather than guessing from memory.',
          ] },
          { p: 'You don’t need to script every step — that’s the agent’s job. You need to make the target clear.' },
        ],
        mechanics: [
          { p: 'Chat can pull context from several places — use them instead of pasting everything into one long message:' },
          { list: [
            '<strong>File uploads</strong> — documents, images, PDFs, data for the model to read directly.',
            '<strong>Web search</strong> — for anything past the model’s training cutoff or time-sensitive.',
            '<strong>Extended / adaptive thinking</strong> — the model reasons more on hard problems automatically.',
          ] },
          { p: 'Give the <em>reason</em> behind a request, not just the request — “I’m preparing a board update, so keep it to metrics that moved.” The agent connects the goal to what matters.' },
          { tip: 'Well-specified upfront beats drip-feeding requirements across many turns — it raises quality and cuts back-and-forth.' },
        ],
      },
      {
        id: 'artifacts',
        title: 'Artifacts: interactive, editable outputs',
        icon: '📄',
        surfaces: ['chat'],
        analogy:
          'Instead of describing a chart, Claude hands you the actual chart in a ' +
          'side panel — one you can look at, tweak, and take with you.',
        simple: [
          { p: 'When Claude makes something substantial — a document, a chart, a small app, a diagram — it can put it in an <strong>Artifact</strong>: a live panel beside the chat.' },
          { list: [
            'You see the real thing, not a description of it.',
            'You can iterate on it in the same conversation (“make the header bigger”).',
            'You can keep it, share it, or take the content elsewhere.',
          ] },
        ],
        mechanics: [
          { p: 'Artifacts render self-contained content (HTML, small apps, diagrams, docs) in a preview panel. They’re good for anything you’ll <em>use</em> rather than just read.' },
          { p: 'Ask for one explicitly (“build this as an interactive page”) or let Claude offer it when the output warrants it. Iterate by asking for changes; the Artifact updates in place.' },
          { tip: 'This very course is the kind of thing an Artifact/site can be — visual, interactive, self-contained.' },
        ],
      },
      {
        id: 'projects',
        title: 'Projects & persistent context',
        icon: '🗂️',
        surfaces: ['chat', 'cowork'],
        analogy:
          'A dedicated workspace with a shelf of reference material and a sticky ' +
          'note of house rules — so you don’t re-explain yourself every time.',
        simple: [
          { p: 'A <strong>Project</strong> is a workspace that remembers its context: reference files, and standing instructions for how you like things done.' },
          { list: [
            'Add the documents Claude should always know about (a style guide, a spec, past reports).',
            'Set instructions once (“always write in plain English, cite sources”).',
            'Every chat in that Project starts already knowing them.',
          ] },
          { p: 'Great when you return to the same kind of work repeatedly.' },
        ],
        mechanics: [
          { p: 'Projects hold <strong>project knowledge</strong> (uploaded reference material) plus <strong>custom instructions</strong> that apply to every conversation inside them — a persistent-context layer above individual chats.' },
          { p: 'This is the chat/Cowork analog of Claude Code’s <code>CLAUDE.md</code>: durable context and conventions that don’t have to be re-supplied each turn.' },
          { tip: 'Cowork also has Projects, keeping a task’s files, instructions, and context together in one workspace.' },
        ],
      },
      {
        id: 'skills-in-apps',
        title: 'Skills in the apps',
        icon: '🧩',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'A recipe card Claude picks up only when it’s cooking that dish — the ' +
          'full instructions stay off the counter until they’re needed.',
        simple: [
          { p: 'A <strong>Skill</strong> is a reusable bundle of know-how — step-by-step instructions (and sometimes scripts and files) for a specific kind of task.' },
          { list: [
            'Claude loads a Skill only when your task matches it — so it doesn’t clutter every conversation.',
            'Anthropic ships Skills (e.g. building slide decks, spreadsheets, documents); you can add your own.',
            'You get consistent, expert results on repeated tasks without re-explaining the process.',
          ] },
        ],
        mechanics: [
          { p: 'A Skill is a self-contained folder of instructions, scripts, and resources that Claude loads <strong>on demand</strong> — “progressive disclosure”: only a short description sits in context until the Skill is actually used.' },
          { p: 'Skills are the default extension mechanism across the Claude apps (chat, Cowork, Code). Pre-built Skills cover common document work (slides, sheets, docs, PDFs); custom Skills package your own workflows.' },
          { tip: 'In Claude Code, Skills live as <code>SKILL.md</code> files and can also be invoked like <code>/skill-name</code>. You’ll see the file-level mechanics in Stage 4.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'The single biggest lever on chat output quality is:',
        options: [
          'Using ALL CAPS',
          'A clear goal plus the right context (files, reason, constraints)',
          'Sending many short messages',
          'Choosing the cheapest model',
        ],
        answer: 1,
        why: 'A clear outcome + relevant context beats scripting every step or drip-feeding requirements.',
        tier: 'Advanced Beginner',
      },
      {
        q: 'An Artifact is best described as:',
        options: [
          'A saved chat transcript',
          'An interactive, editable output rendered beside the conversation',
          'A billing record',
          'A type of model',
        ],
        answer: 1,
        why: 'Artifacts render usable content (docs, apps, charts, diagrams) in a live panel you can iterate on.',
        tier: 'Advanced Beginner',
      },
      {
        q: 'You keep re-uploading the same style guide and re-stating the same rules every chat. The fix is:',
        options: [
          'A Project with project knowledge + custom instructions',
          'A bigger model',
          'A hook',
          'Nothing — that’s unavoidable',
        ],
        answer: 0,
        why: 'Projects hold persistent reference material and standing instructions so every chat starts with them.',
        tier: 'Competent',
      },
      {
        q: '“Progressive disclosure” for Skills means:',
        options: [
          'Skills are revealed to you slowly over weeks',
          'Only a short description stays in context; full instructions load when the Skill is used',
          'Skills must be paid for in stages',
          'Skills disclose your data publicly',
        ],
        answer: 1,
        why: 'A Skill’s full content loads on demand, keeping context lean until it’s actually relevant.',
        tier: 'Competent',
      },
    ],
  },

  // =========================================================================
  // STAGE 3 — CLAUDE COWORK · COMPETENT
  // =========================================================================
  {
    id: 'cowork',
    n: 3,
    title: 'Claude Cowork',
    tier: 'Competent',
    dikw: 'Knowledge',
    tagline: 'Claude as an autonomous teammate: delegate, connect, oversee.',
    intro:
      'Cowork is the step from “assistant that answers” to “teammate that does.” ' +
      'The skill here is delegation: framing a task well, giving it the right ' +
      'tools and access, and reviewing the result.',
    lessons: [
      {
        id: 'delegation',
        title: 'Delegating multi-step work',
        icon: '🤝',
        surfaces: ['cowork'],
        analogy:
          'Handing a project to a capable colleague instead of asking one question ' +
          'at a time. You describe the outcome; they plan and run it, and check ' +
          'back when they need you.',
        simple: [
          { p: '<strong>Cowork</strong> takes on whole tasks, not single questions. You describe an outcome; it breaks the work down, does it, and reports back.' },
          { list: [
            'It can keep working in the <strong>background</strong> — even after you close your laptop — and run scheduled work.',
            'It can open a browser and use websites (click, type, fill forms) when a task needs that.',
            'It coordinates <strong>sub-tasks in parallel</strong> to get through larger work faster.',
          ] },
          { p: 'Your job shifts from “doing each step” to “framing the task and reviewing the outcome.”' },
        ],
        mechanics: [
          { p: 'Cowork is a Claude-Code-style agent for general knowledge work with no terminal. It plans, executes, and coordinates sub-agents across parallel workstreams.' },
          { list: [
            '<strong>Background / remote execution</strong> — tasks continue when your device is off; scheduled work runs on its own.',
            '<strong>Computer / browser use</strong> — it can drive a browser for tasks that touch web apps.',
            '<strong>Cross-device</strong> — start on one device, monitor on another (desktop, web, mobile).',
          ] },
          { tip: 'Delegate like you would to a person: give the goal, the “done” criteria, and the context up front. A well-specified single hand-off beats many mid-task corrections.' },
        ],
      },
      {
        id: 'connectors',
        title: 'Connectors (MCP): plugging in your tools & data',
        icon: '🔌',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'Giving your teammate a badge to your systems — the issue tracker, the ' +
          'shared drive, the calendar — so they stop asking you to fetch things ' +
          'and just get them.',
        simple: [
          { p: 'By default Claude only knows what you tell it. A <strong>Connector</strong> plugs Claude into an outside system so it can read and act there directly.' },
          { list: [
            'Connect things like GitHub, a database, a knowledge base, or a design tool.',
            'Then Claude can pull data and take actions in that system without copy-paste.',
            'Anthropic maintains a vetted directory of connectors; they work across chat, desktop, mobile, and Code.',
          ] },
          { p: 'The moment you notice you’re shuttling data between Claude and another tool, that’s a sign to add a connector.' },
        ],
        mechanics: [
          { p: 'Connectors are verified <strong>MCP (Model Context Protocol)</strong> servers. MCP is an open standard: a server exposes <strong>tools</strong> (callable actions) and <strong>resources</strong> (data/context), and Claude calls them through the loop.' },
          { list: [
            'They work across Claude.ai, Desktop, Mobile, and Claude Code.',
            'Remote connectors (hosted MCP servers) and local/desktop MCP extensions are both supported.',
            'Anthropic’s directory vets connectors for security, reliability, and compatibility.',
          ] },
          { p: 'In Claude Code you configure MCP servers in project settings; in the apps you enable connectors from the directory. Same protocol underneath.' },
          { tip: 'MCP is the “USB-C for tools”: build/enable once, and any Claude surface can use it.' },
        ],
      },
      {
        id: 'oversight',
        title: 'Trust, review & oversight',
        icon: '🧭',
        surfaces: ['cowork', 'code'],
        analogy:
          'A good manager doesn’t watch every keystroke, but does review the work ' +
          'and gate the risky moves. Autonomy with checkpoints.',
        simple: [
          { p: 'Autonomy is powerful, so calibrate how much rope you give — more for low-risk work, less for anything hard to undo.' },
          { list: [
            'For reversible, low-stakes tasks, let it run and review the result.',
            'For risky or irreversible actions, keep a checkpoint where you approve first.',
            'Always review the output — you’re accountable for it, agent or not.',
          ] },
          { p: 'Think “trust dial,” not on/off. Start cautious; loosen as you build confidence in a given task.' },
        ],
        mechanics: [
          { p: 'Oversight is a spectrum, and the agent surfaces controls for it: approval checkpoints on sensitive actions, the ability to interrupt and redirect, and reviewable output/artifacts.' },
          { p: 'The same idea is formalized in Claude Code as <strong>permission modes</strong> (next stage): a dial from “ask me every time” to “run autonomously.” Cowork applies the concept through task hand-off and review rather than terminal prompts.' },
          { tip: 'Match oversight to reversibility: gate hard-to-undo actions (sending, deleting, publishing); let easily-reversible work flow.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'The core skill shift when moving to Cowork is:',
        options: [
          'Writing faster',
          'From doing each step to framing a task and reviewing the outcome',
          'Memorizing model IDs',
          'Avoiding tools',
        ],
        answer: 1,
        why: 'Cowork runs whole tasks; your role becomes good delegation and review.',
        tier: 'Competent',
      },
      {
        q: 'A Connector is, underneath, a:',
        options: [
          'Bigger context window',
          'Verified MCP server exposing tools and resources',
          'Type of Artifact',
          'Billing plan',
        ],
        answer: 1,
        why: 'Connectors are vetted MCP servers — the open standard for exposing external tools and data to Claude.',
        tier: 'Competent',
      },
      {
        q: 'Which action most deserves an approval checkpoint before the agent runs it?',
        options: [
          'Reading a file',
          'Summarizing a document',
          'Publishing a post to a live public account',
          'Searching the web',
        ],
        answer: 2,
        why: 'Oversight should track reversibility — gate hard-to-undo, outward-facing actions.',
        tier: 'Proficient',
      },
      {
        q: 'You keep copy-pasting issues out of your tracker into Claude and its replies back. The right fix is:',
        options: [
          'A Connector (MCP) to the tracker',
          'A larger model',
          'An output style',
          'A subagent',
        ],
        answer: 0,
        why: 'Shuttling data between Claude and a system is the classic signal to connect that system via MCP.',
        tier: 'Proficient',
      },
    ],
  },

  // =========================================================================
  // STAGE 4 — CLAUDE CODE · PROFICIENT
  // =========================================================================
  {
    id: 'code',
    n: 4,
    title: 'Claude Code',
    tier: 'Proficient',
    dikw: 'Knowledge',
    tagline: 'The power surface: tools, the trust dial, memory, and automation.',
    intro:
      'Claude Code exposes the full harness. This is where the “mechanics” lens ' +
      'earns its keep — file paths, modes, and config that give you precise ' +
      'control over what the agent can do.',
    lessons: [
      {
        id: 'tools',
        title: 'Tools: the agent’s hands',
        icon: '🛠️',
        surfaces: ['code'],
        analogy:
          'A workbench with labelled tools. The agent reaches for the right one — ' +
          'a file to read, a command to run, the web to search.',
        simple: [
          { p: 'Tools are the actions the agent can take. In Claude Code the built-in set covers the essentials of working with a codebase and the web.' },
          { list: [
            'Read, write, and edit files.',
            'Run commands.',
            'Find things (by name or by content).',
            'Search and fetch from the web.',
          ] },
          { p: 'The agent chooses tools itself; you mostly control <em>whether</em> it’s allowed to (next lesson).' },
        ],
        mechanics: [
          { p: 'The built-in tool set includes <code>Read</code>, <code>Write</code>, <code>Edit</code>, <code>Bash</code>, <code>Glob</code>, <code>Grep</code>, <code>WebSearch</code>, and <code>WebFetch</code>. These are the primitives; Skills and MCP add higher-level or external capabilities on top.' },
          { p: 'Dedicated tools (vs. raw shell) let the harness gate, log, and parallelize actions — e.g. read-only <code>Grep</code> can run in parallel while a risky write is serialized and gated.' },
          { tip: 'Prefer promoting risky or auditable actions to dedicated tools; the harness can then intercept and control them precisely.' },
        ],
      },
      {
        id: 'permission-modes',
        title: 'Plan & permission modes: the trust dial',
        icon: '🎚️',
        surfaces: ['code'],
        analogy:
          'A dial from “ask me before every move” to “go ahead, I’ll review after.” ' +
          'Plan mode is the special setting where the agent researches and proposes ' +
          'but doesn’t touch anything yet.',
        simple: [
          { p: 'You control how often the agent stops to ask. Turn it up for sensitive work, down for flow.' },
          { list: [
            '<strong>Manual</strong> — approve each action (safest default).',
            '<strong>Accept edits</strong> — file edits go through; you review via diff.',
            '<strong>Plan mode</strong> — it explores and proposes a plan, but makes no changes until you approve.',
            '<strong>Auto</strong> — it runs with minimal prompting (with safety checks).',
          ] },
          { p: 'Separate <strong>research from action</strong> with Plan mode on anything big or risky.' },
        ],
        mechanics: [
          { p: 'Permission modes set the baseline of autonomy (cycle them in the CLI with <code>Shift+Tab</code>). The status line shows the current mode.' },
          { list: [
            '<strong>Manual</strong> — only read-only is auto-approved.',
            '<strong>Accept Edits</strong> — auto-approve edits + common filesystem ops; review via git diff.',
            '<strong>Plan</strong> — read-only; the agent proposes a plan and makes no edits until you approve.',
            '<strong>Auto</strong> — broad auto-approval with a safety classifier for clearly dangerous actions.',
            '<strong>Bypass</strong> — no checks; only for isolated/throwaway environments.',
          ] },
          { p: 'Fine-grained <strong>permission rules</strong> layer on top to pre-allow or deny specific tools/commands. Match the mode to blast radius: Plan for large refactors, Manual for anything sensitive.' },
          { tip: 'Plan mode is the discipline of “design before you build” — review the strategy, then switch to Accept Edits to implement.' },
        ],
      },
      {
        id: 'memory',
        title: 'CLAUDE.md, memory & context management',
        icon: '📌',
        surfaces: ['code'],
        analogy:
          'A pinned note on the project wall that the agent reads first every time — ' +
          'plus a notebook where it jots lessons so it doesn’t relearn them.',
        simple: [
          { p: 'Claude Code keeps standing context so you don’t repeat yourself, and it manages its own working memory as a task grows.' },
          { list: [
            '<strong>CLAUDE.md</strong> — a file of project facts and conventions, read at the start of every session (build commands, style, where things live).',
            '<strong>Memory</strong> — the agent can save learnings across sessions.',
            '<strong>Context management</strong> — as a conversation fills up, it summarizes/prunes older detail to keep going.',
          ] },
        ],
        mechanics: [
          { p: '<code>CLAUDE.md</code> loads at session start (project, user <code>~/.claude/CLAUDE.md</code>, and local scopes; can import other files). It’s the durable place for conventions and commands — the counterpart to chat/Cowork Projects.' },
          { p: 'Context fills as you work; Claude Code <strong>compacts</strong> automatically (summarize + prune stale tool output). Inspect usage with <code>/context</code>; force a summary with <code>/compact</code>. Skills and subagents help by loading only when needed.' },
          { tip: 'Put team-shared conventions in <code>CLAUDE.md</code> (committed to git); let auto-memory capture the one-off lessons you’d otherwise re-explain.' },
        ],
      },
      {
        id: 'skills-commands-mcp-hooks',
        title: 'Skills, slash commands, MCP & hooks',
        icon: '⚙️',
        surfaces: ['code'],
        analogy:
          'Four ways to shape the agent: recipe cards (Skills), shortcuts (commands), ' +
          'plug-in tools (MCP), and trip-wires that always fire (hooks).',
        simple: [
          { p: 'Four levers extend and control Claude Code. Knowing which is which is half of mastery:' },
          { list: [
            '<strong>Skills</strong> — reusable, loaded-on-demand know-how for repeated tasks.',
            '<strong>Slash commands</strong> — quick actions typed with <code>/</code> (built-in ones, plus your own).',
            '<strong>MCP / connectors</strong> — plug in external tools and data.',
            '<strong>Hooks</strong> — rules that run automatically at set moments, no matter what the agent decides.',
          ] },
          { p: 'The difference that matters: a Skill <em>guides</em>; a hook <em>enforces</em>.' },
        ],
        mechanics: [
          { p: '<strong>Skills</strong> live as <code>.claude/skills/&lt;name&gt;/SKILL.md</code> (YAML frontmatter + markdown body; auto-trigger or invoke as <code>/name</code>).' },
          { p: '<strong>Slash commands</strong> — built-ins for session control (e.g. <code>/model</code>, <code>/context</code>, <code>/compact</code>, <code>/permissions</code>); custom commands are Skills surfaced in the <code>/</code> menu.' },
          { p: '<strong>MCP</strong> — configure servers in project settings to add external tools/resources.' },
          { p: '<strong>Hooks</strong> — shell commands wired to lifecycle events in <code>.claude/settings.json</code>: <code>SessionStart</code>, <code>UserPromptSubmit</code>, <code>PreToolUse</code>, <code>PostToolUse</code>, <code>Stop</code>, <code>SubagentStop</code>, <code>PreCompact</code>, <code>SessionEnd</code>, <code>Notification</code>. They run deterministically regardless of the model’s choices.' },
          { code:
            '# .claude/settings.json (illustrative)\n' +
            '{\n' +
            '  "hooks": {\n' +
            '    "PostToolUse": [{ "matcher": "Edit", "command": "npm run lint --silent" }]\n' +
            '  }\n' +
            '}' },
          { tip: 'Reach for a hook when a rule must ALWAYS run (format on edit, block a dangerous command); reach for a Skill when you want reusable guidance the agent applies when relevant.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which is NOT one of Claude Code’s built-in tools?',
        options: ['Read', 'Bash', 'Grep', 'Deploy'],
        answer: 3,
        why: 'The built-ins are Read/Write/Edit/Bash/Glob/Grep/WebSearch/WebFetch; deployment would come via a command, Skill, or MCP.',
        tier: 'Proficient',
      },
      {
        q: 'You want to explore a large codebase and get a proposed refactor plan WITHOUT any files being changed yet. Use:',
        options: ['Auto mode', 'Plan mode', 'Bypass mode', 'Accept Edits mode'],
        answer: 1,
        why: 'Plan mode is read-only: the agent proposes a plan and makes no edits until you approve.',
        tier: 'Proficient',
      },
      {
        q: 'You need code auto-formatted after EVERY edit, no matter what. The right mechanism is:',
        options: ['A Skill', 'A slash command', 'A PostToolUse hook', 'A bigger model'],
        answer: 2,
        why: 'Hooks run deterministically on lifecycle events — a PostToolUse hook enforces the rule regardless of the agent’s choices.',
        tier: 'Expert',
      },
      {
        q: 'CLAUDE.md is best described as:',
        options: [
          'A chat transcript',
          'Project facts & conventions loaded at every session start',
          'A billing file',
          'The list of installed models',
        ],
        answer: 1,
        why: 'CLAUDE.md is durable project context/conventions read at session start — Code’s counterpart to Projects.',
        tier: 'Proficient',
      },
      {
        q: 'The key difference between a Skill and a hook is:',
        options: [
          'Skills cost money; hooks are free',
          'A Skill guides the agent when relevant; a hook enforces a rule automatically',
          'They are the same thing',
          'Hooks only work in chat',
        ],
        answer: 1,
        why: 'Skills provide on-demand guidance; hooks fire deterministically at lifecycle events regardless of what the agent decides.',
        tier: 'Expert',
      },
    ],
  },

  // =========================================================================
  // STAGE 5 — ORCHESTRATION & MASTERY · EXPERT
  // =========================================================================
  {
    id: 'mastery',
    n: 5,
    title: 'Orchestration & Mastery',
    tier: 'Expert',
    dikw: 'Wisdom',
    tagline: 'Subagents, multi-agent patterns, and choosing the right surface + pattern.',
    intro:
      'The top of the ladder isn’t knowing more features — it’s judgment: ' +
      'decomposing work across agents, and instantly picking the right surface ' +
      'and mechanism for a goal. This is the “wisdom” of DIKW.',
    lessons: [
      {
        id: 'subagents',
        title: 'Subagents: delegation with clean context',
        icon: '👥',
        surfaces: ['code', 'cowork'],
        analogy:
          'Sending an intern to the archive to research something and come back ' +
          'with a one-paragraph summary — so your own desk stays clear.',
        simple: [
          { p: 'A <strong>subagent</strong> is a helper the main agent spins up for a focused side-task. It works in its own space and returns just a summary.' },
          { list: [
            'Keeps the main conversation clean — all the digging happens elsewhere.',
            'Can use a cheaper, faster model for the grunt work.',
            'Great for research, code review, or exploring, where you won’t reread the details.',
          ] },
        ],
        mechanics: [
          { p: 'Subagents run in <strong>isolated context windows</strong> with their own tools and system prompt. They preserve the parent’s context by keeping search results, logs, and file reads out of the main thread, and control cost by routing to faster models (e.g. Haiku).' },
          { p: 'The parent delegates a task matching a subagent’s description; the subagent works independently and returns a summary. This is the fix for <em>context bloat</em>.' },
          { tip: 'Delegate to a subagent when a side-task would flood your main context with detail you won’t reference again.' },
        ],
      },
      {
        id: 'multi-agent',
        title: 'Multi-agent orchestration: fan-out & pipeline',
        icon: '🕸️',
        surfaces: ['code', 'cowork'],
        analogy:
          'A project lead splitting work across a team. Sometimes everyone works ' +
          'in parallel (fan-out); sometimes it’s an assembly line where each hands ' +
          'off to the next (pipeline).',
        simple: [
          { p: 'Bigger jobs can be split across several agents working together, coordinated by an orchestrator.' },
          { list: [
            '<strong>Fan-out</strong> — many agents work in parallel on different parts (security, performance, docs), then results are combined.',
            '<strong>Pipeline</strong> — a sequence where each stage feeds the next (research → design → build → review).',
            '<strong>Hybrid</strong> — mix of both.',
          ] },
          { p: 'Use it when a task is large enough that splitting it up is clearer or faster than one agent doing everything.' },
        ],
        mechanics: [
          { p: 'An orchestrator distributes work and aggregates results. <strong>Fan-out</strong> (parallel) is a barrier: wait for all before combining. <strong>Pipeline</strong> runs each item through stages independently — wall-clock is the slowest chain, not the sum of stages.' },
          { list: [
            'Fan-out: independent perspectives on the same target (audit dimensions), then merge/dedupe.',
            'Pipeline: staged transforms where item A can be at stage 3 while B is still at stage 1.',
          ] },
          { p: 'Cowork coordinates sub-agents across parallel workstreams automatically; Claude Code exposes subagents and workflow orchestration explicitly.' },
          { tip: 'Reach for multi-agent only when the task genuinely decomposes — parallelism has coordination cost.' },
        ],
      },
      {
        id: 'output-styles',
        title: 'Output styles & the status line',
        icon: '🎨',
        surfaces: ['code'],
        analogy:
          'Changing who’s in the room — coder, teacher, or writer — and a dashboard ' +
          'light telling you which mode you’re in.',
        simple: [
          { p: '<strong>Output styles</strong> change how Claude Code responds every turn — its role and tone (e.g. an explanatory, teaching style vs. a terse coding style).' },
          { p: 'The <strong>status line</strong> shows your current mode and state at a glance, so you always know how much autonomy is active.' },
        ],
        mechanics: [
          { p: 'Output styles modify the system prompt (stored as markdown in <code>~/.claude/output-styles/</code> or the project’s <code>.claude/output-styles/</code>); built-ins include Default, Explanatory, and Learning. The status line reflects the active permission mode (e.g. plan / accept-edits) and model.' },
          { tip: 'Switch to an explanatory/learning style when you want Claude to teach as it works, not just do the work.' },
        ],
      },
      {
        id: 'capstone',
        title: 'Wisdom: choosing the right surface + pattern',
        icon: '🧭',
        surfaces: ['chat', 'cowork', 'code'],
        analogy:
          'A master craftsperson doesn’t reach for the biggest tool — they reach ' +
          'for the right one, without thinking. That instinct is the goal.',
        simple: [
          { p: 'You now know the pieces. Mastery is picking the right combination fast. A few rules of thumb:' },
          { list: [
            'Thinking, drafting, or making something to look at → <strong>chat</strong> (use Artifacts, Projects).',
            'A whole multi-step task to hand off and review → <strong>Cowork</strong>.',
            'Precise software work and automation → <strong>Claude Code</strong>.',
            'Repeating the same instructions → a <strong>Skill</strong>. Pulling from another system → a <strong>Connector (MCP)</strong>. A rule that must always run → a <strong>hook</strong>. A big side-task → a <strong>subagent</strong>.',
          ] },
          { p: 'That last mapping — problem → mechanism — is exactly what the Decision Playground drills.' },
        ],
        mechanics: [
          { p: 'The expert move is matching capability to need without over-reaching. Map the <em>problem</em> to the <em>mechanism</em>:' },
          { list: [
            'Repeated instructions / procedures → <strong>Skill</strong>.',
            'Manual copy-paste from an external system → <strong>Connector / MCP</strong>.',
            'A deterministic rule (format, validate, block) → <strong>Hook</strong>.',
            'Context bloat from a side-task → <strong>Subagent</strong>.',
            'A large decomposable job → <strong>multi-agent</strong> (fan-out / pipeline).',
            'Choosing autonomy level → <strong>permission / plan mode</strong>.',
          ] },
          { p: 'And the surface by control needed: chat (approachable) → Cowork (delegated autonomy) → Code (full control). This is the DIKW peak: not more facts, but knowing which to apply.' },
          { tip: 'Try the Decision Playground and Concept Map to cement this — they turn the mapping into reflex.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'The main problem subagents solve is:',
        options: [
          'Slow internet',
          'Context bloat — keeping side-task detail out of the main thread',
          'Model pricing errors',
          'Writing longer answers',
        ],
        answer: 1,
        why: 'Subagents run in isolated context and return summaries, preserving the parent’s context (and can use cheaper models).',
        tier: 'Expert',
      },
      {
        q: 'Three agents each review a different dimension of the same codebase in parallel, then results merge. That pattern is:',
        options: ['Pipeline', 'Fan-out', 'A single agent', 'A hook'],
        answer: 1,
        why: 'Parallel agents on the same target with a merge step is fan-out; a pipeline is sequential stage-to-stage.',
        tier: 'Expert',
      },
      {
        q: 'A rule that must run automatically no matter what the agent decides calls for a:',
        options: ['Subagent', 'Hook', 'Output style', 'Bigger model'],
        answer: 1,
        why: 'Hooks fire deterministically on lifecycle events — the enforcement mechanism.',
        tier: 'Expert',
      },
      {
        q: 'The “wisdom” at the top of the ladder is best described as:',
        options: [
          'Memorizing every feature',
          'Knowing which surface and mechanism to apply to a given goal',
          'Always using the most powerful model',
          'Never asking for approval',
        ],
        answer: 1,
        why: 'DIKW’s wisdom is judgment: matching capability to need, not accumulating more facts.',
        tier: 'Expert',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CONCEPT MAP — relationship view. Nodes get a category; conceptmap.js lays
// them out radially (harness center → surfaces ring → concepts ring). Each
// node links to a lesson via {stage, lesson}.
// ---------------------------------------------------------------------------
const CONCEPT_MAP = {
  nodes: [
    { id: 'harness', label: 'The Harness', cat: 'core', def: 'The gather→act→verify agent loop underneath every surface.', ref: { stage: 'foundations', lesson: 'harness' } },

    { id: 'chat', label: 'Claude chat', cat: 'surface', def: 'Conversational agent: Artifacts, Projects, files, web, Skills, Connectors.', ref: { stage: 'chat', lesson: 'good-goals' } },
    { id: 'cowork', label: 'Claude Cowork', cat: 'surface', def: 'Autonomous teammate for multi-step knowledge work; background & parallel.', ref: { stage: 'cowork', lesson: 'delegation' } },
    { id: 'code', label: 'Claude Code', cat: 'surface', def: 'Developer power surface: full tools, modes, memory, automation.', ref: { stage: 'code', lesson: 'tools' } },

    { id: 'models', label: 'Models', cat: 'concept', def: 'Fable / Opus / Sonnet / Haiku — capability vs. cost & speed.', ref: { stage: 'foundations', lesson: 'models' } },
    { id: 'tools', label: 'Tools', cat: 'concept', def: 'The built-in actions: Read/Write/Edit/Bash/Glob/Grep/Web.', ref: { stage: 'code', lesson: 'tools' } },
    { id: 'skills', label: 'Skills', cat: 'concept', def: 'On-demand bundles of reusable know-how (progressive disclosure).', ref: { stage: 'chat', lesson: 'skills-in-apps' } },
    { id: 'mcp', label: 'Connectors / MCP', cat: 'concept', def: 'Open standard linking Claude to external tools & data.', ref: { stage: 'cowork', lesson: 'connectors' } },
    { id: 'hooks', label: 'Hooks', cat: 'concept', def: 'Deterministic rules fired at lifecycle events, regardless of the model.', ref: { stage: 'code', lesson: 'skills-commands-mcp-hooks' } },
    { id: 'memory', label: 'Memory / CLAUDE.md', cat: 'concept', def: 'Persistent context & conventions; context compaction.', ref: { stage: 'code', lesson: 'memory' } },
    { id: 'modes', label: 'Permission / Plan modes', cat: 'concept', def: 'The autonomy dial: Manual → Accept Edits → Plan → Auto.', ref: { stage: 'code', lesson: 'permission-modes' } },
    { id: 'subagents', label: 'Subagents', cat: 'concept', def: 'Isolated helpers that return summaries — fix context bloat.', ref: { stage: 'mastery', lesson: 'subagents' } },
    { id: 'multiagent', label: 'Multi-agent', cat: 'concept', def: 'Fan-out & pipeline orchestration across agents.', ref: { stage: 'mastery', lesson: 'multi-agent' } },
  ],
  edges: [
    { from: 'harness', to: 'chat', label: 'runs in' },
    { from: 'harness', to: 'cowork', label: 'runs in' },
    { from: 'harness', to: 'code', label: 'runs in' },
    { from: 'harness', to: 'tools', label: 'acts via' },
    { from: 'models', to: 'harness', label: 'powers' },
    { from: 'skills', to: 'chat', label: 'extends' },
    { from: 'skills', to: 'cowork', label: 'extends' },
    { from: 'skills', to: 'code', label: 'extends' },
    { from: 'mcp', to: 'cowork', label: 'connects' },
    { from: 'mcp', to: 'code', label: 'connects' },
    { from: 'mcp', to: 'chat', label: 'connects' },
    { from: 'hooks', to: 'code', label: 'enforces in' },
    { from: 'memory', to: 'code', label: 'grounds' },
    { from: 'modes', to: 'code', label: 'gates' },
    { from: 'subagents', to: 'multiagent', label: 'compose into' },
    { from: 'subagents', to: 'code', label: 'spawned by' },
    { from: 'multiagent', to: 'cowork', label: 'used by' },
  ],
};

// ---------------------------------------------------------------------------
// DIAGRAMS — step captions live here; diagrams.js owns the SVG scaffold and
// highlights parts by the `active` ids per step.
// ---------------------------------------------------------------------------
const DIAGRAMS = {
  harness: {
    id: 'harness',
    title: 'The agent loop',
    kind: 'loop',
    nodes: ['goal', 'gather', 'act', 'verify'],
    steps: [
      { active: ['goal'], caption: 'You set a goal. The agent takes it from here.' },
      { active: ['gather'], caption: 'Gather — it reads files, searches, inspects the situation.' },
      { active: ['act'], caption: 'Act — it takes a step: edits, runs, or fetches something.' },
      { active: ['verify'], caption: 'Verify — it checks the result. Not done? Loop back to Gather.' },
      { active: ['verify', 'goal'], caption: 'When the goal is met, it stops and reports back.' },
    ],
  },
  multiagent: {
    id: 'multiagent',
    title: 'Fan-out vs. pipeline',
    kind: 'orchestration',
    steps: [
      { mode: 'fanout', active: ['orch'], caption: 'Fan-out: an orchestrator splits the work…' },
      { mode: 'fanout', active: ['a1', 'a2', 'a3'], caption: '…three agents work in PARALLEL on different parts.' },
      { mode: 'fanout', active: ['merge'], caption: 'Results merge back together (a barrier — wait for all).' },
      { mode: 'pipeline', active: ['s1'], caption: 'Pipeline: work flows through stages…' },
      { mode: 'pipeline', active: ['s2'], caption: '…each stage feeds the next (research → design → build).' },
      { mode: 'pipeline', active: ['s3'], caption: 'Item A can be at stage 3 while B is still at stage 1.' },
    ],
  },
  mcp: {
    id: 'mcp',
    title: 'How a Connector (MCP) works',
    kind: 'handshake',
    steps: [
      { active: ['claude'], caption: 'Claude needs data or an action outside itself.' },
      { active: ['claude', 'arrow1', 'server'], caption: 'It calls a tool on the MCP server (the Connector).' },
      { active: ['server', 'ext'], caption: 'The server talks to the external system (GitHub, DB, drive…).' },
      { active: ['server', 'arrow2', 'claude'], caption: 'Results come back into the loop — no copy-paste.' },
    ],
  },
  hooks: {
    id: 'hooks',
    title: 'Where hooks fire',
    kind: 'lifecycle',
    steps: [
      { active: ['start'], caption: 'SessionStart — set up before anything runs.' },
      { active: ['pre'], caption: 'PreToolUse — validate or block a tool BEFORE it runs.' },
      { active: ['tool'], caption: 'The tool runs (e.g. an Edit).' },
      { active: ['post'], caption: 'PostToolUse — react AFTER (e.g. run the linter).' },
      { active: ['stop'], caption: 'Stop / SessionEnd — clean up when the work ends.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// DECISION PLAYGROUND — a few questions map (via tags) to a recommendation.
// playground.js scores tag hits and picks the top recommendation.
// ---------------------------------------------------------------------------
const PLAYGROUND = {
  intro: 'Answer a few questions and get a recommendation: which surface, and which mechanism, fits your goal.',
  questions: [
    {
      id: 'q1',
      text: 'What are you mainly trying to do?',
      options: [
        { label: 'Think, draft, or make something to look at', tags: ['chat'] },
        { label: 'Hand off a whole multi-step task and review it', tags: ['cowork'] },
        { label: 'Do precise software work or automate something', tags: ['code'] },
      ],
    },
    {
      id: 'q2',
      text: 'Is there a repeated procedure or an external system involved?',
      options: [
        { label: 'I keep repeating the same instructions', tags: ['skill'] },
        { label: 'I keep pulling data from another tool/system', tags: ['mcp'] },
        { label: 'A rule must ALWAYS run (format, validate, block)', tags: ['hook'] },
        { label: 'None of these', tags: [] },
      ],
    },
    {
      id: 'q3',
      text: 'How big is the task, and how much do you trust it to run alone?',
      options: [
        { label: 'Small & focused; I’ll review after', tags: ['auto'] },
        { label: 'Big enough to split into parallel/staged parts', tags: ['multiagent'] },
        { label: 'A heavy side-task that would clutter the main thread', tags: ['subagent'] },
        { label: 'Risky / hard to undo — I want to approve first', tags: ['plan'] },
      ],
    },
  ],
  // Each recommendation matches on tags; playground.js sums matches.
  recommendations: [
    { id: 'chat', when: ['chat'], surface: 'Claude chat', title: 'Work in Claude chat', why: 'Best for thinking, drafting, and interactive outputs (Artifacts). Use a Project for persistent context.', ref: { stage: 'chat', lesson: 'good-goals' } },
    { id: 'cowork', when: ['cowork'], surface: 'Claude Cowork', title: 'Delegate in Claude Cowork', why: 'Hand off the whole task; it runs multi-step work, even in the background, and you review the result.', ref: { stage: 'cowork', lesson: 'delegation' } },
    { id: 'code', when: ['code'], surface: 'Claude Code', title: 'Use Claude Code', why: 'Full control over tools, permissions, memory, and automation for precise software work.', ref: { stage: 'code', lesson: 'tools' } },
    { id: 'skill', when: ['skill'], surface: 'any surface', title: 'Package it as a Skill', why: 'A Skill turns a repeated procedure into reusable, on-demand know-how across chat, Cowork, and Code.', ref: { stage: 'chat', lesson: 'skills-in-apps' } },
    { id: 'mcp', when: ['mcp'], surface: 'any surface', title: 'Add a Connector (MCP)', why: 'Stop copy-pasting — connect the external system so Claude can read and act there directly.', ref: { stage: 'cowork', lesson: 'connectors' } },
    { id: 'hook', when: ['hook'], surface: 'Claude Code', title: 'Enforce it with a Hook', why: 'Hooks fire deterministically at lifecycle events, so the rule always runs regardless of the model’s choices.', ref: { stage: 'code', lesson: 'skills-commands-mcp-hooks' } },
    { id: 'subagent', when: ['subagent'], surface: 'Code / Cowork', title: 'Delegate to a Subagent', why: 'Keeps heavy side-task detail out of your main context and can use a cheaper, faster model.', ref: { stage: 'mastery', lesson: 'subagents' } },
    { id: 'multiagent', when: ['multiagent'], surface: 'Code / Cowork', title: 'Orchestrate multiple agents', why: 'Split a large, decomposable job across agents — fan-out (parallel) or pipeline (staged).', ref: { stage: 'mastery', lesson: 'multi-agent' } },
    { id: 'plan', when: ['plan'], surface: 'Claude Code', title: 'Use Plan mode / approval gates', why: 'For risky or irreversible work, let the agent propose a plan and gate the action behind your approval.', ref: { stage: 'code', lesson: 'permission-modes' } },
    { id: 'auto', when: ['auto'], surface: 'context-dependent', title: 'Let it run, then review', why: 'For small, reversible tasks, minimal prompting keeps you in flow — just review the result.', ref: { stage: 'code', lesson: 'permission-modes' } },
  ],
};
