// playground.js — "which surface + mechanism should I use?" decision tool.
// Questions/recommendations are data-driven (PLAYGROUND). Answers accumulate
// tags; the surface tag (chat/cowork/code) picks the surface, and a priority
// order over mechanism tags picks the mechanism.


const MECH_ORDER = ['skill', 'mcp', 'hook', 'multiagent', 'subagent', 'plan', 'auto'];
const SURFACE_TAGS = ['chat', 'cowork', 'code'];

function renderPlayground(container) {
  const selections = {}; // qId -> optionIndex

  function draw() {
    const allAnswered = PLAYGROUND.questions.every((q) => selections[q.id] !== undefined);
    container.innerHTML = `
      <div class="pg-hero">
        <h1>🎛️ Decision playground</h1>
        <p>${esc(PLAYGROUND.intro)}</p>
      </div>
      ${PLAYGROUND.questions.map(questionHTML).join('')}
      <div class="pg-actions">
        <button class="pg-btn" data-role="go" ${allAnswered ? '' : 'disabled'}>See my recommendation →</button>
        <button class="pg-btn ghost" data-role="reset">Start over</button>
      </div>
      <div id="pg-result"></div>`;
    wire();
  }

  function questionHTML(q) {
    return `<div class="pg-q" data-q="${q.id}">
      <div class="pg-q-text">${esc(q.text)}</div>
      <div class="pg-opts">
        ${q.options.map((o, i) =>
          `<button class="pg-opt ${selections[q.id] === i ? 'sel' : ''}" data-opt="${i}">${esc(o.label)}</button>`
        ).join('')}
      </div>
    </div>`;
  }

  function compute() {
    const tags = new Set();
    PLAYGROUND.questions.forEach((q) => {
      const idx = selections[q.id];
      if (idx !== undefined) (q.options[idx].tags || []).forEach((t) => tags.add(t));
    });
    const surfaceId = SURFACE_TAGS.find((t) => tags.has(t)) || 'chat';
    const mechId = MECH_ORDER.find((t) => tags.has(t));
    const surface = PLAYGROUND.recommendations.find((r) => r.id === surfaceId);
    const mech = mechId ? PLAYGROUND.recommendations.find((r) => r.id === mechId) : null;
    return { surface, mech };
  }

  function showResult() {
    const { surface, mech } = compute();
    const box = container.querySelector('#pg-result');
    box.innerHTML = `
      <div class="pg-result">
        <div class="pr-eyebrow">Recommended surface</div>
        <h2>${esc(surface.title)}</h2>
        <div class="pg-surface">Use: ${esc(surface.surface)}</div>
        <p class="pr-why">${esc(surface.why)}</p>
        <button class="pg-btn" data-goto data-stage="${surface.ref.stage}" data-lesson="${surface.ref.lesson}">Open the lesson →</button>
        ${mech ? `
          <div class="pg-secondary">
            <b>And the mechanism:</b> ${esc(mech.title)} — ${esc(mech.why)}
            <div style="margin-top:.5rem"><button class="pg-btn ghost" data-goto data-stage="${mech.ref.stage}" data-lesson="${mech.ref.lesson}">Open “${esc(mech.title)}” →</button></div>
          </div>` : ''}
      </div>`;
    box.querySelectorAll('[data-goto]').forEach((b) =>
      b.addEventListener('click', () => gotoLesson(b.dataset.stage, b.dataset.lesson)));
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function wire() {
    container.querySelectorAll('.pg-q').forEach((qEl) => {
      const qId = qEl.dataset.q;
      qEl.querySelectorAll('.pg-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          selections[qId] = Number(btn.dataset.opt);
          qEl.querySelectorAll('.pg-opt').forEach((b) => b.classList.toggle('sel', b === btn));
          const go = container.querySelector('[data-role="go"]');
          go.disabled = !PLAYGROUND.questions.every((q) => selections[q.id] !== undefined);
        });
      });
    });
    container.querySelector('[data-role="go"]').addEventListener('click', showResult);
    container.querySelector('[data-role="reset"]').addEventListener('click', () => {
      for (const k of Object.keys(selections)) delete selections[k];
      draw();
    });
  }

  draw();
}
