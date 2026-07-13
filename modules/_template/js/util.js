// util.js — small, generic rendering helpers shared across views.

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Content-block renderer. Blocks authored in data.js are trusted; text fields
// may contain inline <code>/<strong>/<em>. `code` is escaped.
//   { p } { list } { steps } { code } { tip }
//   { h:'Subheading' }
//   { compare: { a:{label, points:[…]}, b:{label, points:[…]} } }   two side-by-side cards
function renderBlocks(blocks = []) {
  return blocks.map((b) => {
    if (b.p) return `<p class="block-p">${b.p}</p>`;
    if (b.h) return `<h4 class="block-h">${b.h}</h4>`;
    if (b.list) return `<ul class="block-list">${b.list.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    if (b.steps) return `<ol class="block-steps">${b.steps.map((i) => `<li>${i}</li>`).join('')}</ol>`;
    if (b.code) return `<pre class="block-code">${esc(b.code)}</pre>`;
    if (b.tip) return `<div class="block-tip"><span>${b.tip}</span></div>`;
    if (b.compare) return renderCompare(b.compare);
    return '';
  }).join('');
}

// Two-column "this, not that" comparison. `a` reads as the weaker/old way,
// `b` as the better/new way (styled accordingly).
function renderCompare(c) {
  const col = (side, kind) => `
    <div class="cmp-col ${kind}">
      <div class="cmp-label">${side.label}</div>
      <ul class="cmp-points">${(side.points || []).map((p) => `<li>${p}</li>`).join('')}</ul>
    </div>`;
  return `<div class="block-compare">${col(c.a, 'before')}<div class="cmp-vs">vs</div>${col(c.b, 'after')}</div>`;
}

function surfacePills(surfaces = []) {
  const names = { chat: 'Chat', cowork: 'Cowork', code: 'Code' };
  return `<span class="lesson-surfaces">${surfaces
    .map((s) => `<span class="surface-pill ${s}" title="Applies to Claude ${names[s]}">${names[s]}</span>`)
    .join('')}</span>`;
}

// Decoupled navigation: any view can request jumping to a lesson in the path.
function gotoLesson(stage, lesson) {
  window.dispatchEvent(new CustomEvent('goto-lesson', { detail: { stage, lesson } }));
}

let toastTimer;
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// SVG helper: build an element with attributes + children.
function svg(tag, attrs = {}, children = []) {
  const NS = 'http://www.w3.org/2000/svg';
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  for (const c of [].concat(children)) if (c) e.appendChild(c);
  return e;
}
