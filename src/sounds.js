// Source de vérité pour les 22 sons V1.
// `file` : chemin dans /public/sounds/. Sons réels intégrés le 2026-09-29
// (CC0 Freesound + 1 domaine public NPS). Crédits : SOUNDS_CREDITS.md.
// `trim` : normalisation du volume en dB, mesurée au loudnorm (cible -24 LUFS,
// pic réel plafonné à -1 dBTP) — 2026-09-29. Le moteur l'applique comme gain.
// Le service worker (public/sw.js) duplique cette liste (SOUND_FILES) pour le
// pré-cache hors-ligne : un test (tools/check_sync.mjs) vérifie la synchro.

export const SOUNDS = [
  // ---- Gratuits (10) ----
  { id: 'pluie-douce', trim: 16.7,       file: 'sounds/pluie-douce.mp3',       icon: 'rain', pack: null, fr: 'Pluie douce',      en: 'Gentle rain' },
  { id: 'tonnerre-lointain', trim: 11.4, file: 'sounds/tonnerre-lointain.mp3', icon: 'thunder', pack: null, fr: 'Tonnerre lointain', en: 'Distant thunder' },
  { id: 'vagues', trim: 20.7,            file: 'sounds/vagues.mp3',            icon: 'waves', pack: null, fr: 'Vagues',            en: 'Ocean waves' },
  { id: 'vent', trim: -6.3,              file: 'sounds/vent.mp3',              icon: 'wind', pack: null, fr: 'Vent',              en: 'Wind' },
  { id: 'feu-foyer', trim: -1.0,         file: 'sounds/feu-foyer.mp3',          icon: 'fire', pack: null, fr: 'Feu de foyer',      en: 'Fireplace' },
  { id: 'cafe-anime', trim: 18.6,        file: 'sounds/cafe-anime.mp3',        icon: 'cafe', pack: null, fr: 'Café animé',        en: 'Busy café' },
  { id: 'oiseaux', trim: -0.3,           file: 'sounds/oiseaux.mp3',           icon: 'birds', pack: null, fr: 'Oiseaux',           en: 'Birds' },
  { id: 'grillons', trim: 14.2,          file: 'sounds/grillons.mp3',          icon: 'crickets', pack: null, fr: 'Grillons',          en: 'Crickets' },
  { id: 'bruit-blanc', trim: -18.8,       file: 'sounds/bruit-blanc.mp3',       icon: 'whitenoise', pack: null, fr: 'Bruit blanc pur',   en: 'Pure white noise' },
  { id: 'ventilateur', trim: 9.2,       file: 'sounds/ventilateur.mp3',       icon: 'fan', pack: null, fr: 'Ventilateur',       en: 'Fan' },
  // ---- Pack « Orage » (6) — 2,99 $ ----
  { id: 'pluie-battante', trim: 12.2,    file: 'sounds/pluie-battante.mp3',    icon: 'rain-heavy', pack: 'orage', fr: 'Pluie battante',  en: 'Heavy rain' },
  { id: 'tonnerre-proche', trim: -0.8,   file: 'sounds/tonnerre-proche.mp3',   icon: 'thunder-near', pack: 'orage', fr: 'Tonnerre proche', en: 'Close thunder' },
  { id: 'pluie-sur-vitre', trim: 10.3,   file: 'sounds/pluie-sur-vitre.mp3',   icon: 'rain-glass', pack: 'orage', fr: 'Pluie sur vitre', en: 'Rain on glass' },
  { id: 'vent-tempete', trim: 7.2,      file: 'sounds/vent-tempete.mp3',      icon: 'wind-storm', pack: 'orage', fr: 'Vent de tempête', en: 'Storm wind' },
  { id: 'grele', trim: 4.8,             file: 'sounds/grele.mp3',             icon: 'hail', pack: 'orage', fr: 'Grêle',           en: 'Hail' },
  { id: 'ruisseau-en-crue', trim: 2.4,  file: 'sounds/ruisseau-en-crue.mp3',  icon: 'stream', pack: 'orage', fr: 'Ruisseau en crue', en: 'Rushing stream' },
  // ---- Pack « Forêt boréale » (6) — 2,99 $ ----
  { id: 'huard', trim: 5.5,             file: 'sounds/huard.mp3',             icon: 'loon', pack: 'boreale', fr: 'Huard',              en: 'Loon' },
  { id: 'vent-pins', trim: 16.7,         file: 'sounds/vent-pins.mp3',         icon: 'pines', pack: 'boreale', fr: 'Vent dans les pins', en: 'Wind in the pines' },
  { id: 'ruisseau-forestier', trim: 24.6,file: 'sounds/ruisseau-forestier.mp3',icon: 'stream-forest', pack: 'boreale', fr: 'Ruisseau forestier', en: 'Forest stream' },
  { id: 'branches', trim: -3.7,          file: 'sounds/branches.mp3',          icon: 'branches', pack: 'boreale', fr: 'Branches qui craquent', en: 'Cracking branches' },
  { id: 'pluie-en-foret', trim: 17.9,    file: 'sounds/pluie-en-foret.mp3',    icon: 'rain-forest', pack: 'boreale', fr: 'Pluie en forêt',     en: 'Forest rain' },
  { id: 'mesanges', trim: -11.8,          file: 'sounds/mesanges.wav',          icon: 'chickadees', pack: 'boreale', fr: 'Mésanges',           en: 'Chickadees' },
];

export const PACKS = {
  orage:   { fr: 'Orage',          en: 'Storm',          price: '2,99 $', icon: 'thunder' },
  boreale: { fr: 'Forêt boréale',  en: 'Boreal forest',  price: '2,99 $', icon: 'pines' },
};

export const LIFETIME_PRICE = '9,99 $';
