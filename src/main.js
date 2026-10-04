import './style.css';
import { SOUNDS, PACKS, LIFETIME_PRICE } from './sounds.js';
import { STRINGS, getInitialLang } from './i18n.js';
import { AudioEngine } from './audio.js';
import { ICONS } from './icons.js';

// ---------------------------------------------------------------------------
// White Murmure — PWA mixeur de sons d'ambiance (V1 prototype)
// ---------------------------------------------------------------------------

const engine = new AudioEngine();
let lang = getInitialLang();

// État UI (source de vérité pour le mix courant) : id -> volume 0-100
const active = new Map();
// Pause générale (bouton Play/Pause) : true = mix en pause, volontaire.
let userPaused = false;
// Démarrages en cours (anti double-tap pendant le chargement du son).
const starting = new Set();

// Droits (stub — en attente de Stripe, voir TODO(STRIPE) plus bas)
function getEntitlements() {
  try { return JSON.parse(localStorage.getItem('wm_entitlements')) || { packs: [], lifetime: false }; }
  catch { return { packs: [], lifetime: false }; }
}
function saveEntitlements(e) { localStorage.setItem('wm_entitlements', JSON.stringify(e)); }
function adsRemoved() {
  const e = getEntitlements();
  return e.lifetime || e.packs.length > 0;
}
function packUnlocked(pack) {
  const e = getEntitlements();
  return e.lifetime || e.packs.includes(pack);
}

// DEV ONLY : ?dev=unlock débloque tout en local pour tester le paywall.
// À retirer/supprimer avant le lancement public.
if (new URLSearchParams(location.search).get('dev') === 'unlock') {
  saveEntitlements({ packs: Object.keys(PACKS), lifetime: true });
  setTimeout(() => toast(t('devUnlocked')), 600);
}

const t = (k) => (STRINGS[lang] && STRINGS[lang][k]) || STRINGS.fr[k] || k;

// Visuels des packs — même langage que le site vitrine.
const PACK_ART = {
  orage: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#1c3038"/><path d="M40 70 L90 70 L70 100 L110 100 L60 130 L50 95 L75 95 Z" fill="#7cc3d3" opacity=".9" transform="translate(20,-20)"/><circle cx="230" cy="35" r="22" fill="#242e3d"/><circle cx="205" cy="42" r="16" fill="#242e3d"/></svg>',
  boreale: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#14231f"/><path d="M60 110 L60 60 L45 60 L60 35 L52 35 L68 10 L84 35 L76 35 L91 60 L76 60 L76 110 Z" fill="#2f7d8c"/><path d="M150 110 L150 55 L132 55 L150 28 L140 28 L160 5 L180 28 L170 28 L188 55 L170 55 L170 110 Z" fill="#7cc3d3" opacity=".75"/><path d="M235 110 L235 65 L220 65 L235 40 L227 40 L243 18 L259 40 L251 40 L266 65 L251 65 L251 110 Z" fill="#2f7d8c" opacity=".6"/></svg>',
  japon: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#1c3038"/><circle cx="150" cy="60" r="30" fill="#7cc3d3" opacity=".85"/><rect x="60" y="20" width="14" height="80" fill="#2f7d8c"/><rect x="226" y="20" width="14" height="80" fill="#2f7d8c"/><rect x="52" y="14" width="196" height="12" fill="#2f7d8c"/></svg>',
  cote: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#101d26"/><path d="M0 70 q25-18 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V120 H0 Z" fill="#2f7d8c" opacity=".8"/><path d="M0 85 q25-18 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V120 H0 Z" fill="#7cc3d3" opacity=".5"/><path d="M210 40 l14 0 l-7 12 z M240 30 l10 0 l-5 9 z" fill="#edeae3" opacity=".8"/></svg>',
  camp: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#141a26"/><circle cx="248" cy="26" r="14" fill="#edeae3" opacity=".85"/><path d="M150 95 L120 60 L180 60 Z" fill="#2f7d8c"/><path d="M150 78 c6-10 2-16 -4-22 c-2 8 -8 10 -6 20 c1 6 8 6 10 2z" fill="#7cc3d3"/><circle cx="60" cy="30" r="2" fill="#edeae3"/><circle cx="100" cy="55" r="1.6" fill="#edeae3"/><circle cx="200" cy="70" r="2" fill="#edeae3"/></svg>',
  tropical: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#12261f"/><path d="M150 110 C150 70 130 55 90 50 C130 45 145 60 150 30 C155 60 170 45 210 50 C170 55 150 70 150 110" fill="#2f7d8c"/><path d="M150 110 C150 80 140 68 115 62 C140 58 148 68 150 45 C152 68 160 58 185 62 C160 68 150 80 150 110" fill="#7cc3d3" opacity=".7"/><path d="M40 20 l-6 14 M70 14 l-6 14 M250 20 l-6 14" stroke="#7cc3d3" stroke-width="4" stroke-linecap="round" opacity=".6"/></svg>',
  lifetime: '<svg viewBox="0 0 300 120"><rect width="300" height="120" fill="#1c3038"/><path d="M110 60 c0-16 14-26 26-26 c14 0 20 10 14 20 c-8 12 -28 12 -40 6 c-12 -6 -32 -6 -40 6 c-6 10 0 20 14 20 c12 0 26-10 26-26z" fill="none" stroke="#7cc3d3" stroke-width="7" stroke-linecap="round" transform="translate(44,0)"/></svg>',
};
const $ = (sel, el = document) => el.querySelector(sel);

// --- Persistance des volumes ------------------------------------------------
function persistVolumes() {
  localStorage.setItem('wm_volumes', JSON.stringify(Object.fromEntries(active)));
}
function restoreVolumes() {
  try {
    const v = JSON.parse(localStorage.getItem('wm_volumes')) || {};
    for (const [id, vol] of Object.entries(v)) {
      if (SOUNDS.some(s => s.id === id)) pendingVolumes.set(id, Number(vol) || 70);
    }
  } catch { /* ignore */ }
}
// Volumes à appliquer (restauration session / mix partagé), sans démarrer l'audio.
const pendingVolumes = new Map();

// --- Partage via hash d'URL --------------------------------------------------
function encodeMix(mix) {
  const json = JSON.stringify({ v: 1, s: mix });
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeMix(hash) {
  try {
    const b64 = hash.replace(/^#m=/, '').replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b64)))).s;
  } catch { return null; }
}

// --- Toast -------------------------------------------------------------------
function toast(msg) {
  document.querySelectorAll('.toast').forEach(el => el.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// --- Audio : bascule d'un son -------------------------------------------------
async function toggleSound(id) {
  const s = SOUNDS.find(x => x.id === id);
  if (!s) return;
  if (s.pack && !packUnlocked(s.pack)) { openPaywall(s.pack); return; }
  const tile = $(`.tile[data-id="${id}"]`);
  if (active.has(id)) {
    engine.stopOne(id);
    active.delete(id);
    tile?.classList.remove('active');
    if (active.size === 0) userPaused = false;
    updatePPBtn();
    persistVolumes();
    return;
  }
  if (starting.has(id)) return; // démarrage déjà en cours
  starting.add(id);
  try {
    const vol = pendingVolumes.get(id) ?? Number($(`input[data-vol="${id}"]`)?.value || 70);
    const res = await engine.toggle(id, s.file, vol / 100, s.trim || 0);
    if (res === 'missing') {
      tile?.classList.add('unavailable');
      const lr = tile?.querySelector('.lockrow');
      if (lr) lr.textContent = t('soon');
      toast(t('soon'));
      return;
    }
    if (res === true) {
      active.set(id, vol);
      userPaused = false; // ajouter un son relance le mix s'il était en pause
      tile?.classList.add('active');
      const slider = $(`input[data-vol="${id}"]`);
      if (slider) { slider.value = vol; slider.disabled = false; }
      pendingVolumes.delete(id);
      persistVolumes();
      setupMediaSession();
      updatePPBtn();
    }
  } finally {
    starting.delete(id);
  }
}

// --- Bouton Play/Pause général -----------------------------------------------
// Met tout le mix en pause (contexte suspendu) ou le relance, sans perdre
// les sons actifs ni leurs volumes.
function updatePPBtn() {
  const b = $('#ppBtn');
  if (!b) return;
  const playing = active.size > 0 && !userPaused;
  b.innerHTML = playing ? ICONS.pause : ICONS.play;
  b.setAttribute('aria-label', t('playPause'));
  b.title = t('playPause');
  b.classList.toggle('is-playing', playing);
  const np = $('#nowPlaying');
  if (np) {
    if (active.size === 0) { np.style.display = 'none'; }
    else {
      np.style.display = '';
      const names = [...active.keys()].map(id => {
        const s = SOUNDS.find(x => x.id === id);
        return s ? s[lang] : id;
      });
      np.innerHTML = '<span class="np-dot"></span><span>' + t('nowPlaying') + ' : ' + names.join(' + ') + '</span>';
    }
  }
}

function toggleMaster() {
  if (active.size === 0) { toast(t('noActive')); return; }
  if (userPaused) { engine.resume(); userPaused = false; }
  else { engine.suspend(); userPaused = true; }
  updatePPBtn();
}

function setupMediaSession() {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'White Murmure',
      artist: t('tagline'),
      album: 'Mix',
    });
    navigator.mediaSession.setActionHandler('play', () => engine.resume());
    navigator.mediaSession.setActionHandler('pause', () => engine.suspend());
  } catch { /* ignore */ }
}

// --- Rendu -------------------------------------------------------------------
function tileHTML(s) {
  const locked = s.pack && !packUnlocked(s.pack);
  const vol = pendingVolumes.get(s.id) ?? 70;
  const isActive = active.has(s.id);
  return `
  <div class="tile ${isActive ? 'active' : ''} ${locked ? 'locked' : ''}" data-id="${s.id}" role="button" tabindex="0"
       aria-label="${s[lang]}">
    <div class="tile-top">
      <div class="medal">${ICONS[s.icon] || ''}${locked ? `<span class="lockbadge">${ICONS.lock}</span>` : ''}</div>
      <div class="name">${s[lang]}</div>
    </div>
    ${locked ? `<div class="lockrow">${t('locked')}</div>` : ''}
    <input type="range" min="0" max="100" value="${vol}" data-vol="${s.id}"
           aria-label="${t('volume')} — ${s[lang]}" ${isActive || !locked ? '' : 'disabled'} />
  </div>`;
}

function render() {
  const free = SOUNDS.filter(s => !s.pack);
  const packs = Object.keys(PACKS);
  const ent = getEntitlements();

  $('#app').innerHTML = `
  <canvas id="ambient" aria-hidden="true"></canvas>
  <header class="top">
    <div class="brand">
      <div class="logo">${ICONS.waves}</div>
      <div><h1>White Murmure</h1><p>${t('tagline')}</p></div>
    </div>
    <div class="controls">
      <button class="pill" id="langBtn">${lang === 'fr' ? 'EN' : 'FR'}</button>
      <button class="iconbtn" id="themeBtn" title="${t('theme')}" aria-label="${t('theme')}">${ICONS.theme}</button>
    </div>
  </header>
  <div class="honest">${t('honest')}</div>
  <p class="hint">${t('tapToStart')}</p>
  <div class="master-wrap">
    <button class="masterbtn" id="ppBtn" title="${t('playPause')}" aria-label="${t('playPause')}">${ICONS.play}</button>
  </div>
  <div class="nowplaying" id="nowPlaying" style="display:none"></div>

  <h2>${t('freeSounds')}</h2>
  <div class="grid" id="freeGrid">${free.map(tileHTML).join('')}</div>

  <h2>${t('packsTitle')}</h2>
  <div id="packCards">
    ${packs.map(p => `
      <div class="pack-card">
        <div class="pinfo"><span class="pack-art">${PACK_ART[p] || ''}</span>
          <div><div class="pname">${PACKS[p][lang]} ${ent.lifetime || ent.packs.includes(p) ? `<span class="checkbadge">${ICONS.check}</span>` : ''}</div>
          <div class="pdesc">${t('pack' + p[0].toUpperCase() + p.slice(1) + 'Desc')} — ${PACKS[p].price}</div></div>
        </div>
        <button class="btn small" data-unlock="${p}">${t('unlock')}</button>
      </div>`).join('')}
  </div>
  <div class="grid" id="packGrid">${SOUNDS.filter(s => s.pack).map(tileHTML).join('')}</div>

  <h2>${t('timer')}</h2>
  <div class="timer" id="timerBox"></div>

  <h2>${t('myMixes')}</h2>
  <div class="mixrow">
    <input id="mixName" placeholder="${t('mixNamePh')}" maxlength="40" />
    <button class="btn small" id="saveMixBtn">${t('saveMix')}</button>
    <button class="btn small ghost" id="shareMixBtn">${t('share')}</button>
  </div>
  <div id="mixList"></div>

  ${adsRemoved() ? '' : `<div class="ad-slot">${t('adSlot')}</div>
  <!-- TODO(ADSENSE) : remplacer ce stub par l'unité AdSense (script + <ins class="adsbygoogle">).
       Ne s'affiche que si l'utilisateur n'a rien acheté (cf. adsRemoved()). -->`}

  <footer>
    <div class="roadmap">${t('roadmap')}</div>
    <div>${t('footer')}</div>
    <div style="margin-top:6px;opacity:.7">White Murmure v0.4.0</div>
  </footer>`;

  // Événements
  $('#ppBtn').onclick = toggleMaster;
  updatePPBtn();
  $('#langBtn').onclick = () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('wm_lang', lang);
    document.documentElement.lang = lang;
    render();
  };
  $('#themeBtn').onclick = cycleTheme;

  document.querySelectorAll('.tile').forEach(tile => {
    const id = tile.dataset.id;
    const slider = tile.querySelector('input[type="range"]');
    slider.addEventListener('pointerdown', e => e.stopPropagation());
    slider.addEventListener('click', e => e.stopPropagation());
    // La barre de volume DÉCLENCHE le son : on = ça démarre, 0 = ça s'éteint.
    slider.addEventListener('input', () => {
      const v = Number(slider.value);
      if (v === 0) {
        pendingVolumes.delete(id);
        if (active.has(id)) toggleSound(id); // éteint le son
        return;
      }
      if (active.has(id)) {
        active.set(id, v);
        engine.setVolume(id, v / 100);
        persistVolumes();
        return;
      }
      pendingVolumes.set(id, v);
      toggleSound(id); // démarre le son au volume glissé
    });
    const go = (e) => { e.preventDefault(); toggleSound(id); };
    tile.addEventListener('click', go);
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') go(e); });
  });

  document.querySelectorAll('[data-unlock]').forEach(b => {
    b.onclick = () => openPaywall(b.dataset.unlock);
  });

  renderTimer();
  renderMixes();
}

function renderTimer() {
  const box = $('#timerBox');
  if (engine.timerRunning) {
    box.innerHTML = `
      <div class="row"><span class="tcount">${ICONS.clock}<span class="count" id="countdown">--:--</span></span>
      <button class="btn small ghost" id="timerStopBtn">${t('timerStop')}</button></div>`;
    $('#timerStopBtn').onclick = () => { engine.clearTimer(); renderTimer(); };
    return;
  }
  box.innerHTML = `
    <div class="row">
      ${[15, 30, 60, 120].map(m =>
        `<button class="pill" data-tmin="${m}">${m} ${t('minutes')}</button>`).join('')}
    </div>
    <div class="row">
      <input type="number" id="customMin" min="1" max="480" placeholder="${t('custom')}" />
      <button class="btn small" id="timerStartBtn">${t('timerStart')}</button>
    </div>`;
  box.querySelectorAll('[data-tmin]').forEach(b => {
    b.onclick = () => startTimerUI(Number(b.dataset.tmin));
  });
  $('#timerStartBtn').onclick = () => {
    const m = Math.max(1, Math.min(480, Number($('#customMin').value) || 30));
    startTimerUI(m);
  };
}

function startTimerUI(minutes) {
  if (active.size === 0 && pendingVolumes.size === 0) { toast(t('noActive')); return; }
  engine.startTimer(minutes);
  engine.onTimerTick = (remain) => {
    const el = $('#countdown');
    if (el) {
      const s = Math.ceil(remain / 1000);
      el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }
  };
  engine.onTimerDone = () => {
    // Le minuteur a tout arrêté : on nettoie aussi l'état UI.
    active.clear();
    userPaused = false;
    persistVolumes();
    document.querySelectorAll('.tile.active').forEach(el => el.classList.remove('active'));
    toast(t('timerDone'));
    renderTimer();
    updatePPBtn();
  };
  renderTimer();
}

// --- Mix sauvegardés ----------------------------------------------------------
function getMixes() {
  try { return JSON.parse(localStorage.getItem('wm_mixes')) || []; }
  catch { return []; }
}
function renderMixes() {
  const list = $('#mixList');
  const mixes = getMixes();
  list.innerHTML = mixes.length === 0
    ? `<p class="hint">—</p>`
    : mixes.map((m, i) => `
      <div class="mixitem"><div class="mname">${m.name}</div>
      <div class="mactions">
        <button class="linkbtn" data-load="${i}">${t('load')}</button>
        <button class="linkbtn danger" data-del="${i}">${t('del')}</button>
      </div></div>`).join('');
  $('#saveMixBtn').onclick = () => {
    if (active.size === 0) { toast(t('noActive')); return; }
    const name = $('#mixName').value.trim() || `Mix ${mixes.length + 1}`;
    mixes.push({ name, mix: Object.fromEntries(active) });
    localStorage.setItem('wm_mixes', JSON.stringify(mixes));
    $('#mixName').value = '';
    renderMixes();
  };
  $('#shareMixBtn').onclick = async () => {
    if (active.size === 0) { toast(t('noActive')); return; }
    const url = `${location.origin}${location.pathname}#m=${encodeMix(Object.fromEntries(active))}`;
    try { await navigator.clipboard.writeText(url); toast(t('linkCopied')); }
    catch { prompt(url, url); }
  };
  list.querySelectorAll('[data-load]').forEach(b => {
    b.onclick = () => applyMix(mixes[Number(b.dataset.load)].mix);
  });
  list.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = () => {
      mixes.splice(Number(b.dataset.del), 1);
      localStorage.setItem('wm_mixes', JSON.stringify(mixes));
      renderMixes();
    };
  });
}

// Applique un mix (volumes) sans démarrer l'audio : démarrage au premier geste
// (politique d'autoplay des navigateurs).
function applyMix(mix) {
  engine.stopAll();
  active.clear();
  pendingVolumes.clear();
  for (const [id, vol] of Object.entries(mix)) {
    const s = SOUNDS.find(x => x.id === id);
    if (!s) continue;
    if (s.pack && !packUnlocked(s.pack)) continue;
    active.set(id, Number(vol) || 70);
    pendingVolumes.set(id, Number(vol) || 70);
  }
  persistVolumes();
  render();
  toast(t('mixLoaded'));
  const kick = async () => {
    document.removeEventListener('pointerdown', kick);
    for (const [id] of [...pendingVolumes.keys()]) {
      const s = SOUNDS.find(x => x.id === id);
      if (!s || active.get(id) === undefined) continue;
      const slider = $(`input[data-vol="${id}"]`);
      const res = await engine.toggle(id, s.file, (active.get(id) || 70) / 100, s.trim || 0);
      if (res === true) {
        pendingVolumes.delete(id);
        $(`.tile[data-id="${id}"]`)?.classList.add('active');
        if (slider) { slider.value = active.get(id); slider.disabled = false; }
        setupMediaSession();
      } else {
        active.delete(id);
        $(`.tile[data-id="${id}"]`)?.classList.add('unavailable');
      }
    }
    updatePPBtn();
    persistVolumes();
  };
  document.addEventListener('pointerdown', kick, { once: false });
}

// --- Paywall (STUB — pas de vrai paiement) -------------------------------------
function openPaywall(highlight) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  const card = (art, icon, title, desc, price, tag, key) => `
    <div class="offer ${tag ? 'hero' : ''}">
      <div class="offer-art">${art}</div>
      <div class="offer-body">
        <div class="otitle"><span class="otitle-l"><span class="medal sm">${icon}</span><span>${title}</span></span>${tag ? `<span class="tag">${tag}</span>` : ''}</div>
        <div class="odesc">${desc} — <strong>${price}</strong></div>
        <button class="btn" data-buy="${key}">${t('choose')} · ${price}</button>
      </div>
    </div>`;
  ov.innerHTML = `
  <div class="sheet" role="dialog" aria-modal="true">
    <button class="iconbtn sheet-close" id="pwClose" aria-label="${t('close')}">${ICONS.close}</button>
    <h2>${t('paywallTitle')}</h2>
    <p style="color:var(--muted)">${t('paywallSub')}</p>
    ${Object.keys(PACKS).map(p => card(PACK_ART[p], ICONS[PACKS[p].icon], PACKS[p][lang], t('pack' + p[0].toUpperCase() + p.slice(1) + 'Desc'), PACKS[p].price, '', 'pack:' + p)).join('')}
    ${card(PACK_ART.lifetime, ICONS.infinity, t('lifetime'), t('lifetimeDesc'), LIFETIME_PRICE, t('bestValue'), 'lifetime')}
    <button class="btn ghost" id="pwClose2" style="width:100%">${t('close')}</button>
    <!--
      TODO(STRIPE+COMPTES) — modèle « compte à l'achat », liens magiques, voir SPEC 3b.
      AUCUNE clé dans ce repo.
      1. Créer les 7 produits dans Stripe (compte Axe C Studio) : pack_orage,
         pack_boreale, pack_japon, pack_cote, pack_camp, pack_tropical (2,99 $),
         lifetime (12,99 $) — paiements uniques, pas d'abonnement.
      2. Backend : POST /api/stripe/checkout {key} → crée la Checkout Session,
         renvoie l'URL. Ici : fetch POST → window.location = sessionUrl.
      3. Webhook checkout.session.completed (signature vérifiée) → crée le compte
         (email Stripe), attache le droit, envoie le lien magique via Resend.
      4. GET /api/entitlements (session cookie) → droits serveur ; le client met en
         cache local pour le hors-ligne. Login / récupération : POST /api/auth/link
         {email} → lien magique 15 min, usage unique (rate limit 5/h).
      Pour l'instant tout est stubbé en local (wm_entitlements).
    -->
  </div>`;
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
  ov.querySelector('#pwClose').onclick = () => ov.remove();
  ov.querySelector('#pwClose2').onclick = () => ov.remove();
  ov.querySelectorAll('[data-buy]').forEach(b => {
    b.onclick = () => {
      // STUB : aucun appel réseau, aucun paiement réel.
      console.info('[White Murmure] TODO(STRIPE) achat demandé :', b.dataset.buy);
      toast(t('paymentSoon'));
      ov.remove();
    };
  });
  document.body.appendChild(ov);
}

// --- Thème ---------------------------------------------------------------------
function applyTheme() {
  const th = localStorage.getItem('wm_theme') || 'auto';
  if (th === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', th);
}
function cycleTheme() {
  const order = ['auto', 'dark', 'light'];
  const cur = localStorage.getItem('wm_theme') || 'auto';
  localStorage.setItem('wm_theme', order[(order.indexOf(cur) + 1) % order.length]);
  applyTheme();
}

// --- Init ------------------------------------------------------------------------
applyTheme();
restoreVolumes();
document.documentElement.lang = lang;

// Filet de sécurité (surtout mobile) : si le contexte audio est resté
// suspendu, n'importe quel toucher le relance. Inoffensif sinon.
document.addEventListener('pointerdown', () => engine.ensureCtx(), { passive: true });

render();

// Mix partagé via #m=... ?
if (location.hash.startsWith('#m=')) {
  const mix = decodeMix(location.hash);
  if (mix && Object.keys(mix).length) applyMix(mix);
}

// Vagues d'ambiance — réagissent au niveau audio réel.
(function initAmbient() {
  if (window.__wmAmbientInit || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.__wmAmbientInit = true;
  const cv = document.getElementById('ambient');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, t = 0, amp = 1;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  size(); addEventListener('resize', size);
  const dark = () => {
    const th = document.documentElement.getAttribute('data-theme');
    if (th) return th === 'dark';
    return matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const layers = [
    { y: .30, a: 26, s: .006, sp: .012, c: [124, 195, 211] },
    { y: .36, a: 36, s: .004, sp: -.009, c: [47, 125, 140] },
  ];
  (function draw() {
    t += .016;
    const lvl = engine.getLevel();
    amp += ((1 + lvl * 3) - amp) * .06;
    ctx.clearRect(0, 0, W, H);
    const d = dark();
    layers.forEach((L) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const y = H * L.y + Math.sin(x * L.s + t * L.sp * 60) * L.a * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = `rgba(${L.c[0]},${L.c[1]},${L.c[2]},${d ? .055 : .10})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

// PWA : service worker (cache app shell + sons gratuits pour le hors-ligne).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {});
  });
}
