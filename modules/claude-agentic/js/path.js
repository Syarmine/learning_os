// path.js — the guided linear curriculum (the default view). Renders the stage
// rail, lessons (analogy + current-lens content + embedded diagrams), and a
// per-stage quiz (delegated to quiz.js). Progression is tracked via quiz
// clears; content is never hard-locked, so explorers can read anything.


// Which lessons embed an animated diagram (lesson id -> diagram id).
const LESSON_DIAGRAM = {
  harness: 'harness',
  delegation: 'agents',
  extend: 'extensions',
  connectors: 'mcp',
  'multi-agent': 'multiagent',
  'skills-commands-mcp-hooks': 'hooks',
};

let mount = null;
const openStages = new Set();
const openLessons = new Set();

function lkey(s, l) { return `${s}/${l}`; }

function lessonHTML(stage, lesson) {
  const lens = Store.lens();
  const blocks = lesson[lens] || lesson.simple;
  const done = Store.isLessonDone(stage.id, lesson.id);
  const isOpen = openLessons.has(lkey(stage.id, lesson.id));
  const diagramId = LESSON_DIAGRAM[lesson.id];
  return `
    <div class="lesson ${isOpen ? 'is-open' : ''} ${done ? 'is-done' : ''}"
         data-stage="${stage.id}" data-lesson="${lesson.id}">
      <button class="lesson-head" data-role="lesson-toggle">
        <span class="lesson-icon">${lesson.icon}</span>
        <span class="lesson-title">${lesson.title}</span>
        ${surfacePills(lesson.surfaces)}
        <span class="lesson-check" title="${done ? 'Completed' : 'Not yet marked done'}">${done ? '✔' : '○'}</span>
        <span class="lesson-chevron">›</span>
      </button>
      <div class="lesson-body">
        <div class="analogy">${lesson.analogy}</div>
        <div class="lens-body" data-lens="${lens}">${renderBlocks(blocks)}</div>
        ${diagramId ? `<div class="diagram-slot" data-diagram="${diagramId}"></div>` : ''}
        <button class="lesson-mark" data-role="lesson-mark">
          ${done ? '✔ Marked done — click to undo' : 'Mark this lesson done'}
        </button>
      </div>
    </div>`;
}

function stageHTML(stage, index) {
  const cleared = Store.isStageCleared(stage);
  const score = Store.stageScore(stage);
  const isOpen = openStages.has(stage.id);
  const upNext = !cleared && index === Store.clearedCount(); // first uncleared
  return `
    <div class="stage-card ${isOpen ? 'is-open' : ''} ${cleared ? 'is-complete' : ''}" data-stage="${stage.id}" data-index="${index}">
      <button class="stage-head" data-role="stage-toggle">
        <span class="stage-num">${cleared ? '✓' : stage.n}</span>
        <span class="stage-meta">
          <span class="stage-title">${stage.title}
            <span class="stage-tier">${stage.tier}</span>
            ${upNext ? '<span class="stage-tier" style="color:var(--accent-2);background:color-mix(in srgb,var(--accent-2) 12%,transparent)">Up next</span>' : ''}
          </span>
          <span class="stage-tag">${stage.tagline}</span>
        </span>
        <span class="stage-status ${cleared ? 'done' : ''}">${cleared ? 'Cleared ✓' : `Quiz ${score.correct}/${score.total}`}</span>
        <span class="stage-chevron">›</span>
      </button>
      <div class="stage-body">
        <p class="stage-intro">${stage.intro}</p>
        ${stage.lessons.map((l) => lessonHTML(stage, l)).join('')}
        <div class="quiz-slot" data-stage="${stage.id}"></div>
      </div>
    </div>`;
}

function renderPath(container) {
  mount = container || mount;
  if (openStages.size === 0) openStages.add(Store.openStage() || STAGES[0].id);

  mount.innerHTML = `
    <div class="path-hero">
      <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);font-weight:800">Guided path · basic → advanced</div>
      <h1>${MODULE.title}</h1>
      <p>${MODULE.blurb} Work top to bottom, or jump around — clearing each stage's quiz raises your mastery tier.</p>
    </div>
    <div class="stage-rail">
      ${STAGES.map((s, i) => stageHTML(s, i)).join('')}
    </div>`;

  // Mount embedded diagrams.
  mount.querySelectorAll('.diagram-slot').forEach((slot) => {
    mountDiagram(slot.dataset.diagram, slot);
  });
  // Mount quizzes.
  mount.querySelectorAll('.quiz-slot').forEach((slot) => {
    const stage = STAGES.find((s) => s.id === slot.dataset.stage);
    renderQuiz(stage, slot, onStageProgress);
  });

  attachHandlers();
}

function attachHandlers() {
  mount.onclick = (e) => {
    const stageToggle = e.target.closest('[data-role="stage-toggle"]');
    if (stageToggle) {
      const card = stageToggle.closest('.stage-card');
      const id = card.dataset.stage;
      if (openStages.has(id)) openStages.delete(id); else openStages.add(id);
      card.classList.toggle('is-open');
      Store.setOpenStage(id);
      return;
    }
    const lessonToggle = e.target.closest('[data-role="lesson-toggle"]');
    if (lessonToggle) {
      const l = lessonToggle.closest('.lesson');
      const k = lkey(l.dataset.stage, l.dataset.lesson);
      if (openLessons.has(k)) openLessons.delete(k); else openLessons.add(k);
      l.classList.toggle('is-open');
      return;
    }
    const mark = e.target.closest('[data-role="lesson-mark"]');
    if (mark) {
      const l = mark.closest('.lesson');
      Store.toggleLesson(l.dataset.stage, l.dataset.lesson);
      const done = Store.isLessonDone(l.dataset.stage, l.dataset.lesson);
      l.classList.toggle('is-done', done);
      l.querySelector('.lesson-check').textContent = done ? '✔' : '○';
      mark.textContent = done ? '✔ Marked done — click to undo' : 'Mark this lesson done';
      return;
    }
    const next = e.target.closest('[data-role="next-stage"]');
    if (next) {
      const targetIdx = Number(next.dataset.next);
      const target = STAGES[targetIdx];
      if (!target) return;
      openStages.add(target.id);
      Store.setOpenStage(target.id);
      renderPath(mount);
      requestAnimationFrame(() => {
        const card = mount.querySelector(`.stage-card[data-stage="${target.id}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
}

// Called by quiz.js after each answer; when a stage flips to cleared we
// re-render the rail so the "cleared" badge + next-stage button appear.
let lastClearedCount = Store.clearedCount();
function onStageProgress() {
  const now = Store.clearedCount();
  if (now !== lastClearedCount) {
    lastClearedCount = now;
    renderPath(mount);
  }
}

// Cross-view entry point: open a specific lesson (from map / playground).
function openLessonInPath(stageId, lessonId) {
  openStages.add(stageId);
  openLessons.add(lkey(stageId, lessonId));
  renderPath(mount);
  requestAnimationFrame(() => {
    const el = mount.querySelector(`.lesson[data-stage="${stageId}"][data-lesson="${lessonId}"]`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('is-open'); }
  });
}
