// app.js — bootstrap: onboarding, header controls, view switching, header
// progress display. Views own their own DOM; the header updates via a
// subscription without re-rendering the views.


const els = {
  onboarding: document.getElementById('onboarding'),
  obChoices: document.getElementById('ob-choices'),
  obSkip: document.getElementById('ob-skip'),
  lensToggle: document.getElementById('lens-toggle'),
  themeToggle: document.getElementById('theme-toggle'),
  resetBtn: document.getElementById('reset-btn'),
  viewnav: document.getElementById('viewnav'),
  dikw: document.getElementById('dikw-meter'),
  tierBadge: document.getElementById('tier-badge'),
  views: {
    path: document.getElementById('view-path'),
    map: document.getElementById('view-map'),
    playground: document.getElementById('view-playground'),
    challenge: document.getElementById('view-challenge'),
  },
};

const rendered = { path: false, map: false, playground: false, challenge: false };

// ---------------- Header ----------------
function buildDikw() {
  els.dikw.innerHTML =
    `<div style="display:flex;flex-direction:column;gap:2px">
       <div style="display:flex;gap:4px">${DIKW.map(() => '<span class="dikw-seg"></span>').join('')}</div>
     </div>`;
}
function updateHeader() {
  const filled = Store.dikwFilled();
  els.dikw.querySelectorAll('.dikw-seg').forEach((seg, i) => seg.classList.toggle('on', i < filled));
  els.dikw.title = `Journey: ${DIKW.join(' → ')} — ${DIKW[Math.max(0, filled - 1)] || 'Data'} reached`;

  els.tierBadge.querySelector('.tier-label').textContent = Store.currentTier();
  const idx = TIERS.indexOf(Store.currentTier());
  els.tierBadge.title = `Mastery tier ${idx + 1} of ${TIERS.length}: ${Store.currentTier()}`;

  els.lensToggle.querySelectorAll('.lens-btn').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.lens === Store.lens())));
}

// ---------------- Views ----------------
function showView(view) {
  Store.setView(view);
  for (const [k, node] of Object.entries(els.views)) node.hidden = k !== view;
  els.viewnav.querySelectorAll('.viewnav-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
  if (!rendered[view]) renderView(view);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderView(view) {
  if (view === 'path') renderPath(els.views.path);
  if (view === 'map') renderMap(els.views.map);
  if (view === 'playground') renderPlayground(els.views.playground);
  if (view === 'challenge') renderChallenge(els.views.challenge);
  rendered[view] = true;
}
// Called by path.js when progression changes so other views rebuild lazily.
function invalidateViews() {
  rendered.map = false;
  rendered.playground = false;
  rendered.challenge = false;
}

// ---------------- Onboarding ----------------
function showOnboarding() { els.onboarding.hidden = false; }
function hideOnboarding() { els.onboarding.hidden = true; }

// ---------------- Wiring ----------------
function wire() {
  els.obChoices.querySelectorAll('.ob-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      Store.completeOnboarding({ lens: btn.dataset.lens, start: btn.dataset.start });
      hideOnboarding();
      renderView('path'); showView('path');
      updateHeader();
    });
  });
  els.obSkip.addEventListener('click', () => {
    Store.completeOnboarding({ lens: Store.lens(), start: 'foundations' });
    hideOnboarding();
    renderView('path'); showView('path');
    updateHeader();
  });

  els.lensToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.lens-btn'); if (!btn) return;
    Store.setLens(btn.dataset.lens);
    updateHeader();
    // Re-render path lens content in place (path handles preserving open state).
    if (Store.view() === 'path') renderPath(els.views.path);
  });

  els.themeToggle.addEventListener('click', () => {
    const t = Store.cycleTheme();
    toast(`Theme: ${t}`);
  });

  els.resetBtn.addEventListener('click', () => {
    if (!confirm('Reset all your progress in this module? This clears completed lessons and quiz scores.')) return;
    Store.reset();
    invalidateViews();
    updateHeader();
    renderPath(els.views.path);
    showView('path');
    toast('Progress reset');
  });

  els.viewnav.addEventListener('click', (e) => {
    const btn = e.target.closest('.viewnav-btn'); if (!btn) return;
    showView(btn.dataset.view);
  });

  // Cross-view navigation (map / playground → open a specific lesson).
  window.addEventListener('goto-lesson', (e) => {
    const { stage, lesson } = e.detail;
    Store.setOpenStage(stage);
    if (!rendered.path) { renderPath(els.views.path); rendered.path = true; }
    showView('path');
    // wait a frame for the path view to be visible, then open + scroll
    requestAnimationFrame(() => openLessonInPath(stage, lesson));
  });

  // Header reflects any progress change.
  Store.subscribe(updateHeader);
}

// ---------------- Init ----------------
function init() {
  document.title = `${MODULE.title} — Interactive Course`;
  Store.applyTheme();
  buildDikw();
  updateHeader();
  wire();

  if (!Store.isOnboarded()) {
    showOnboarding();
  } else {
    renderView('path');
    showView(Store.view() || 'path');
  }
}

init();
