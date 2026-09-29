// Moteur audio — Web Audio API.
// Un GainNode par son + un master. Boucles seamless : les fichiers sont
// pré-édités avec micro-fondu aux jonctions (voir tools/make_sounds.py),
// donc un simple `loop = true` suffit côté lecture.

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
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
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

  async toggle(id, file, volume01) {
    this.ensureCtx();
    if (this.isPlaying(id)) { this.stopOne(id); return false; }
    const ok = await this.loadSound(id, file);
    if (!ok) return 'missing';
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(id);
    src.loop = true; // boucle seamless (fichier pré-édité)
    const g = this.ctx.createGain();
    g.gain.value = volume01 * volume01; // courbe perceptuelle
    src.connect(g); g.connect(this.master);
    src.start();
    this.voices.set(id, { source: src, gain: g });
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
    if (v) v.gain.gain.setTargetAtTime(volume01 * volume01, this.ctx.currentTime, 0.05);
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
