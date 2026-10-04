// Moteur audio — Web Audio API.
// Un GainNode par son + un master. Boucles seamless : les fichiers sont
// pré-édités avec micro-fondu aux jonctions (voir tools/make_sounds.py),
// donc un simple `loop = true` suffit côté lecture.
// Normalisation : chaque son porte un `trim` (dB, mesuré au loudnorm,
// cible -24 LUFS) appliqué comme gain — tous les sons sortent au même
// niveau de base. Un limiteur protège le master quand on superpose
// plusieurs sons.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.buffers = new Map();   // id -> AudioBuffer
    this.voices = new Map();    // id -> { source, gain }
    this.missing = new Set();   // id dont le fichier n'existe pas (encore)
    this.timerId = null;
    this.timerEnd = 0;
    this.fadeMs = 0;
    this.onTimerTick = null;
    this.onTimerDone = null;
  }

  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      // Limiteur de sécurité : les sons normalisés (trim) peuvent
      // s'additionner fort quand on en superpose plusieurs.
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -6;
      this.limiter.knee.value = 0;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.003;
      this.limiter.release.value = 0.25;
      // Analyseur pour les visuels réactifs (passe le son, ne le modifie pas).
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.75;
      this.master.connect(this.analyser);
      this.analyser.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      // Sur mobile le contexte peut rester suspendu : on tente de le
      // relancer (sans planter si le navigateur refuse hors geste).
      try { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); }
      catch { /* ignore */ }
    }
    return this.ctx;
  }

  async loadSound(id, file) {
    this.ensureCtx();
    if (this.buffers.has(id) || this.missing.has(id)) return this.buffers.has(id);
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const ab = await res.arrayBuffer();
      const buf = await this.ctx.decodeAudioData(ab);
      this.buffers.set(id, buf);
      return true;
    } catch (e) {
      // Fichier manquant (sons réels pas encore intégrés) : on marque
      // le son indisponible au lieu de planter.
      this.missing.add(id);
      return false;
    }
  }

  isPlaying(id) { return this.voices.has(id); }
  isMissing(id) { return this.missing.has(id); }

  async toggle(id, file, volume01, trimDb = 0) {
    this.ensureCtx();
    if (this.isPlaying(id)) { this.stopOne(id); return false; }
    const ok = await this.loadSound(id, file);
    if (!ok) return 'missing';
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(id);
    src.loop = true; // boucle seamless (fichier pré-édité)
    const g = this.ctx.createGain();
    const trimLin = Math.pow(10, trimDb / 20); // normalisation du volume
    g.gain.value = volume01 * volume01 * trimLin; // courbe perceptuelle × trim
    src.connect(g); g.connect(this.master);
    src.start();
    this.voices.set(id, { source: src, gain: g, trimLin });
    return true;
  }

  stopOne(id) {
    const v = this.voices.get(id);
    if (!v) return;
    try { v.source.stop(); } catch (e) { /* déjà arrêté */ }
    v.source.disconnect(); v.gain.disconnect();
    this.voices.delete(id);
  }

  setVolume(id, volume01) {
    const v = this.voices.get(id);
    if (v) v.gain.gain.setTargetAtTime(volume01 * volume01 * (v.trimLin || 1), this.ctx.currentTime, 0.05);
  }

  // Niveau moyen 0..1 du mix (pour les visuels réactifs).
  getLevel() {
    if (!this.ctx || !this.analyser) return 0;
    if (!this._freq) this._freq = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this._freq);
    let sum = 0;
    for (let i = 0; i < this._freq.length; i++) sum += this._freq[i];
    return sum / this._freq.length / 255;
  }

  activeVolumes() {
    const out = {};
    for (const [id] of this.voices) {
      const slider = document.querySelector(`input[data-vol="${id}"]`);
      out[id] = slider ? Number(slider.value) : 70;
    }
    return out;
  }

  // --- Minuteur avec fondu progressif ---
  startTimer(minutes) {
    this.clearTimer();
    this.ensureCtx();
    const totalMs = minutes * 60 * 1000;
    this.timerEnd = Date.now() + totalMs;
    // Fondu sur les 90 dernières secondes (ou 30 % si minuteur court).
    this.fadeMs = totalMs < 3 * 60 * 1000 ? totalMs * 0.3 : 90 * 1000;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
    this.timerId = setInterval(() => this._tick(), 500);
    this._tick();
  }

  _tick() {
    const remain = this.timerEnd - Date.now();
    if (this.onTimerTick) this.onTimerTick(Math.max(0, remain));
    if (remain <= this.fadeMs && this.fadeMs > 0) {
      // Rampe linéaire vers 0 sur la fin.
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), t);
      this.master.gain.linearRampToValueAtTime(0.0001, t + remain / 1000);
      this.fadeMs = 0; // une seule fois
    }
    if (remain <= 0) {
      this.stopAll();
      if (this.onTimerDone) this.onTimerDone();
    }
  }

  clearTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
    if (this.ctx && this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setValueAtTime(1, this.ctx.currentTime);
    }
  }

  get timerRunning() { return this.timerId !== null; }

  stopAll() {
    this.clearTimer();
    for (const id of [...this.voices.keys()]) this.stopOne(id);
  }

  suspend() { if (this.ctx) this.ctx.suspend(); }
  resume() { if (this.ctx) this.ctx.resume(); }
}
