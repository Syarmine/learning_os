// state.js — progress + preferences, persisted in localStorage, namespaced by
// module id so multiple modules never collide. Theme is global (shared).
// A tiny pub/sub lets views re-render on change.


const NS = `learning:${MODULE.id}`;
const THEME_KEY = 'learning:theme'; // global across modules

const DEFAULTS = {
  onboarded: false,
  lens: 'simple',            // 'simple' | 'mechanics'
  start: 'foundations',
  lessonsDone: {},           // `${stageId}/${lessonId}` -> true
  answers: {},               // stageId -> { qIndex -> chosenIndex }
  openStage: null,           // last-opened stage id (for path view)
  view: 'path',              // 'path' | 'map' | 'playground'
};

function safeParse(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

const subs = new Set();
let data = { ...DEFAULTS, ...safeParse(localStorage.getItem(NS), {}) };
// deep-merge nested objects that may be missing keys
data.lessonsDone = data.lessonsDone || {};
data.answers = data.answers || {};

function persist() {
  try { localStorage.setItem(NS, JSON.stringify(data)); } catch { /* ignore quota */ }
}
function emit() { subs.forEach((fn) => fn(data)); }
function set(patch) { data = { ...data, ...patch }; persist(); emit(); }

const Store = {
  // ---- subscription ----
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

  // ---- raw access ----
  get() { return data; },

  // ---- onboarding ----
  isOnboarded() { return !!data.onboarded; },
  completeOnboarding({ lens, start }) {
    set({ onboarded: true, lens: lens || data.lens, start: start || 'foundations', openStage: start || 'foundations' });
  },

  // ---- lens ----
  lens() { return data.lens; },
  setLens(lens) { if (lens !== data.lens) set({ lens }); },

  // ---- view ----
  view() { return data.view; },
  setView(view) { set({ view }); },
  openStage() { return data.openStage; },
  setOpenStage(id) { set({ openStage: id }); },

  // ---- lessons ----
  lessonKey(stageId, lessonId) { return `${stageId}/${lessonId}`; },
  isLessonDone(stageId, lessonId) { return !!data.lessonsDone[this.lessonKey(stageId, lessonId)]; },
  toggleLesson(stageId, lessonId) {
    const k = this.lessonKey(stageId, lessonId);
    const next = { ...data.lessonsDone };
    if (next[k]) delete next[k]; else next[k] = true;
    set({ lessonsDone: next });
  },

  // ---- quiz ----
  answer(stageId, qIndex) {
    const s = data.answers[stageId];
    return s ? s[qIndex] : undefined;
  },
  recordAnswer(stageId, qIndex, chosen) {
    const stageAns = { ...(data.answers[stageId] || {}) };
    if (stageAns[qIndex] !== undefined) return; // answers lock once chosen
    stageAns[qIndex] = chosen;
    set({ answers: { ...data.answers, [stageId]: stageAns } });
  },
  stageScore(stage) {
    const ans = data.answers[stage.id] || {};
    let correct = 0, answered = 0;
    stage.quiz.forEach((q, i) => {
      if (ans[i] !== undefined) { answered++; if (ans[i] === q.answer) correct++; }
    });
    return { correct, answered, total: stage.quiz.length };
  },
  isStageCleared(stage) {
    const { correct, total } = this.stageScore(stage);
    return total > 0 && correct / total >= PASS_RATIO;
  },

  // ---- progression (Dreyfus tier + DIKW) ----
  // A stage index is "unlocked" if every earlier stage is cleared.
  unlockedThrough() {
    let idx = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (i === 0) { idx = 0; continue; }
      if (this.isStageCleared(STAGES[i - 1])) idx = i; else break;
    }
    return idx; // highest index reachable
  },
  isStageUnlocked(stageIndex) { return stageIndex <= this.unlockedThrough(); },
  clearedCount() { return STAGES.filter((s) => this.isStageCleared(s)).length; },
  // Current tier = the tier of the highest cleared stage (or Novice at start).
  currentTier() {
    const cleared = this.clearedCount();
    return TIERS[Math.min(cleared, TIERS.length - 1)];
  },
  // DIKW meter: one segment per stage cleared (Data→Wisdom across 4 marks,
  // but we map 5 stages onto 4 DIKW marks by clamping).
  dikwFilled() { return Math.min(this.clearedCount(), DIKW.length); },

  // ---- theme (global) ----
  theme() { return localStorage.getItem(THEME_KEY) || 'auto'; },
  cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(this.theme()) + 1) % order.length];
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
    emit();
    return next;
  },
  applyTheme() { document.documentElement.setAttribute('data-theme', this.theme()); },

  // ---- reset ----
  reset() {
    data = { ...DEFAULTS, lessonsDone: {}, answers: {} };
    persist(); emit();
  },
};
