// conceptmap.js — relationship explorer. Radial layout: the harness at the
// centre, the three surfaces on an inner ring, concepts on an outer ring.
// Click a node to see its definition, its relationships, and jump to its lesson.


const CX = 320, CY = 252, R1 = 118, R2 = 214;

function wrap(label) {
  if (label.length <= 12) return [label];
  if (label.includes(' / ')) return label.split(' / ');
  const words = label.split(' ');
  if (words.length === 1) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function layout(nodes) {
  const pos = {};
  const core = nodes.filter((n) => n.cat === 'core');
  const surf = nodes.filter((n) => n.cat === 'surface');
  const conc = nodes.filter((n) => n.cat === 'concept');
  core.forEach((n) => { pos[n.id] = { x: CX, y: CY, r: 36 }; });
  surf.forEach((n, i) => {
    const a = (-90 + (360 / surf.length) * i) * Math.PI / 180;
    pos[n.id] = { x: CX + R1 * Math.cos(a), y: CY + R1 * Math.sin(a), r: 30 };
  });
  conc.forEach((n, i) => {
    const a = (-90 + (360 / conc.length) * i) * Math.PI / 180;
    pos[n.id] = { x: CX + R2 * Math.cos(a), y: CY + R2 * Math.sin(a), r: 25 };
  });
  return pos;
}

function renderMap(container) {
  const { nodes, edges } = CONCEPT_MAP;
  const pos = layout(nodes);

  const edgeSVG = edges.map((e, i) => {
    const a = pos[e.from], b = pos[e.to];
    if (!a || !b) return '';
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    return `<g class="edge-group" data-edge="${i}" data-from="${e.from}" data-to="${e.to}">
      <line class="map-edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>
      <text class="map-edge-label" x="${mx}" y="${my}" text-anchor="middle" style="display:none">${esc(e.label)}</text>
    </g>`;
  }).join('');

  const nodeSVG = nodes.map((n) => {
    const p = pos[n.id];
    const lines = wrap(n.label);
    const fs = n.cat === 'core' ? 13 : 11;
    const texts = lines.map((ln, li) =>
      `<text x="${p.x}" y="${p.y + (li - (lines.length - 1) / 2) * (fs + 1) + 4}" text-anchor="middle" font-size="${fs}">${esc(ln)}</text>`
    ).join('');
    return `<g class="map-node ${n.cat}" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(n.label)}">
      <circle cx="${p.x}" cy="${p.y}" r="${p.r}" stroke-width="2"/>
      ${texts}
    </g>`;
  }).join('');

  container.innerHTML = `
    <div class="map-hero">
      <h1>🕸️ Concept map</h1>
      <p>How the pieces relate. The <strong>harness</strong> sits at the centre; the three <strong>surfaces</strong> ring it; the <strong>concepts</strong> extend outward. Tap any node.</p>
    </div>
    <div class="map-wrap">
      <div class="map-stage">
        <svg viewBox="0 0 640 504" role="group" aria-label="Concept map of Claude's agentic features">
          <g class="edges">${edgeSVG}</g>
          <g class="nodes">${nodeSVG}</g>
        </svg>
        <div class="map-legend" style="padding:.7rem 1rem 1rem">
          <span><i style="background:var(--accent)"></i> Core loop</span>
          <span><i style="background:var(--accent-2)"></i> Surfaces</span>
          <span><i style="background:var(--accent-3)"></i> Concepts</span>
        </div>
      </div>
      <div class="map-detail" id="map-detail"></div>
    </div>`;

  const svg = container.querySelector('svg');
  const detail = container.querySelector('#map-detail');

  function select(id) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    svg.querySelectorAll('.map-node').forEach((g) => g.classList.toggle('sel', g.dataset.id === id));
    svg.querySelectorAll('.edge-group').forEach((g) => {
      const hot = g.dataset.from === id || g.dataset.to === id;
      g.querySelector('.map-edge').classList.toggle('hot', hot);
      g.querySelector('.map-edge-label').style.display = hot ? '' : 'none';
    });

    const rels = edges.filter((e) => e.from === id || e.to === id).map((e) => {
      const otherId = e.from === id ? e.to : e.from;
      const other = nodes.find((n) => n.id === otherId);
      const dir = e.from === id ? '→' : '←';
      return `<li>${dir} <strong>${esc(e.label)}</strong> · ${esc(other ? other.label : otherId)}</li>`;
    }).join('');

    detail.innerHTML = `
      <div class="md-eyebrow">${node.cat === 'core' ? 'Core loop' : node.cat === 'surface' ? 'Surface' : 'Concept'}</div>
      <h3>${esc(node.label)}</h3>
      <p>${esc(node.def)}</p>
      <div class="md-rels"><strong>Relationships</strong><ul>${rels || '<li>—</li>'}</ul></div>
      ${node.ref ? `<button class="map-goto" data-stage="${node.ref.stage}" data-lesson="${node.ref.lesson}">Open the lesson →</button>` : ''}`;

    const goto = detail.querySelector('.map-goto');
    if (goto) goto.addEventListener('click', () => gotoLesson(goto.dataset.stage, goto.dataset.lesson));
  }

  svg.querySelectorAll('.map-node').forEach((g) => {
    g.addEventListener('click', () => select(g.dataset.id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); } });
  });

  select('harness'); // default selection
}
