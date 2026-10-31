// Virtual tour: builds a Pannellum multi-scene viewer from window.TOUR (see tour-data.js).
(function () {
  const { scenes, groups } = TOUR;
  const groupById = Object.fromEntries(groups.map(g => [g.id, g]));
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  function hotspotTooltip(div, label) {
    div.innerHTML = `<div class="nav-spot__ring">${ARROW}</div><div class="nav-spot__label"></div>`;
    div.querySelector('.nav-spot__label').textContent = label;
  }

  const pannellumScenes = {};
  for (const [id, s] of Object.entries(scenes)) {
    pannellumScenes[id] = {
      type: 'equirectangular',
      panorama: s.file,
      yaw: s.yaw,
      pitch: s.pitch,
      hotSpots: s.links
        .filter(l => scenes[l.to] && l.to !== id)
        .map(l => ({
          type: 'scene', sceneId: l.to, yaw: l.yaw, pitch: l.pitch,
          cssClass: 'nav-spot', createTooltipFunc: hotspotTooltip, createTooltipArgs: scenes[l.to].title,
        })),
    };
    if (s.flat) Object.assign(pannellumScenes[id], flatView(s.flat));
  }

  // Settings for an aerial photo stored as a partial panorama (see aerial-views.js):
  // keep the view inside the photo and never zoom out past its edges.
  function flatView(f) {
    const pano = document.getElementById('pano');
    const aspect = (pano.clientWidth || innerWidth) / (pano.clientHeight || innerHeight);
    const rad = Math.PI / 180;
    // widest view whose height still fits inside the photo on this screen
    const fit = 2 * Math.atan(Math.tan(f.vaov / 2 * rad) * aspect) / rad;
    const maxHfov = Math.min(f.haov, fit) * 0.98;
    return {
      haov: f.haov, vaov: f.vaov, vOffset: 0,
      minYaw: -f.haov / 2, maxYaw: f.haov / 2, minPitch: -f.vaov / 2, maxPitch: f.vaov / 2,
      hfov: Math.min(f.hfov, maxHfov), maxHfov, minHfov: 8,
      avoidShowingBackground: true, autoRotate: false, // a flat photo has no back side to rotate to
      author: f.credit, authorURL: f.creditUrl,
    };
  }

  const fromHash = () => (scenes[location.hash.slice(1)] ? location.hash.slice(1) : null);
  const firstScene = fromHash() || TOUR.start;

  const viewer = pannellum.viewer('pano', {
    default: {
      firstScene, sceneFadeDuration: 900, autoLoad: true, autoRotate: -2,
      hfov: 100, showFullscreenCtrl: false, compass: false,
    },
    scenes: pannellumScenes,
  });

  // ---- UI ----
  const nameEl = document.getElementById('scene-name');
  const groupEl = document.getElementById('scene-group');
  const tabsEl = document.getElementById('tabs');
  const stripEl = document.getElementById('strip');
  const drawer = document.getElementById('drawer');
  const toggle = document.getElementById('drawer-toggle');
  const rotateBtn = document.getElementById('btn-rotate');
  let current = firstScene;
  let activeGroup = scenes[firstScene].group;

  for (const g of groups) {
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.dataset.group = g.id;
    tab.textContent = g.title;
    tab.onclick = () => { renderStrip(g.id); drawer.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); };
    tabsEl.append(tab);
  }

  function renderStrip(groupId) {
    activeGroup = groupId;
    tabsEl.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.group === groupId));
    stripEl.replaceChildren(...groupById[groupId].scenes.map(id => {
      const b = document.createElement('button');
      b.className = 'thumb' + (id === current ? ' current' : '');
      b.innerHTML = '<img loading="lazy" alt=""><span></span>';
      b.querySelector('img').src = scenes[id].thumb;
      b.querySelector('span').textContent = scenes[id].title;
      b.onclick = () => id !== current && viewer.loadScene(id);
      return b;
    }));
    stripEl.querySelector('.current')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  function onScene(id) {
    current = id;
    const s = scenes[id];
    nameEl.textContent = s.title;
    groupEl.textContent = groupById[s.group].title;
    document.title = `${s.title} · Lahore Heritage 360°`;
    history.replaceState(null, '', '#' + id);
    renderStrip(s.group);
    Game.visitScene(id);
  }

  viewer.on('scenechange', onScene);
  // Every scene starts rotating when it loads; respect the user's choice.
  viewer.on('load', () => {
    if (rotateBtn.getAttribute('aria-pressed') !== 'true') viewer.stopAutoRotate();
  });
  window.addEventListener('hashchange', () => {
    const id = fromHash();
    if (id && id !== current) viewer.loadScene(id);
  });

  toggle.onclick = () => {
    const open = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  };

  rotateBtn.onclick = () => {
    const on = rotateBtn.getAttribute('aria-pressed') !== 'true';
    on ? viewer.startAutoRotate(-2) : viewer.stopAutoRotate();
    rotateBtn.setAttribute('aria-pressed', String(on));
  };
  document.getElementById('btn-fullscreen').onclick = () => viewer.toggleFullscreen();
  Game.mountPill(document.getElementById('tour-pill'));

  onScene(firstScene);
})();
