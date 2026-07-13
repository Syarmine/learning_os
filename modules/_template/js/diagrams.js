// diagrams.js — step-through animated SVG diagrams. The SVG scaffolds live here;
// step captions + which parts are "active" per step live in data.js (DIAGRAMS).
// A node is a <g class="diagram-node" data-id="..."> — inactive nodes dim,
// active ones highlight their inner .dg-box / .dg-edge / .dg-arrow.


// ---- reusable SVG snippets ----
function box(id, x, y, w, h, title, sub) {
  const cx = x + w / 2;
  return `<g class="diagram-node" data-id="${id}">
    <rect class="dg-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="11"/>
    <text class="dg-text" x="${cx}" y="${y + (sub ? h / 2 - 2 : h / 2 + 4)}" text-anchor="middle">${esc(title)}</text>
    ${sub ? `<text class="dg-sub" x="${cx}" y="${y + h / 2 + 13}" text-anchor="middle">${esc(sub)}</text>` : ''}
  </g>`;
}
function arrow(x1, y1, x2, y2, id) {
  // simple straight arrow; wrap in node group only if id given (highlightable)
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - Math.cos(ang) * 2, ay = y2 - Math.sin(ang) * 2;
  const s = 6;
  const p1 = `${ax - Math.cos(ang - 0.5) * s},${ay - Math.sin(ang - 0.5) * s}`;
  const p2 = `${ax - Math.cos(ang + 0.5) * s},${ay - Math.sin(ang + 0.5) * s}`;
  const body = `<line class="dg-edge" x1="${x1}" y1="${y1}" x2="${ax}" y2="${ay}"/>
    <polygon class="dg-arrow" points="${ax},${ay} ${p1} ${p2}"/>`;
  return id ? `<g class="diagram-node" data-id="${id}">${body}</g>` : body;
}

// ---- scaffolds ----
const SCAFFOLDS = {
  harness() {
    const w = 118, h = 56, y = 92;
    const xs = { goal: 8, gather: 156, act: 312, verify: 468 };
    return `<svg viewBox="0 0 600 210" role="img" aria-label="The agent loop">
      ${arrow(xs.goal + w, y + h / 2, xs.gather, y + h / 2)}
      ${arrow(xs.gather + w, y + h / 2, xs.act, y + h / 2)}
      ${arrow(xs.act + w, y + h / 2, xs.verify, y + h / 2)}
      <path class="dg-edge" d="M${xs.verify + w / 2},${y} C ${xs.verify + w / 2},28 ${xs.gather + w / 2},28 ${xs.gather + w / 2},${y - 2}"/>
      <polygon class="dg-arrow" points="${xs.gather + w / 2},${y} ${xs.gather + w / 2 - 6},${y - 10} ${xs.gather + w / 2 + 6},${y - 10}"/>
      <text class="dg-sub" x="${(xs.verify + xs.gather) / 2 + w / 2}" y="22" text-anchor="middle">not done? loop back</text>
      ${arrow(xs.verify + w / 2, y + h, xs.verify + w / 2, y + h + 34)}
      <text class="dg-sub" x="${xs.verify + w / 2}" y="${y + h + 50}" text-anchor="middle">done → report</text>
      ${box('goal', xs.goal, y, w, h, 'Goal', 'you set it')}
      ${box('gather', xs.gather, y, w, h, 'Gather', 'read · search')}
      ${box('act', xs.act, y, w, h, 'Act', 'edit · run · fetch')}
      ${box('verify', xs.verify, y, w, h, 'Verify', 'check result')}
    </svg>`;
  },
  multiagent() {
    // fanout group + pipeline group; only one shown at a time by mode.
    const w = 108, h = 50;
    const fan = `<g data-mode="fanout">
      ${box('orch', 246, 8, w, h, 'Orchestrator', 'splits work')}
      ${arrow(300, 58, 120, 96)} ${arrow(300, 58, 300, 96)} ${arrow(300, 58, 480, 96)}
      ${box('a1', 66, 98, w, h, 'Agent · security')}
      ${box('a2', 246, 98, w, h, 'Agent · performance')}
      ${box('a3', 426, 98, w, h, 'Agent · docs')}
      ${arrow(120, 148, 300, 176)} ${arrow(300, 148, 300, 176)} ${arrow(480, 148, 300, 176)}
      ${box('merge', 246, 178, w, h, 'Merge results', 'combined report')}
    </g>`;
    const pipe = `<g data-mode="pipeline" style="display:none">
      ${box('s1', 24, 100, 150, 56, 'Research', 'stage 1')}
      ${arrow(174, 128, 224, 128)}
      ${box('s2', 224, 100, 150, 56, 'Design', 'stage 2')}
      ${arrow(374, 128, 424, 128)}
      ${box('s3', 424, 100, 150, 56, 'Build → Review', 'stage 3')}
    </g>`;
    return `<svg viewBox="0 0 600 240" role="img" aria-label="Multi-agent patterns">${fan}${pipe}</svg>`;
  },
  mcp() {
    return `<svg viewBox="0 0 600 170" role="img" aria-label="How a connector works">
      ${box('claude', 20, 58, 130, 56, 'Claude', 'the agent loop')}
      ${arrow(150, 74, 236, 74, 'arrow1')}
      <text class="dg-sub" x="193" y="66" text-anchor="middle">calls a tool</text>
      ${arrow(236, 100, 150, 100, 'arrow2')}
      <text class="dg-sub" x="193" y="118" text-anchor="middle">results back</text>
      ${box('server', 236, 58, 150, 56, 'MCP server', 'the Connector')}
      ${arrow(386, 86, 450, 86)}
      ${box('ext', 450, 58, 130, 56, 'External system', 'GitHub · DB · drive')}
    </svg>`;
  },
  hooks() {
    const y = 96, w = 92, h = 44;
    const xs = { start: 6, pre: 128, tool: 250, post: 372, stop: 494 };
    let s = `<svg viewBox="0 0 600 190" role="img" aria-label="Where hooks fire">`;
    s += `<line class="dg-edge" x1="20" y1="${y + h / 2}" x2="580" y2="${y + h / 2}" style="stroke-dasharray:4 4;opacity:.5"/>`;
    s += box('start', xs.start, y, w, h, 'SessionStart');
    s += box('pre', xs.pre, y, w, h, 'PreToolUse');
    s += box('tool', xs.tool, y, w, h, 'Tool runs', 'e.g. Edit');
    s += box('post', xs.post, y, w, h, 'PostToolUse');
    s += box('stop', xs.stop, y, w, h, 'Stop / End');
    s += `<text class="dg-sub" x="300" y="28" text-anchor="middle">hooks fire deterministically around each tool call →</text>`;
    s += `</svg>`;
    return s;
  },
};

function mountDiagram(diagramId, slot) {
  const spec = DIAGRAMS[diagramId];
  if (!spec || !SCAFFOLDS[diagramId]) return;

  slot.innerHTML = `
    <div class="diagram">
      <div class="diagram-head"><span>🎬</span><h4>${esc(spec.title)}</h4></div>
      <div class="diagram-stage">${SCAFFOLDS[diagramId]()}</div>
      <div class="diagram-caption"></div>
      <div class="diagram-controls">
        <button data-role="prev">‹ Back</button>
        <button data-role="play">▶ Play</button>
        <button data-role="next">Next ›</button>
        <span class="diagram-dots">${spec.steps.map(() => '<span class="diagram-dot"></span>').join('')}</span>
      </div>
    </div>`;

  const svg = slot.querySelector('svg');
  const captionEl = slot.querySelector('.diagram-caption');
  const dots = slot.querySelectorAll('.diagram-dot');
  const playBtn = slot.querySelector('[data-role="play"]');
  let i = 0;
  let timer = null;

  function apply() {
    const step = spec.steps[i];
    // multiagent: switch which mode group is visible
    if (step.mode) {
      svg.querySelectorAll('[data-mode]').forEach((g) => {
        g.style.display = g.getAttribute('data-mode') === step.mode ? '' : 'none';
      });
    }
    const active = new Set(step.active || []);
    svg.querySelectorAll('.diagram-node').forEach((g) => {
      const on = active.has(g.dataset.id);
      g.classList.toggle('dim', !on);
      g.querySelectorAll('.dg-box, .dg-edge, .dg-arrow').forEach((s) => s.classList.toggle('hot', on));
    });
    captionEl.textContent = step.caption;
    dots.forEach((d, di) => d.classList.toggle('on', di === i));
  }
  function go(n) { i = (n + spec.steps.length) % spec.steps.length; apply(); }
  function stop() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = '▶ Play'; } }

  slot.querySelector('[data-role="next"]').addEventListener('click', () => { stop(); go(i + 1); });
  slot.querySelector('[data-role="prev"]').addEventListener('click', () => { stop(); go(i - 1); });
  playBtn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    playBtn.textContent = '⏸ Pause';
    timer = setInterval(() => {
      if (i >= spec.steps.length - 1) { go(0); } else { go(i + 1); }
    }, 1700);
  });

  apply();
}
