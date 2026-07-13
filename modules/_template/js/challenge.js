// challenge.js — the Mastery Challenge: a capstone assessment that mixes every
// stage's questions, ordered Novice → Expert, and returns a final mastery
// verdict on the DIKW / Dreyfus spine. Reuses the stage quiz bank (no new
// content) so it always mirrors the course. Best score persists via Store.

function renderChallenge(container) {
  // Flatten every stage question, tagged with its stage + tier, ordered by tier.
  const bank = [];
  STAGES.forEach((s) => s.quiz.forEach((q) => bank.push({ ...q, stage: s.title, stageTier: s.tier })));
  bank.sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier));

  const selections = {}; // index -> chosen option
  let graded = false;

  function verdict(ratio) {
    const idx = ratio >= 0.9 ? 4 : ratio >= 0.78 ? 3 : ratio >= 0.65 ? 2 : ratio >= 0.5 ? 1 : 0;
    return { tier: TIERS[idx], dikw: DIKW[Math.min(idx, DIKW.length - 1)], idx };
  }

  function tierGroupsHTML() {
    // group questions by tier for readable section headers
    let html = '';
    let currentTier = null;
    bank.forEach((q, i) => {
      if (q.tier !== currentTier) {
        currentTier = q.tier;
        html += `<h3 class="ch-tier-head"><span class="ch-tier-badge">${esc(q.tier)}</span></h3>`;
      }
      const chosen = selections[i];
      html += `
        <div class="q" data-q="${i}">
          <div class="q-text"><span class="q-tier">${esc(q.stage)}</span>${esc(q.q)}</div>
          <div class="q-opts">
            ${q.options.map((opt, oi) => {
              let cls = chosen === oi ? 'sel' : '';
              if (graded) {
                if (oi === q.answer) cls = 'correct';
                else if (oi === chosen) cls = 'wrong';
              }
              return `<button class="opt ${cls}" data-opt="${oi}" ${graded ? 'disabled' : ''}>${esc(opt)}</button>`;
            }).join('')}
          </div>
          ${graded ? `<div class="q-why ${chosen === q.answer ? 'correct' : 'wrong'}"><strong>${chosen === q.answer ? 'Correct.' : 'Not quite.'}</strong> ${esc(q.why)}</div>` : ''}
        </div>`;
    });
    return html;
  }

  function draw() {
    const answered = Object.keys(selections).length;
    const best = Store.bestChallenge();
    container.innerHTML = `
      <div class="pg-hero">
        <h1>🏆 Mastery Challenge</h1>
        <p>One test across the whole course — ${bank.length} questions, ordered Novice → Expert.
           Answer them all, then reveal where you land on the journey from <em>knowing</em> to <em>expert</em>.
           ${best != null ? `<br><strong>Your best: ${best}%</strong>` : ''}</p>
      </div>
      <div id="ch-verdict"></div>
      <div class="ch-progress"><div class="ch-progress-bar" style="width:${Math.round((answered / bank.length) * 100)}%"></div>
        <span class="ch-progress-label">${answered}/${bank.length} answered</span></div>
      <div id="ch-questions">${tierGroupsHTML()}</div>
      <div class="pg-actions">
        <button class="pg-btn" data-role="grade" ${answered === bank.length ? '' : 'disabled'}>Reveal my mastery →</button>
        <button class="pg-btn ghost" data-role="retake">Start over</button>
      </div>`;
    wire();
    if (graded) showVerdict();
  }

  function showVerdict() {
    const correct = bank.reduce((n, q, i) => n + (selections[i] === q.answer ? 1 : 0), 0);
    const ratio = correct / bank.length;
    const pct = Math.round(ratio * 100);
    const v = verdict(ratio);
    Store.setBestChallenge(pct);

    // per-tier breakdown
    const byTier = {};
    bank.forEach((q, i) => {
      byTier[q.tier] = byTier[q.tier] || { c: 0, t: 0 };
      byTier[q.tier].t++;
      if (selections[i] === q.answer) byTier[q.tier].c++;
    });
    const breakdown = TIERS.filter((t) => byTier[t]).map((t) =>
      `<li><strong>${esc(t)}</strong> — ${byTier[t].c}/${byTier[t].t}</li>`).join('');

    const box = container.querySelector('#ch-verdict');
    box.innerHTML = `
      <div class="pg-result">
        <div class="pr-eyebrow">Your mastery · ${pct}%</div>
        <h2>${esc(v.tier)}</h2>
        <div class="pg-surface">DIKW stage reached: <strong>${esc(v.dikw)}</strong> · ${correct}/${bank.length} correct</div>
        <div class="ch-meter">${TIERS.map((t, i) =>
          `<span class="ch-meter-seg ${i <= v.idx ? 'on' : ''}" title="${esc(t)}"></span>`).join('')}</div>
        <p class="pr-why">${verdictBlurb(v.idx)}</p>
        <div class="pg-secondary"><b>By tier:</b><ul style="margin:.4rem 0 0">${breakdown}</ul></div>
      </div>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function verdictBlurb(idx) {
    return [
      'A solid start — you know the vocabulary. Revisit the guided path to turn facts into working knowledge.',
      'You’re past the basics. Keep going: the middle stages (chat, Cowork) are where agentic habits form.',
      'Competent — you can pick the right surface for common jobs. Push into Claude Code’s mechanics next.',
      'Proficient — you handle the power surface and orchestration. One more pass on the mastery stage.',
      'Expert — you match capability to need instinctively. That judgment is the “wisdom” of the DIKW ladder. 🎉',
    ][idx];
  }

  function wire() {
    container.querySelectorAll('.q').forEach((qEl) => {
      const qi = Number(qEl.dataset.q);
      qEl.querySelectorAll('.opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (graded) return;
          selections[qi] = Number(btn.dataset.opt);
          qEl.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b === btn));
          const answered = Object.keys(selections).length;
          const grade = container.querySelector('[data-role="grade"]');
          grade.disabled = answered !== bank.length;
          container.querySelector('.ch-progress-bar').style.width = Math.round((answered / bank.length) * 100) + '%';
          container.querySelector('.ch-progress-label').textContent = `${answered}/${bank.length} answered`;
        });
      });
    });
    container.querySelector('[data-role="grade"]').addEventListener('click', () => { graded = true; draw(); });
    container.querySelector('[data-role="retake"]').addEventListener('click', () => {
      for (const k of Object.keys(selections)) delete selections[k];
      graded = false; draw();
    });
  }

  draw();
}
