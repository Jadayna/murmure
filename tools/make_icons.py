#!/usr/bin/env python3
"""Génère les icônes PWA de White Murmure (lune + vagues, style nuit apaisée)."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(OUT, exist_ok=True)

def make(size):
    img = Image.new('RGB', (size, size), '#141824')
    d = ImageDraw.Draw(img)
    # Dégradé vertical nuit -> sarcelle profonde
    top, bot = (20, 24, 36), (15, 90, 100)
    for y in range(size):
        r = int(top[0] + (bot[0] - top[0]) * y / size)
        g = int(top[1] + (bot[1] - top[1]) * y / size)
        b = int(top[2] + (bot[2] - top[2]) * y / size)
        d.line([(0, y), (size, y)], fill=(r, g, b))
    # Lune
    cx, cy, r = int(size * 0.68), int(size * 0.30), int(size * 0.13)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#f4f1e6')
    # Vagues (3 lignes)
    import math
    for i, yb in enumerate([0.58, 0.70, 0.82]):
        pts = []
        for x in range(0, size + 8, 8):
            y = size * yb + math.sin(x / size * 4 * math.pi + i) * size * 0.03
            pts.append((x, y))
        d.line(pts, fill='#6fd3c2', width=max(2, size // 64))
    return img

for size, name in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'icon-180.png')]:
    make(size).save(os.path.join(OUT, name))
    print('ok', name)
