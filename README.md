# 🌊 White Murmure

**Le mixeur de sons d'ambiance, simple et honnête.** Mixez des sons pour dormir, vous concentrer et vous détendre. Gratuit, sans abonnement.

> Projet V1 (prototype) — remplaçant moderne d'A Soft Murmur.

## Stack

- **Vite + JavaScript vanilla** (pas de framework lourd)
- **Web Audio API** : un `GainNode` par son, boucles `loop` seamless (fichiers pré-édités avec micro-fondu aux jonctions)
- **PWA** : `manifest.webmanifest` + service worker (`public/sw.js`, cache-first, sons gratuits hors-ligne)
- **Media Session API** : contrôles sur écran verrouillé
- **i18n FR/EN** (français par défaut)

## Structure

```
index.html              # shell
src/
  main.js               # UI + wiring
  audio.js              # AudioEngine (Web Audio)
  sounds.js             # SOURCE DE VÉRITÉ des 22 sons (noms FR/EN, fichiers, packs)
  i18n.js               # chaînes FR/EN
  style.css             # sombre/clair auto + manuel
public/
  manifest.webmanifest  # nom PWA : "White Murmure"
  sw.js                 # service worker (duplique la liste des sons — voir note)
  icons/                # icon-192/512/180.png (générés via tools/make_icons.py)
  sounds/               # les 22 fichiers audio (vrais sons — voir ci-dessous)
tools/
  make_icons.py         # génération des icônes (Pillow)
  make_sounds.py        # synthèse placeholders TEMP-*.wav (SECOURS uniquement)
  check_sync.mjs        # vérifie sounds.js ↔ sw.js + parité i18n FR/EN
```

## Les sons

**Les vrais enregistrements (libres de droits, CC0) remplacent les placeholders.** Pour intégrer un lot : déposer les fichiers dans `public/sounds/` et mettre à jour le champ `file` de chaque son dans `src/sounds.js` (+ la liste `SOUND_FILES` dans `public/sw.js` — `npm run check` vérifie la synchro).

`tools/make_sounds.py` ne sert qu'en dernier recours (placeholders synthétisés, préfixe `TEMP-`).

## Paiements (stub V1)

Le paywall (2 packs à 4,99 $ + collection à vie à 19,99 $) est **entièrement stubbé** : l'UI existe, aucun appel réseau, aucune clé dans ce repo. Points d'intégration marqués `TODO(STRIPE)` dans `src/main.js` :

1. Créer les 3 produits dans Stripe (compte Axe C Studio, paiements uniques)
2. Fonction serverless `/api/stripe/checkout` (Vercel) → Checkout Session
3. Webhook Stripe → déblocage des droits

Règle d'or : **chaque achat enlève la pub définitivement.**

## Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run check    # node tools/check_sync.mjs (synchro sons + i18n)
```

Astuce dev : `?dev=unlock` débloque tous les packs en local (à retirer avant le lancement).

## Déploiement

Site statique (`dist/`) — prévu pour Vercel. Aucun secret requis côté client.
