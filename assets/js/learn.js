// Learn page: a list of heritage stories, and a reader for one story (learn.html#<storyId>).
(function () {
  Game.mountNav('learn');
  const app = document.getElementById('app');
  const readbar = document.getElementById('readbar');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function statusChips(s) {
    return `<div class="status">
      <span class="${s.read ? 'ok' : ''}">${s.read ? '✓ Read' : '📖 Not read yet'}</span>
      <span class="${s.quiz ? 'ok' : ''}">${s.quiz ? '✓ Quiz passed' : '❓ Quiz not passed'}</span>
      ${s.stamped ? '<span class="ok">🏅 Stamped</span>' : ''}
    </div>`;
  }

  function renderList() {
    document.title = 'Learn · Lahore Heritage';
    readbar.style.width = '0';
    app.innerHTML = `
      <section class="wrap" style="padding-top:40px">
        <h1 class="section-title">Heritage stories</h1>
        <p class="section-sub">Five short stories, about 3 minutes each. Finish one to earn +30 XP, then pass its quiz to collect a passport stamp.</p>
        <div class="storylist">${Game.stamps().map(s => `
          <a class="storyrow" href="#${s.story.id}">
            <img src="${s.story.image}" alt="" loading="lazy">
            <div>
              <h3>${esc(s.story.title)}</h3>
              <p>${esc(s.story.tagline)}</p>
              ${statusChips(s)}
            </div>
          </a>`).join('')}
        </div>
      </section>`;
  }

  function renderStory(story) {
    const idx = STORIES.indexOf(story);
    const next = STORIES[(idx + 1) % STORIES.length];
    const sceneThumb = id => (TOUR.scenes[id] ? TOUR.scenes[id].thumb : story.image);
    document.title = `${story.title} · Learn · Lahore Heritage`;

    app.innerHTML = `
      <header class="story-hero" style="background-image:url('${story.image}')">
        <div class="wrap">
          <a class="back-link" href="learn.html">← All stories</a>
          <h1>${esc(story.title)}</h1>
          <span class="local" lang="ur" dir="rtl">${story.local}</span>
          <p>${esc(story.tagline)}</p>
        </div>
      </header>

      <div class="wrap">
        <div class="facts">${story.facts.map(f => `
          <div class="fact"><span>${f.icon}</span><div><small>${esc(f.label)}</small><b>${esc(f.value)}</b></div></div>`).join('')}
        </div>

        <div class="article">
          <div class="article__main">
            ${story.sections.map(s => `<section><h2>${esc(s.heading)}</h2><p>${esc(s.text)}</p></section>`).join('')}
          </div>
          <aside class="aside">
            <div class="dyk"><h4>💡 Did you know?</h4>${story.didYouKnow.map(d => `<p>${esc(d)}</p>`).join('')}</div>
            <div class="timeline"><h4>🕰️ Timeline</h4><ol>${story.timeline.map(t => `<li><b>${esc(t.year)}</b>${esc(t.text)}</li>`).join('')}</ol></div>
          </aside>
        </div>

        <h2 class="section-title" style="font-size:32px">See it for yourself</h2>
        <p class="section-sub" style="margin-bottom:0">Jump straight into these places in 360°.</p>
        <div class="highlights">${story.highlights.map(h => `
          <div class="hl">
            <img src="${sceneThumb(h.scene)}" alt="" loading="lazy">
            <div><b>${esc(h.name)}</b><p>${esc(h.text)}</p><a href="tour.html#${h.scene}">View in 360° →</a></div>
          </div>`).join('')}
        </div>

        <div class="finish" id="finish"></div>
      </div>`;

    const finish = document.getElementById('finish');
    function drawFinish() {
      const s = Game.stamps()[idx];
      if (!s.read) {
        finish.innerHTML = `
          <h3>Finished reading? 🎉</h3>
          <p>Collect your reward, then test yourself with a quick quiz.</p>
          <div class="actions"><button class="btn btn--primary" id="mark-read">Collect +30 XP</button></div>`;
        finish.querySelector('#mark-read').onclick = () => { Game.markRead(story.id); drawFinish(); };
      } else {
        finish.innerHTML = `
          <h3>${s.stamped ? '🏅 Stamp collected!' : '✓ Story complete'}</h3>
          <p>${s.stamped ? 'You have mastered this site. On to the next one!' : `Now pass the ${esc(story.title)} quiz (${Game.PASS * 100}% or more) to earn its passport stamp.`}</p>
          <div class="actions">
            ${s.quiz ? '' : `<a class="btn btn--primary" href="quiz.html#${story.id}">❓ Take the quiz</a>`}
            <a class="btn ${s.quiz ? 'btn--primary' : 'btn--ghost'}" href="learn.html#${next.id}">Next: ${esc(next.title)} →</a>
          </div>`;
      }
    }
    drawFinish();
    window.scrollTo(0, 0);
  }

  function route() {
    const story = STORIES.find(s => s.id === location.hash.slice(1));
    story ? renderStory(story) : renderList();
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', () => {
    if (!location.hash) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    readbar.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + '%';
  }, { passive: true });
  route();
})();
