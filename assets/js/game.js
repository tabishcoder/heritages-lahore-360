// Shared gamification layer: progress (XP, levels, badges, passport stamps), toasts,
// site navigation and the first-visit guided tour. Progress lives in this browser only.
(function () {
  const KEY = 'lahore-heritage-progress-v1';
  const LEVELS = [
    { min: 0, name: 'Visitor', icon: '🧳' },
    { min: 100, name: 'Explorer', icon: '🧭' },
    { min: 250, name: 'Traveller', icon: '🗺️' },
    { min: 450, name: 'Storyteller', icon: '📜' },
    { min: 700, name: 'Historian', icon: '🏛️' },
    { min: 1000, name: 'Heritage Guardian', icon: '🛡️' },
    { min: 1400, name: 'Mughal Scholar', icon: '👑' },
  ];
  const PASS = 0.7; // quiz score needed for a passport stamp

  const fresh = () => ({ xp: 0, visited: {}, read: {}, quizBest: {}, quizzes: 0, perfect: false,
    whereBest: 0, memoryBest: null, badges: {}, stamped: {}, onboarded: false });

  let state = fresh();
  try { state = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };

  const stories = () => window.STORIES || [];
  const groupScenes = id => (window.TOUR && TOUR.groups.find(g => g.id === id)?.scenes) || [];
  const countVisited = ids => ids.filter(id => state.visited[id]).length;

  const BADGES = [
    { id: 'first-steps', icon: '👣', name: 'First Steps', desc: 'Visit your first 360° place', test: s => Object.keys(s.visited).length >= 1 },
    { id: 'sky-high', icon: '🚁', name: 'Sky High', desc: 'See all 7 aerial views', test: () => { const a = groupScenes('aerial'); return a.length && countVisited(a) === a.length; } },
    { id: 'mosque', icon: '🕌', name: 'Mosque Explorer', desc: 'Visit all 4 Badshahi Mosque views', test: () => { const a = groupScenes('badshahi'); return a.length && countVisited(a) === a.length; } },
    { id: 'fort', icon: '🏰', name: 'Fort Wanderer', desc: 'Visit 15 places inside Lahore Fort', test: () => countVisited(groupScenes('fort')) >= 15 },
    { id: 'bookworm', icon: '📖', name: 'Bookworm', desc: 'Read your first heritage story', test: s => Object.keys(s.read).length >= 1 },
    { id: 'scholar', icon: '🎓', name: 'Scholar', desc: 'Read all 5 heritage stories', test: s => stories().length && stories().every(st => s.read[st.id]) },
    { id: 'quiz-rookie', icon: '✏️', name: 'Quiz Rookie', desc: 'Finish your first quiz', test: s => s.quizzes >= 1 },
    { id: 'perfect', icon: '💯', name: 'Perfect Score', desc: 'Answer every question right in a quiz', test: s => s.perfect },
    { id: 'sharp-eye', icon: '👁️', name: 'Sharp Eye', desc: 'Score 8 or more in "Where am I?"', test: s => s.whereBest >= 8 },
    { id: 'memory', icon: '🧠', name: 'Memory Master', desc: 'Finish Memory Match in 10 moves or fewer', test: s => s.memoryBest !== null && s.memoryBest <= 10 },
    { id: 'passport', icon: '🏅', name: 'Passport Complete', desc: 'Collect all 5 passport stamps', test: () => stamps().length && stamps().every(x => x.stamped) },
  ];

  function level(xp = state.xp) {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].min) i++;
    const cur = LEVELS[i], next = LEVELS[i + 1];
    return { index: i + 1, ...cur, next, progress: next ? (xp - cur.min) / (next.min - cur.min) : 1 };
  }

  function stamps() {
    return stories().map(st => {
      const best = state.quizBest[st.id] || 0;
      const read = !!state.read[st.id], quiz = best >= PASS;
      return { story: st, read, quiz, best, visited: countVisited(st.scenes), total: st.scenes.length, stamped: read && quiz };
    });
  }

  // ---------- toasts ----------
  let toastBox;
  function toast(html, kind = '') {
    if (!toastBox) { toastBox = document.createElement('div'); toastBox.className = 'toasts'; toastBox.setAttribute('aria-live', 'polite'); document.body.append(toastBox); }
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.innerHTML = html;
    toastBox.append(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3700);
  }

  // ---------- progress changes ----------
  const listeners = [];
  function changed(xpBefore = state.xp) {
    for (const s of stamps()) {
      if (s.stamped && !state.stamped[s.story.id]) {
        state.stamped[s.story.id] = Date.now();
        toast(`<span class="toast__icon">🏅</span><div><b>Passport stamp: ${s.story.title}</b><small>Story read and quiz passed</small></div>`, 'toast--badge');
      }
    }
    for (const b of BADGES) {
      if (!state.badges[b.id] && b.test(state)) {
        state.badges[b.id] = Date.now();
        toast(`<span class="toast__icon">${b.icon}</span><div><b>Badge unlocked: ${b.name}</b><small>${b.desc}</small></div>`, 'toast--badge');
      }
    }
    const after = level();
    if (after.index > level(xpBefore).index) toast(`<span class="toast__icon">${after.icon}</span><div><b>Level up! You're now a ${after.name}</b><small>Level ${after.index}</small></div>`, 'toast--level');
    save();
    listeners.forEach(fn => fn());
  }

  function addXP(n, reason) {
    const before = state.xp;
    state.xp += n;
    toast(`<span class="toast__xp">+${n} XP</span><div>${reason}</div>`);
    changed(before);
  }

  const Game = {
    get state() { return state; },
    LEVELS, BADGES, PASS, level, stamps, toast, addXP,
    onChange(fn) { listeners.push(fn); },
    visitScene(id) {
      if (state.visited[id]) return;
      state.visited[id] = true;
      addXP(5, 'New place discovered');
    },
    markRead(storyId) {
      if (state.read[storyId]) return false;
      state.read[storyId] = true;
      const st = stories().find(s => s.id === storyId);
      addXP(30, `Story read: ${st ? st.title : ''}`);
      return true;
    },
    recordQuiz(topic, correct, total) {
      const ratio = correct / total;
      state.quizBest[topic] = Math.max(state.quizBest[topic] || 0, ratio);
      state.quizzes++;
      if (correct === total) state.perfect = true;
      const xp = correct * 10 + 20 + (correct === total ? 30 : 0);
      addXP(xp, correct === total ? 'Perfect quiz!' : 'Quiz complete');
      return xp;
    },
    recordWhere(score, total) {
      state.whereBest = Math.max(state.whereBest, score);
      const xp = score * 10 + 10;
      addXP(xp, `"Where am I?" ${score}/${total}`);
      return xp;
    },
    recordMemory(moves, stars) {
      state.memoryBest = state.memoryBest === null ? moves : Math.min(state.memoryBest, moves);
      const xp = 20 + stars * 10;
      addXP(xp, `Memory Match in ${moves} moves`);
      return xp;
    },
    reset() { state = fresh(); state.onboarded = true; save(); listeners.forEach(fn => fn()); },
  };
  window.Game = Game;

  // ---------- navigation ----------
  const NAV = [
    { id: 'home', href: 'index.html', icon: '🏠', label: 'Home' },
    { id: 'explore', href: 'tour.html', icon: '🌐', label: 'Explore 360°' },
    { id: 'learn', href: 'learn.html', icon: '📖', label: 'Learn' },
    { id: 'quiz', href: 'quiz.html', icon: '❓', label: 'Quiz' },
    { id: 'memory', href: 'memory.html', icon: '🧠', label: 'Memory' },
  ];

  function pillHTML() {
    const l = level();
    return `<span class="pill__icon">${l.icon}</span>
      <span class="pill__text"><b>Lv ${l.index}</b><span class="pill__xp"> · ${state.xp} XP</span></span>
      <span class="pill__bar"><i style="width:${Math.round(l.progress * 100)}%"></i></span>`;
  }

  function mountPill(el) {
    el.classList.add('pill');
    el.setAttribute('data-tour', 'passport');
    el.title = 'Your Heritage Passport';
    const draw = () => { el.innerHTML = pillHTML(); };
    draw();
    Game.onChange(draw);
    el.addEventListener('click', openPassport);
  }

  Game.mountNav = function (active) {
    const header = document.createElement('header');
    header.className = 'nav';
    header.innerHTML = `
      <a class="nav__brand" href="index.html"><span class="nav__logo">ل</span><span>Lahore Heritage</span></a>
      <nav class="nav__links">${NAV.filter(n => n.id !== 'home').map(n =>
        `<a href="${n.href}" data-tour="${n.id}" class="${n.id === active ? 'active' : ''}">${n.label}</a>`).join('')}</nav>
      <div class="nav__right">
        <button class="pill" id="nav-pill" type="button"></button>
        <button class="help-btn" type="button" data-tour="help" title="Show me around" aria-label="Show me around">?</button>
      </div>`;
    document.body.prepend(header);
    const tabbar = document.createElement('nav');
    tabbar.className = 'tabbar';
    tabbar.innerHTML = NAV.map(n =>
      `<a href="${n.href}" data-tour="${n.id}" class="${n.id === active ? 'active' : ''}"><span>${n.icon}</span>${n.label.replace(' 360°', '')}</a>`).join('');
    document.body.append(tabbar);
    mountPill(header.querySelector('#nav-pill'));
    header.querySelector('.help-btn').onclick = () => startTour();
  };
  Game.mountPill = mountPill;

  // ---------- passport modal ----------
  function modal(contentHTML, cls = '') {
    const wrap = document.createElement('div');
    wrap.className = 'modal ' + cls;
    wrap.innerHTML = `<div class="modal__card" role="dialog" aria-modal="true">
      <button class="modal__close" aria-label="Close">✕</button>${contentHTML}</div>`;
    const close = () => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 200); document.removeEventListener('keydown', esc); };
    const esc = e => e.key === 'Escape' && close();
    wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('.modal__close')) close(); });
    document.addEventListener('keydown', esc);
    document.body.append(wrap);
    return { el: wrap, close };
  }
  Game.modal = modal;

  function openPassport() {
    const l = level();
    const st = stamps();
    const earned = BADGES.filter(b => state.badges[b.id]).length;
    const m = modal(`
      <div class="passport__head">
        <div class="passport__level">${l.icon}</div>
        <div>
          <span class="eyebrow">Heritage Passport</span>
          <h2>Level ${l.index} · ${l.name}</h2>
          <div class="xpbar"><i style="width:${Math.round(l.progress * 100)}%"></i></div>
          <small>${state.xp} XP${l.next ? ` · ${l.next.min - state.xp} XP to ${l.next.name}` : ' · Top level reached!'}</small>
        </div>
      </div>
      <h3>Stamps <small>${st.filter(s => s.stamped).length}/${st.length}</small></h3>
      <p class="muted">Read a site's story and score at least ${PASS * 100}% in its quiz to earn its stamp.</p>
      <div class="stamps">${st.map(s => `
        <div class="stamp ${s.stamped ? 'stamped' : ''}">
          <div class="stamp__seal"><img src="${s.story.image}" alt=""><span>${s.stamped ? '✓' : ''}</span></div>
          <b>${s.story.title}</b>
          <ul>
            <li class="${s.read ? 'ok' : ''}">${s.read ? '✓' : '○'} <a href="learn.html#${s.story.id}">Read story</a></li>
            <li class="${s.quiz ? 'ok' : ''}">${s.quiz ? '✓' : '○'} <a href="quiz.html#${s.story.id}">Pass quiz</a>${s.best ? ` (${Math.round(s.best * 100)}%)` : ''}</li>
            <li class="${s.visited === s.total ? 'ok' : ''}">🌐 ${s.visited}/${s.total} places seen</li>
          </ul>
        </div>`).join('')}</div>
      <h3>Badges <small>${earned}/${BADGES.length}</small></h3>
      <div class="badges">${BADGES.map(b => `
        <div class="badge-item ${state.badges[b.id] ? 'earned' : ''}" title="${b.desc}">
          <span>${b.icon}</span><b>${b.name}</b><small>${b.desc}</small>
        </div>`).join('')}</div>
      <p class="passport__foot"><button class="link-btn" id="reset-progress">Reset my progress</button></p>
    `, 'modal--passport');
    m.el.querySelector('#reset-progress').onclick = () => {
      if (confirm('Reset all XP, stamps and badges?')) { Game.reset(); m.close(); toast('Progress reset. A fresh start!'); }
    };
  }
  Game.openPassport = openPassport;

  // ---------- guided tour ----------
  const STEPS = [
    { title: 'Welcome to Lahore Heritage! 👋', text: 'Explore Lahore\'s great monuments in 360°, read their stories and test yourself, earning XP as you go. Want a 30-second look around?' },
    { target: 'explore', title: '🌐 Explore in 360°', text: 'Walk through 58 places as if you were there. Drag to look around, and tap the glowing arrows to move. Every new place earns XP.' },
    { target: 'learn', title: '📖 Learn the stories', text: 'Short, friendly stories about each monument: who built it, when, and surprising facts.' },
    { target: 'quiz', title: '❓ Take a quiz', text: 'Test what you know. Each answer comes with a short explanation, so you learn even when you get it wrong.' },
    { target: 'memory', title: '🧠 Memory games', text: 'Can you recognise the places? Play "Where am I?" and Memory Match.' },
    { target: 'passport', title: '🏅 Your Heritage Passport', text: 'Your level and XP live here. Collect a stamp for each site and unlock badges along the way.' },
    { target: 'help', title: 'Need a refresher?', text: 'Tap the ? button anytime to see this tour again. Enjoy your visit!' },
  ];

  function visibleTarget(name) {
    return [...document.querySelectorAll(`[data-tour="${name}"]`)].find(el => el.offsetParent !== null && el.getBoundingClientRect().width > 0);
  }

  function startTour() {
    let i = 0;
    const layer = document.createElement('div');
    layer.className = 'spot';
    layer.innerHTML = `<div class="spot__hole"></div><div class="spot__card" role="dialog" aria-live="polite">
      <div class="spot__dots"></div><h3></h3><p></p>
      <div class="spot__actions"><button class="link-btn spot__skip">Skip</button><button class="btn btn--primary btn--sm spot__next">Next</button></div></div>`;
    document.body.append(layer);
    const hole = layer.querySelector('.spot__hole'), card = layer.querySelector('.spot__card');

    function finish() {
      layer.remove();
      window.removeEventListener('resize', draw);
      if (!state.onboarded) { state.onboarded = true; addXP(10, 'Welcome aboard!'); }
    }
    function draw() {
      const s = STEPS[i];
      card.querySelector('h3').textContent = s.title;
      card.querySelector('p').textContent = s.text;
      card.querySelector('.spot__dots').innerHTML = STEPS.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
      card.querySelector('.spot__next').textContent = i === 0 ? 'Show me around' : i === STEPS.length - 1 ? 'Let\'s go!' : 'Next';
      card.querySelector('.spot__skip').textContent = i === 0 ? 'Maybe later' : 'Skip';
      const el = s.target && visibleTarget(s.target);
      layer.classList.toggle('spot--center', !el);
      if (!el) { hole.style.cssText = ''; card.style.cssText = ''; return; }
      const r = el.getBoundingClientRect(), pad = 6;
      hole.style.cssText = `left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`;
      const cw = Math.min(320, innerWidth - 32);
      const left = Math.min(Math.max(16, r.left + r.width / 2 - cw / 2), innerWidth - cw - 16);
      const below = r.top < innerHeight / 2;
      card.style.cssText = `width:${cw}px;left:${left}px;` + (below ? `top:${r.bottom + 16}px` : `bottom:${innerHeight - r.top + 16}px`);
    }
    card.querySelector('.spot__next').onclick = () => { if (++i >= STEPS.length) finish(); else draw(); };
    card.querySelector('.spot__skip').onclick = finish;
    window.addEventListener('resize', draw);
    draw();
  }
  Game.startTour = startTour;
  Game.maybeOnboard = () => { if (!state.onboarded) setTimeout(startTour, 600); };
})();
