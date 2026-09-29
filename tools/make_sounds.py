#!/usr/bin/env python3
"""
White Murmure — synthèse des placeholders audio (TEMP-*.wav).

À N'EXÉCUTER QUE si aucun vrai son libre de droits n'est disponible :
les placeholders sont des approximations filtrées (bruit blanc/rose/brun),
bouclées en seamless via micro-fondu aux jonctions (~15-25 s, 44.1 kHz mono).

Usage : python3 tools/make_sounds.py   (écrit dans public/sounds/)
"""
import numpy as np
import wave
import os

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sounds')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def write_wav(name, x, peak=0.8):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * peak, -1, 1)
    p = os.path.join(OUT, name)
    with wave.open(p, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print('ok', name, f'{len(x)/SR:.1f}s')


def seamless(x, fade_s=2.0):
    """Rend la boucle seamless : la fin se fond dans le début."""
    fade = int(fade_s * SR)
    L = len(x) - fade
    t = np.linspace(0, 1, fade)
    y = x[:L].copy()
    y[:fade] = x[L:L + fade] * (1 - t) + x[:fade] * t
    return y


def band(x, low, high, edge=80):
    """Filtre passe-bande FFT à bords adoucis."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    m = np.clip((f - low) / edge, 0, 1) * np.clip((high - f) / edge, 0, 1)
    return np.fft.irfft(X * m, n)


def white(n):
    return rng.standard_normal(n)


def pink(n):
    w = rng.standard_normal(n)
    X = np.fft.rfft(w)
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = 1.0
    y = np.fft.irfft(X / np.sqrt(f), n)
    return y / (np.max(np.abs(y)) + 1e-9)


def brown(n):
    y = np.cumsum(rng.standard_normal(n))
    y -= np.linspace(y[0], y[-1], n)  # anti-dérive
    return y / (np.max(np.abs(y)) + 1e-9)


def smooth_random(n, scale_s=4.0):
    """Enveloppe aléatoire lente (0..1)."""
    k = max(1, int(scale_s * 4))
    pts = rng.random(n // int(SR * scale_s) + 2)
    return np.interp(np.linspace(0, len(pts) - 1, n), np.arange(len(pts)), pts)


def impulses(n, rate_per_s, dur_ms=30, f0=3000, f1=6000):
    """Salve d'impulsions (gouttes, crépitements...)."""
    y = np.zeros(n)
    count = int(n / SR * rate_per_s)
    maxL = int(SR * dur_ms / 1000 * 1.5) + 1
    for _ in range(count):
        i = rng.integers(0, n - maxL)
        L = int(SR * dur_ms / 1000 * rng.uniform(0.5, 1.5))
        f = rng.uniform(f0, f1)
        tt = np.arange(L) / SR
        env = np.exp(-tt / (dur_ms / 1000 / 3))
        y[i:i + L] += env * np.sin(2 * np.pi * f * tt) * rng.uniform(0.3, 1.0)
    return y


def chirps(n, count, f0=3000, f1=5200, dur=0.15):
    y = np.zeros(n)
    maxL = int(SR * dur * 1.3) + 1
    for _ in range(count):
        i = rng.integers(0, n - maxL)
        L = int(SR * dur * rng.uniform(0.7, 1.3))
        tt = np.arange(L) / SR
        sweep = f0 + (f1 - f0) * np.sin(np.pi * tt / (L / SR))
        y[i:i + L] += np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.hanning(L) * 0.6
    return y


def D(s):  # durée en secondes -> échantillons
    return int(s * SR)


# ------------------------- 10 gratuits -------------------------
def s_bruit_blanc():      return seamless(white(D(18)))
def s_ventilateur():
    x = band(white(D(20)), 80, 500)
    return seamless(x * (0.85 + 0.15 * np.sin(2 * np.pi * 3 * np.arange(D(20)) / SR)))
def s_pluie_douce():
    return seamless(band(white(D(20)), 1500, 7000) * 0.7 + impulses(D(20), 40) * 0.5)
def s_tonnerre_lointain():
    n = D(28); y = np.zeros(n)
    for _ in range(4):
        i = rng.integers(0, n - D(9)); L = D(9)
        tt = np.arange(L) / SR
        env = (1 - np.exp(-tt / 2.0)) * np.exp(-tt / 6.0)
        y[i:i + L] += band(brown(L), 40, 220) * env
    return seamless(y + band(white(n), 100, 400) * 0.05)
def s_vagues():
    n = D(24)
    lfo = 0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * np.arange(n) / SR / 8.5))
    return seamless(band(pink(n), 150, 1200) * lfo)
def s_vent():
    n = D(22)
    return seamless(band(brown(n), 100, 900) * (0.5 + 0.5 * smooth_random(n, 5)))
def s_feu_foyer():
    n = D(18)
    return seamless(band(brown(n), 60, 180) * 0.5 + impulses(n, 9, 25, 1500, 4500) * 0.8)
def s_cafe_anime():
    n = D(20)
    walla = band(white(n), 350, 2800) * (0.5 + 0.5 * smooth_random(n, 0.8))
    clinks = impulses(n, 0.7, 60, 2500, 5000) * 0.4
    return seamless(walla * 0.8 + clinks)
def s_oiseaux():
    n = D(20)
    return seamless(band(white(n), 2000, 6000) * 0.06 + chirps(n, 16))
def s_grillons():
    n = D(16)
    carrier = np.sin(2 * np.pi * 4200 * np.arange(n) / SR)
    pulse = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * np.arange(n) / SR)))
    return seamless(carrier * pulse * 0.5)


# ------------------------- Pack Orage -------------------------
def s_pluie_battante():
    return seamless(band(white(D(20)), 900, 8000) * 0.8 + impulses(D(20), 150, 20, 2000, 7000) * 0.6)
def s_tonnerre_proche():
    n = D(26); y = np.zeros(n)
    for _ in range(3):
        i = rng.integers(0, n - D(7)); L = D(7)
        tt = np.arange(L) / SR
        crack = band(white(L), 800, 6000) * np.exp(-tt / 0.25)
        rumble = band(brown(L), 35, 180) * (1 - np.exp(-tt / 0.4)) * np.exp(-tt / 4.0)
        y[i:i + L] += crack * 0.7 + rumble
    return seamless(y)
def s_pluie_sur_vitre():
    return seamless(band(white(D(18)), 2500, 9000) * 0.6 + impulses(D(18), 55, 15, 3500, 8000) * 0.5)
def s_vent_tempete():
    n = D(20)
    return seamless(band(pink(n), 120, 1500) * (0.45 + 0.55 * smooth_random(n, 2.5)))
def s_grele():
    return seamless(band(white(D(16)), 3000, 9000) * 0.25 + impulses(D(16), 70, 8, 4500, 9000) * 0.9)
def s_ruisseau_en_crue():
    n = D(20)
    return seamless(band(white(n), 700, 4500) * (0.6 + 0.4 * smooth_random(n, 1.2)))


# ------------------------- Pack Forêt boréale -------------------------
def s_huard():
    n = D(24); y = np.zeros(n)
    for k in range(3):
        i = int(n * (0.12 + k * 0.3)); L = D(2.6)
        tt = np.arange(L) / SR
        f = 620 - 260 * np.sin(np.pi * tt / (L / SR)) ** 0.7 + 40 * np.sin(2 * np.pi * 6 * tt)
        y[i:i + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(L) * 0.55
    return seamless(y + band(white(n), 300, 900) * 0.04)
def s_vent_pins():
    n = D(22)
    return seamless(band(brown(n), 150, 1100) * (0.5 + 0.5 * smooth_random(n, 4)) +
                    band(white(n), 900, 1600) * 0.12 * (0.5 + 0.5 * smooth_random(n, 6)))
def s_ruisseau_forestier():
    n = D(20)
    return seamless(band(white(n), 900, 3800) * (0.55 + 0.45 * smooth_random(n, 1.6)) +
                    chirps(n, 5, 3500, 5000, 0.12) * 0.25)
def s_branches():
    n = D(20); y = np.zeros(n)
    for _ in range(int(20 * 1.4)):
        i = rng.integers(0, n - D(0.3)); L = D(0.3)
        tt = np.arange(L) / SR
        y[i:i + L] += band(white(L), 90, 320) * np.exp(-tt / 0.06) * rng.uniform(0.4, 1.0)
    return seamless(y + band(brown(n), 80, 300) * 0.1)
def s_pluie_en_foret():
    n = D(20)
    return seamless(band(white(n), 1200, 6000) * 0.55 + impulses(n, 30, 25, 2000, 6000) * 0.4 +
                    band(brown(n), 60, 200) * 0.15)
def s_mesanges():
    n = D(18); y = band(white(n), 2500, 7000) * 0.05
    for _ in range(10):
        i = rng.integers(0, n - D(0.6))
        for j in range(rng.integers(2, 4)):
            L = D(0.09); st = i + j * int(D(0.13))
            if st + L >= n: break
            tt = np.arange(L) / SR
            f = 3800 + 800 * np.sin(np.pi * tt / (L / SR))
            y[st:st + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(L) * 0.5
    return seamless(y)


TASKS = [
    ('TEMP-bruit-blanc.wav', s_bruit_blanc), ('TEMP-ventilateur.wav', s_ventilateur),
    ('TEMP-pluie-douce.wav', s_pluie_douce), ('TEMP-tonnerre-lointain.wav', s_tonnerre_lointain),
    ('TEMP-vagues.wav', s_vagues), ('TEMP-vent.wav', s_vent),
    ('TEMP-feu-foyer.wav', s_feu_foyer), ('TEMP-cafe-anime.wav', s_cafe_anime),
    ('TEMP-oiseaux.wav', s_oiseaux), ('TEMP-grillons.wav', s_grillons),
    ('TEMP-pluie-battante.wav', s_pluie_battante), ('TEMP-tonnerre-proche.wav', s_tonnerre_proche),
    ('TEMP-pluie-sur-vitre.wav', s_pluie_sur_vitre), ('TEMP-vent-tempete.wav', s_vent_tempete),
    ('TEMP-grele.wav', s_grele), ('TEMP-ruisseau-en-crue.wav', s_ruisseau_en_crue),
    ('TEMP-huard.wav', s_huard), ('TEMP-vent-pins.wav', s_vent_pins),
    ('TEMP-ruisseau-forestier.wav', s_ruisseau_forestier), ('TEMP-branches.wav', s_branches),
    ('TEMP-pluie-en-foret.wav', s_pluie_en_foret), ('TEMP-mesanges.wav', s_mesanges),
]

if __name__ == '__main__':
    for name, fn in TASKS:
        write_wav(name, fn())
    print(f'\n{len(TASKS)} fichiers dans {OUT}')
