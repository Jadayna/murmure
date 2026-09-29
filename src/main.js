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
  saveEntitlements({ packs: ['orage', 'boreale'], lifetime: true });
  setTimeout(() => toast(t('devUnlocked')), 600);
}

const t = (k) => (STRINGS[lang] && STRINGS[lang][k]) || STRINGS.fr[k] || k;
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
  const vol = pendingVolumes.get(id) ?? Number($(`input[data-vol="${id}"]`)?.value || 70);
  const res = await engine.toggle(id, s.file, vol / 100);
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
  <header class="top">
    <div class="brand">
      <div class="logo">${ICONS.waves}</div>
      <div><h1>White Murmure</h1><p>${t('tagline')}</p></div>
    </div>
    <div class="controls">
      <button class="iconbtn accent" id="ppBtn" title="${t('playPause')}" aria-label="${t('playPause')}">${ICONS.play}</button>
      <button class="pill" id="langBtn">${lang === 'fr' ? 'EN' : 'FR'}</button>
      <button class="iconbtn" id="themeBtn" title="${t('theme')}" aria-label="${t('theme')}">${ICONS.theme}</button>
    </div>
  </header>
  <div class="honest">${t('honest')}</div>
  <p class="hint">${t('tapToStart')}</p>

  <h2>${t('freeSounds')}</h2>
  <div class="grid" id="freeGrid">${free.map(tileHTML).join('')}</div>

  <h2>${t('packsTitle')}</h2>
  <div id="packCards">
    ${packs.map(p => `
      <div class="pack-card">
        <div class="pinfo"><div class="medal sm">${ICONS[PACKS[p].icon]}</div>
          <div><div class="pname">${PACKS[p][lang]} ${ent.lifetime || ent.packs.includes(p) ? `<span class="checkbadge">${ICONS.check}</span>` : ''}</div>
          <div class="pdesc">${t(p === 'orage' ? 'packOrageDesc' : 'packBorealeDesc')} — ${PACKS[p].price}</div></div>
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
    <div style="margin-top:6px;opacity:.7">White Murmure v0.1.1 — prototype</div>
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
    slider.addEventListener('input', () => {
      if (!active.has(id)) return;
      active.set(id, Number(slider.value));
      engine.setVolume(id, Number(slider.value) / 100);
      persistVolumes();
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
      const res = await engine.toggle(id, s.file, (active.get(id) || 70) / 100);
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
  const card = (icon, title, desc, price, tag, key) => `
    <div class="offer ${tag ? 'hero' : ''}">
      <div class="otitle"><span class="otitle-l"><span class="medal sm">${icon}</span><span>${title}</span></span>${tag ? `<span class="tag">${tag}</span>` : ''}</div>
      <div class="odesc">${desc} — <strong>${price}</strong></div>
      <button class="btn" data-buy="${key}">${t('choose')} · ${price}</button>
    </div>`;
  ov.innerHTML = `
  <div class="sheet" role="dialog" aria-modal="true">
    <button class="iconbtn sheet-close" id="pwClose" aria-label="${t('close')}">${ICONS.close}</button>
    <h2>${t('paywallTitle')}</h2>
    <p style="color:var(--muted)">${t('paywallSub')}</p>
    ${card(ICONS.thunder, PACKS.orage[lang], t('packOrageDesc'), PACKS.orage.price, '', 'pack:orage')}
    ${card(ICONS.pines, PACKS.boreale[lang], t('packBorealeDesc'), PACKS.boreale.price, '', 'pack:boreale')}
    ${card(ICONS.infinity, t('lifetime'), t('lifetimeDesc'), LIFETIME_PRICE, t('bestValue'), 'lifetime')}
    <button class="btn ghost" id="pwClose2" style="width:100%">${t('close')}</button>
    <!--
      TODO(STRIPE) — intégration paiement (à faire, AUCUNE clé dans ce repo) :
      1. Créer les 3 produits dans Stripe (compte Axe C Studio) : pack_orage 4,99 $,
         pack_boreale 4,99 $, lifetime 19,99 $ (paiements uniques, pas d'abonnement).
      2. Fonction serverless (ex. /api/stripe/checkout sur Vercel) : reçoit {key},
         crée une Checkout Session Stripe, renvoie l'URL.
      3. Ici : fetch POST → window.location = sessionUrl.
      4. Webhook Stripe (fonction serverless) : sur checkout.session.completed,
         marque le droit côté serveur ; le client débloque via /api/entitlements
         puis saveEntitlements(). Pour l'instant tout est stubbé en local.
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

// PWA : service worker (cache app shell + sons gratuits pour le hors-ligne).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
