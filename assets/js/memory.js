// Memory games: "Where am I?" (name the place in a photo) and Memory Match (pair photos with names).
(function () {
  Game.mountNav('memory');
  const app = document.getElementById('app');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const starText = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const groupTitle = id => TOUR.groups.find(g => g.id === TOUR.scenes[id].group).title;

  // One scene per distinct, recognisable title.
  const VAGUE = new Set(['View Point', 'Lahore Fort Park']);
  const places = [];
  const seen = new Set();
  for (const [id, s] of Object.entries(TOUR.scenes)) {
    if (VAGUE.has(s.title) || seen.has(s.title)) continue;
    seen.add(s.title);
    places.push({ id, title: s.title, thumb: s.thumb });
  }
  // Distinctive landmarks for Memory Match.
  const MATCH_POOL = [
    ['node30', 'Badshahi Mosque Gate'], ['node1', 'Badshahi Mosque'], ['node31', 'Mosque Fountain'],
    ['node13', 'Alamgiri Gate'], ['node25', 'Sheesh Mahal'], ['node22', 'Naulakha Pavilion'],
    ['node3', "Iqbal's Tomb"], ['node4', 'Hazuri Bagh Baradari'], ['node28', 'Minar-e-Pakistan'],
    ['node15', 'Elephant Stairs'], ['node46', 'Diwan-e-Aam'], ['node42', 'Diwan-e-Khas'],
  ];

  function renderMenu() {
    document.title = 'Memory Games · Lahore Heritage';
    const st = Game.state;
    app.innerHTML = `
      <h1 class="section-title">Memory games</h1>
      <p class="section-sub">How well do you remember the places you have explored? Visit them in 360° first for a head start.</p>
      <div class="topics">
        <button class="topic topic--wide" data-game="where">
          <span>📍</span>
          <div><b>Where am I?</b><small>See a photo and name the place. 10 rounds.${st.whereBest ? ` Best: ${st.whereBest}/10` : ''}</small></div>
        </button>
        <button class="topic topic--wide" data-game="match">
          <span>🃏</span>
          <div><b>Memory Match</b><small>Flip cards to pair each photo with its name.${st.memoryBest !== null ? ` Best: ${st.memoryBest} moves` : ''}</small></div>
        </button>
      </div>`;
    app.querySelectorAll('[data-game]').forEach(b => b.onclick = () => { location.hash = b.dataset.game; });
  }

  // ---------------- Where am I? ----------------
  function playWhere() {
    const ROUNDS = 10;
    const rounds = shuffle(places).slice(0, ROUNDS).map(p => {
      const others = shuffle(places.filter(x => x.title !== p.title)).slice(0, 3);
      return { place: p, options: shuffle([p, ...others]) };
    });
    let i = 0, score = 0;
    document.title = 'Where am I? · Lahore Heritage';

    function round() {
      const r = rounds[i];
      app.innerHTML = `
        <div class="qhead">
          <a class="link-btn" href="memory.html" title="Back to games">✕</a>
          <div class="xpbar"><i style="width:${(i / ROUNDS) * 100}%"></i></div>
          <span class="qhead__count">${i + 1} / ${ROUNDS}</span>
          <span class="streak">⭐ ${score}</span>
        </div>
        <div class="qcard">
          <span class="qcard__topic">📍 Where am I?</span>
          <img class="qimg" src="${r.place.thumb}" alt="A heritage place in Lahore">
          <div class="options">${r.options.map((o, k) => `
            <button class="option" data-k="${k}"><span class="option__key">${'ABCD'[k]}</span>${esc(o.title)}</button>`).join('')}
          </div>
          <div id="after"></div>
        </div>`;
      app.querySelectorAll('.option').forEach(b => b.onclick = () => answer(+b.dataset.k));
    }

    function answer(k) {
      const r = rounds[i];
      const right = r.options[k].title === r.place.title;
      if (right) score++;
      app.querySelectorAll('.option').forEach((b, n) => {
        b.disabled = true;
        if (r.options[n].title === r.place.title) b.classList.add('correct');
        else if (n === k) b.classList.add('wrong');
      });
      const last = i === ROUNDS - 1;
      app.querySelector('.streak').textContent = `⭐ ${score}`;
      app.querySelector('#after').innerHTML = `
        <div class="explain ${right ? 'good' : 'bad'}">
          <b>${right ? '✓ You got it!' : '✗ Not this time'}</b>
          This is <b style="display:inline">${esc(r.place.title)}</b>, part of ${esc(groupTitle(r.place.id))}.
          <a href="tour.html#${r.place.id}">See it in 360° →</a>
        </div>
        <div class="qnext"><button class="btn btn--primary" id="next">${last ? 'See my score' : 'Next photo →'}</button></div>`;
      const next = app.querySelector('#next');
      next.focus();
      next.onclick = () => { if (last) done(); else { i++; round(); } };
    }

    function done() {
      const xp = Game.recordWhere(score, ROUNDS);
      const stars = score >= 9 ? 3 : score >= 7 ? 2 : score >= 4 ? 1 : 0;
      app.innerHTML = `
        <div class="result">
          <div class="result__ring" style="--p:${score * 10}"><span>${score}/${ROUNDS}</span></div>
          <h2>Where am I?</h2>
          <div class="stars">${starText(stars)}</div>
          <p>${score >= 8 ? 'Eagle eyes! 🦅' : score >= 5 ? 'Nice work. Explore more places to sharpen your memory.' : 'Take a walk through the 360° tour and try again!'}
            <br>You earned <b>+${xp} XP</b>.</p>
          <div class="actions">
            <button class="btn btn--primary" id="again">Play again</button>
            <a class="btn btn--ghost" href="tour.html">🌐 Explore 360°</a>
            <a class="btn btn--ghost" href="memory.html">Other games</a>
          </div>
        </div>`;
      app.querySelector('#again').onclick = playWhere;
    }

    round();
  }

  // ---------------- Memory Match ----------------
  function playMatch() {
    const PAIRS = 6;
    const picks = shuffle(MATCH_POOL).slice(0, PAIRS);
    const cards = shuffle(picks.flatMap(([id, name]) => [
      { pair: id, html: `<img src="${TOUR.scenes[id].thumb}" alt="${esc(name)}">` },
      { pair: id, html: `<span>${esc(name)}</span>` },
    ]));
    let open = [], moves = 0, matched = 0, lock = false;
    const start = Date.now();
    let timer;
    document.title = 'Memory Match · Lahore Heritage';

    app.innerHTML = `
      <div class="qhead">
        <a class="link-btn" href="memory.html" title="Back to games">✕</a>
        <div class="xpbar"><i id="mbar" style="width:0"></i></div>
        <span class="qhead__count" id="mpairs">0 / ${PAIRS} pairs</span>
      </div>
      <p class="muted" style="text-align:center;margin:0 0 10px">Match each photo with its name.</p>
      <div class="mstats"><span>Moves <b id="moves">0</b></span><span>Time <b id="time">0:00</b></span></div>
      <div class="memory-grid">${cards.map((c, k) => `
        <button class="mcard" data-k="${k}" aria-label="Hidden card">
          <span class="mcard__face mcard__back">ل</span>
          <span class="mcard__face mcard__front">${c.html}</span>
        </button>`).join('')}
      </div>`;

    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    timer = setInterval(() => {
      const el = document.getElementById('time');
      if (!el) return clearInterval(timer);
      el.textContent = fmt(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    app.querySelectorAll('.mcard').forEach(btn => btn.onclick = () => {
      if (lock || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;
      btn.classList.add('flipped');
      open.push(btn);
      if (open.length < 2) return;
      moves++;
      document.getElementById('moves').textContent = moves;
      const [a, b] = open;
      if (cards[a.dataset.k].pair === cards[b.dataset.k].pair) {
        a.classList.add('matched'); b.classList.add('matched');
        open = [];
        matched++;
        document.getElementById('mpairs').textContent = `${matched} / ${PAIRS} pairs`;
        document.getElementById('mbar').style.width = `${(matched / PAIRS) * 100}%`;
        if (matched === PAIRS) setTimeout(done, 700);
      } else {
        lock = true;
        setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); open = []; lock = false; }, 900);
      }
    });

    function done() {
      clearInterval(timer);
      const secs = Math.floor((Date.now() - start) / 1000);
      const stars = moves <= 10 ? 3 : moves <= 14 ? 2 : 1;
      const xp = Game.recordMemory(moves, stars);
      app.innerHTML = `
        <div class="result">
          <div class="result__ring" style="--p:${(stars / 3) * 100}"><span>${moves}</span></div>
          <h2>All pairs matched!</h2>
          <div class="stars">${starText(stars)}</div>
          <p>${moves} moves in ${fmt(secs)}. ${stars === 3 ? 'Incredible memory! 🧠' : 'Finish in 10 moves or fewer for 3 stars.'}
            <br>You earned <b>+${xp} XP</b>.</p>
          <div class="actions">
            <button class="btn btn--primary" id="again">Play again</button>
            <a class="btn btn--ghost" href="memory.html">Other games</a>
          </div>
        </div>`;
      app.querySelector('#again').onclick = playMatch;
    }
  }

  function route() {
    const g = location.hash.slice(1);
    if (g === 'where') playWhere(); else if (g === 'match') playMatch(); else renderMenu();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
