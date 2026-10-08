// Knowledge quiz: pick a site (or a mix of all), answer questions, see explanations, earn XP.
(function () {
  Game.mountNav('quiz');
  const app = document.getElementById('app');
  const ROUND = 8;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const starsFor = r => (r >= 1 ? 3 : r >= Game.PASS ? 2 : r >= 0.4 ? 1 : 0);
  const starText = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const storyOf = id => STORIES.find(s => s.id === id);

  function renderPicker() {
    document.title = 'Quiz · Lahore Heritage';
    const best = Game.state.quizBest;
    app.innerHTML = `
      <h1 class="section-title">Test your knowledge</h1>
      <p class="section-sub">Pick a site. Score ${Game.PASS * 100}% or more (and read its story) to earn its passport stamp.</p>
      <div class="topics">
        <button class="topic topic--wide" data-topic="mixed">
          <span>🎲</span>
          <div><b>All of Lahore</b><small>A mix of 10 questions from every site${best.mixed ? ` · Best ${Math.round(best.mixed * 100)}%` : ''}</small></div>
        </button>
        ${STORIES.map(s => `
          <button class="topic" data-topic="${s.id}">
            <img src="${s.image}" alt="" loading="lazy">
            <div><b>${esc(s.title)}</b>
              <small>${best[s.id] !== undefined ? `<span class="stars">${starText(starsFor(best[s.id]))}</span> Best ${Math.round(best[s.id] * 100)}%` : `${Math.min(ROUND, QUIZ[s.id].length)} questions`}</small></div>
          </button>`).join('')}
      </div>`;
    app.querySelectorAll('.topic').forEach(b => b.onclick = () => { location.hash = b.dataset.topic; });
  }

  function buildRound(topic) {
    if (topic === 'mixed') {
      const all = Object.entries(QUIZ).flatMap(([id, qs]) => qs.map(q => ({ ...q, topic: id })));
      return shuffle(all).slice(0, 10);
    }
    return shuffle(QUIZ[topic].map(q => ({ ...q, topic }))).slice(0, ROUND);
  }

  function play(topic) {
    const qs = buildRound(topic).map(q => {
      const order = shuffle(q.o.map((text, i) => ({ text, correct: i === q.a })));
      return { ...q, order };
    });
    const label = topic === 'mixed' ? 'All of Lahore' : storyOf(topic).title;
    let i = 0, score = 0, streak = 0, bestStreak = 0;
    document.title = `${label} quiz · Lahore Heritage`;

    function question() {
      const q = qs[i];
      app.innerHTML = `
        <div class="qhead">
          <a class="link-btn" href="quiz.html" title="Choose another quiz">✕</a>
          <div class="xpbar"><i style="width:${(i / qs.length) * 100}%"></i></div>
          <span class="qhead__count">${i + 1} / ${qs.length}</span>
          <span class="streak">${streak >= 2 ? `🔥 ${streak}` : ''}</span>
        </div>
        <div class="qcard">
          <span class="qcard__topic">${esc(storyOf(q.topic).title)}</span>
          <h2>${esc(q.q)}</h2>
          <div class="options">${q.order.map((o, k) => `
            <button class="option" data-k="${k}"><span class="option__key">${'ABCD'[k]}</span>${esc(o.text)}</button>`).join('')}
          </div>
          <div id="after"></div>
        </div>`;
      app.querySelectorAll('.option').forEach(btn => btn.onclick = () => answer(+btn.dataset.k));
    }

    function answer(k) {
      const q = qs[i];
      const right = q.order[k].correct;
      app.querySelectorAll('.option').forEach((btn, n) => {
        btn.disabled = true;
        if (q.order[n].correct) btn.classList.add('correct');
        else if (n === k) btn.classList.add('wrong');
      });
      if (right) { score++; streak++; bestStreak = Math.max(bestStreak, streak); } else streak = 0;
      app.querySelector('.streak').textContent = streak >= 2 ? `🔥 ${streak}` : '';
      const praise = ['Correct!', 'Well done!', 'Spot on!', 'Brilliant!', 'Exactly!'];
      const last = i === qs.length - 1;
      app.querySelector('#after').innerHTML = `
        <div class="explain ${right ? 'good' : 'bad'}">
          <b>${right ? `✓ ${praise[Math.random() * praise.length | 0]} +10 XP` : '✗ Not quite'}</b>${esc(q.e)}
          ${right ? '' : ` <a href="learn.html#${q.topic}">Read the story →</a>`}
        </div>
        <div class="qnext"><button class="btn btn--primary" id="next">${last ? 'See my score' : 'Next question →'}</button></div>`;
      const next = app.querySelector('#next');
      next.focus();
      next.onclick = () => { if (last) result(); else { i++; question(); } };
    }

    function result() {
      const ratio = score / qs.length;
      const stars = starsFor(ratio);
      const xp = Game.recordQuiz(topic, score, qs.length);
      const msg = ratio === 1 ? 'Perfect score! You really know your heritage. 🏆'
        : ratio >= Game.PASS ? 'Great job! You passed.'
        : ratio >= 0.4 ? 'Good try! Read the story and you will ace it next time.'
        : 'Every expert starts somewhere. The story has all the answers!';
      const needsRead = topic !== 'mixed' && !Game.state.read[topic];
      app.innerHTML = `
        <div class="result">
          <div class="result__ring" style="--p:${ratio * 100}"><span>${score}/${qs.length}</span></div>
          <h2>${esc(label)}</h2>
          <div class="stars">${starText(stars)}</div>
          <p>${msg}<br>You earned <b>+${xp} XP</b>${bestStreak >= 3 ? ` · best streak 🔥 ${bestStreak}` : ''}.
            ${needsRead && ratio >= Game.PASS ? '<br>Read this site\'s story to collect its passport stamp!' : ''}</p>
          <div class="actions">
            <button class="btn btn--primary" id="again">Play again</button>
            ${topic !== 'mixed' ? `<a class="btn btn--ghost" href="learn.html#${topic}">📖 Read the story</a>` : ''}
            <a class="btn btn--ghost" href="quiz.html">Other quizzes</a>
          </div>
        </div>`;
      app.querySelector('#again').onclick = () => play(topic);
    }

    question();
  }

  function route() {
    const t = location.hash.slice(1);
    if (t === 'mixed' || QUIZ[t]) play(t); else renderPicker();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
