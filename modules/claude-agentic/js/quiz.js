// quiz.js — per-stage quiz engine. Data-driven from stage.quiz. Scores persist
// via Store; clearing the pass threshold advances the Dreyfus tier / DIKW meter
// (handled in state.js) and unlocks the next stage's "Continue" button.


function renderQuiz(stage, container, onProgress) {
  const stageIndex = STAGES.indexOf(stage);

  function draw() {
    const score = Store.stageScore(stage);
    const cleared = Store.isStageCleared(stage);
    const nextStage = STAGES[stageIndex + 1];

    container.innerHTML = `
      <div class="quiz">
        <div class="quiz-head">
          <h3>🧪 Check your understanding</h3>
          <span class="quiz-score">${score.correct}/${score.total} correct</span>
        </div>
        ${stage.quiz.map((q, i) => questionHTML(stage, q, i)).join('')}
        ${cleared ? clearedBanner(stage) : ''}
        ${cleared && nextStage
          ? `<button class="next-stage-btn" data-role="next-stage" data-next="${stageIndex + 1}">Continue to Stage ${nextStage.n}: ${esc(nextStage.title)} →</button>`
          : ''}
        ${cleared && !nextStage
          ? `<button class="next-stage-btn" disabled>🏆 You've reached the top — Expert</button>`
          : ''}
      </div>`;
    wire();
  }

  function questionHTML(stage, q, i) {
    const chosen = Store.answer(stage.id, i);
    const answered = chosen !== undefined;
    return `
      <div class="q" data-q="${i}">
        <div class="q-text"><span class="q-tier">${q.tier}</span>${esc(q.q)}</div>
        <div class="q-opts">
          ${q.options.map((opt, oi) => {
            let cls = '';
            if (answered) {
              if (oi === q.answer) cls = 'correct';
              else if (oi === chosen) cls = 'wrong';
            }
            return `<button class="opt ${cls}" data-opt="${oi}" ${answered ? 'disabled' : ''}>${esc(opt)}</button>`;
          }).join('')}
        </div>
        ${answered ? whyHTML(q, chosen) : ''}
      </div>`;
  }

  function whyHTML(q, chosen) {
    const right = chosen === q.answer;
    return `<div class="q-why ${right ? 'correct' : 'wrong'}">
      <strong>${right ? 'Correct.' : 'Not quite.'}</strong> ${esc(q.why)}</div>`;
  }

  function clearedBanner(stage) {
    const tierIdx = TIERS.indexOf(stage.tier);
    return `<div class="stage-complete-banner">
      <span style="font-size:1.3rem">🎉</span>
      <span>Stage cleared — <strong>${esc(stage.tier)}</strong> tier reached (${tierIdx + 1}/${TIERS.length}). Your journey meter advanced.</span>
    </div>`;
  }

  function wire() {
    container.querySelectorAll('.q').forEach((qEl) => {
      const qi = Number(qEl.dataset.q);
      qEl.querySelectorAll('.opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (Store.answer(stage.id, qi) !== undefined) return;
          Store.recordAnswer(stage.id, qi, Number(btn.dataset.opt));
          draw();                 // re-render this quiz with feedback + updated score
          onProgress && onProgress(stage.id); // let path re-render rail if a stage just cleared
        });
      });
    });
  }

  draw();
}
