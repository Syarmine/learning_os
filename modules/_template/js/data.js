// ============================================================================
// data.js — TEMPLATE. This is the ONLY file you must rewrite to make a new
// learning module. The engine (app/path/state/quiz/conceptmap/diagrams/
// conceptmap/playground/util) is generic and renders everything from the
// exports below. Keep the export NAMES identical; change the content.
//
// Quickstart:
//   1) cp -r modules/_template modules/<your-id>
//   2) edit MODULE.id to "<your-id>" and fill in STAGES/CONCEPT_MAP/PLAYGROUND
//   3) add an entry to /modules.js so the hub links your module
//
// Content-block shapes usable inside simple[]/mechanics[]:
//   { p:'…' }  { list:['…'] }  { steps:['…'] }  { code:'…' }  { tip:'…' }
// (p/list/steps/tip may contain inline <code>/<strong>/<em>.)
// ============================================================================

const MODULE = {
  id: 'template',                 // <-- change to your folder id
  title: 'New Learning Module',
  subtitle: 'a one-line subtitle',
  blurb: 'A short description shown on the path hero.',
};

// 5 stages map onto these 5 tiers and 4 DIKW marks. Keep 5 stages for the
// tier mapping to line up (or adjust; the engine clamps gracefully).
const TIERS = ['Novice', 'Advanced Beginner', 'Competent', 'Proficient', 'Expert'];
const DIKW = ['Data', 'Information', 'Knowledge', 'Wisdom'];
const PASS_RATIO = 0.6; // fraction of a stage's quiz needed to clear it

const STAGES = [
  {
    id: 'stage-one',
    n: 1,
    title: 'First Stage',
    tier: 'Novice',
    dikw: 'Data',
    tagline: 'One line describing this stage.',
    intro: 'A short paragraph introducing the stage.',
    lessons: [
      {
        id: 'lesson-a',
        title: 'A first concept',
        icon: '🌱',
        surfaces: [],               // e.g. ['chat'] — renders little pills; [] hides them
        analogy: 'A plain-language analogy that always shows, regardless of lens.',
        simple: [
          { p: 'Plain-language explanation for non-technical learners.' },
          { list: ['point one', 'point two'] },
        ],
        mechanics: [
          { p: 'A more technical explanation for the “Show the mechanics” lens.' },
          { code: 'example --illustrative' },
          { tip: 'A highlighted takeaway.' },
        ],
      },
    ],
    quiz: [
      {
        q: 'A sample question?',
        options: ['Wrong', 'Right', 'Wrong', 'Wrong'],
        answer: 1,
        why: 'Explanation shown after answering.',
        tier: 'Novice',
      },
    ],
  },
  {
    id: 'stage-two',
    n: 2,
    title: 'Second Stage',
    tier: 'Advanced Beginner',
    dikw: 'Information',
    tagline: 'The next step up.',
    intro: 'Introduce the second stage.',
    lessons: [
      {
        id: 'lesson-b',
        title: 'A second concept',
        icon: '⚡',
        surfaces: [],
        analogy: 'Another analogy.',
        simple: [{ p: 'Simple explanation.' }],
        mechanics: [{ p: 'Technical explanation.' }],
      },
    ],
    quiz: [
      {
        q: 'Another question?',
        options: ['Right', 'Wrong'],
        answer: 0,
        why: 'Because…',
        tier: 'Advanced Beginner',
      },
    ],
  },
];

// Concept map: nodes get a cat ('core' | 'surface' | 'concept') and an optional
// { stage, lesson } ref to deep-link into a lesson. Layout is automatic.
const CONCEPT_MAP = {
  nodes: [
    { id: 'root', label: 'Core Idea', cat: 'core', def: 'The central concept.', ref: { stage: 'stage-one', lesson: 'lesson-a' } },
    { id: 'branch', label: 'A Concept', cat: 'concept', def: 'A related idea.', ref: { stage: 'stage-two', lesson: 'lesson-b' } },
  ],
  edges: [
    { from: 'root', to: 'branch', label: 'relates to' },
  ],
};

// Diagrams are OPTIONAL. Leave empty to disable embedded animations. To add
// one, define a DIAGRAMS[id] here AND a matching SVG scaffold + lesson mapping
// in diagrams.js / path.js (see modules/claude-agentic for a worked example).
const DIAGRAMS = {};

// Decision playground: questions accumulate tags; recommendations match on tags.
const PLAYGROUND = {
  intro: 'Answer a few questions to get a recommendation.',
  questions: [
    {
      id: 'q1',
      text: 'A branching question?',
      options: [
        { label: 'Option that suggests A', tags: ['a'] },
        { label: 'Option that suggests B', tags: ['b'] },
      ],
    },
  ],
  recommendations: [
    { id: 'a', when: ['a'], surface: 'path A', title: 'Do A', why: 'Because A fits.', ref: { stage: 'stage-one', lesson: 'lesson-a' } },
    { id: 'b', when: ['b'], surface: 'path B', title: 'Do B', why: 'Because B fits.', ref: { stage: 'stage-two', lesson: 'lesson-b' } },
  ],
};
