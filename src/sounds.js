// Source de vérité pour les 22 sons V1.
// `file` : chemin dans /public/sounds/. Les fichiers réels (libres de droits)
// remplaceront les placeholders TEMP-*.wav — mettre à jour `file` ici à ce moment-là.
// Le service worker (public/sw.js) duplique cette liste (SOUND_FILES) pour le
// pré-cache hors-ligne : un test (tools/check_sync.mjs) vérifie la synchro.

export const SOUNDS = [
  // ---- Gratuits (10) ----
  { id: 'pluie-douce',       file: 'sounds/TEMP-pluie-douce.wav',       icon: '🌧️', pack: null, fr: 'Pluie douce',      en: 'Gentle rain' },
  { id: 'tonnerre-lointain', file: 'sounds/TEMP-tonnerre-lointain.wav', icon: '⛈️', pack: null, fr: 'Tonnerre lointain', en: 'Distant thunder' },
  { id: 'vagues',            file: 'sounds/TEMP-vagues.wav',            icon: '🌊', pack: null, fr: 'Vagues',            en: 'Ocean waves' },
  { id: 'vent',              file: 'sounds/TEMP-vent.wav',              icon: '🍃', pack: null, fr: 'Vent',              en: 'Wind' },
  { id: 'feu-foyer',         file: 'sounds/TEMP-feu-foyer.wav',          icon: '🔥', pack: null, fr: 'Feu de foyer',      en: 'Fireplace' },
  { id: 'cafe-anime',        file: 'sounds/TEMP-cafe-anime.wav',        icon: '☕', pack: null, fr: 'Café animé',        en: 'Busy café' },
  { id: 'oiseaux',           file: 'sounds/TEMP-oiseaux.wav',           icon: '🐦', pack: null, fr: 'Oiseaux',           en: 'Birds' },
  { id: 'grillons',          file: 'sounds/TEMP-grillons.wav',          icon: '🦗', pack: null, fr: 'Grillons',          en: 'Crickets' },
  { id: 'bruit-blanc',       file: 'sounds/TEMP-bruit-blanc.wav',       icon: '📻', pack: null, fr: 'Bruit blanc pur',   en: 'Pure white noise' },
  { id: 'ventilateur',       file: 'sounds/TEMP-ventilateur.wav',       icon: '🌀', pack: null, fr: 'Ventilateur',       en: 'Fan' },
  // ---- Pack « Orage » (6) — 4,99 $ ----
  { id: 'pluie-battante',    file: 'sounds/TEMP-pluie-battante.wav',    icon: '🌧️', pack: 'orage', fr: 'Pluie battante',  en: 'Heavy rain' },
  { id: 'tonnerre-proche',   file: 'sounds/TEMP-tonnerre-proche.wav',   icon: '⚡', pack: 'orage', fr: 'Tonnerre proche', en: 'Close thunder' },
  { id: 'pluie-sur-vitre',   file: 'sounds/TEMP-pluie-sur-vitre.wav',   icon: '🪟', pack: 'orage', fr: 'Pluie sur vitre', en: 'Rain on glass' },
  { id: 'vent-tempete',      file: 'sounds/TEMP-vent-tempete.wav',      icon: '🌪️', pack: 'orage', fr: 'Vent de tempête', en: 'Storm wind' },
  { id: 'grele',             file: 'sounds/TEMP-grele.wav',             icon: '🧊', pack: 'orage', fr: 'Grêle',           en: 'Hail' },
  { id: 'ruisseau-en-crue',  file: 'sounds/TEMP-ruisseau-en-crue.wav',  icon: '🏞️', pack: 'orage', fr: 'Ruisseau en crue', en: 'Rushing stream' },
  // ---- Pack « Forêt boréale » (6) — 4,99 $ ----
  { id: 'huard',             file: 'sounds/TEMP-huard.wav',             icon: '🪶', pack: 'boreale', fr: 'Huard',              en: 'Loon' },
  { id: 'vent-pins',         file: 'sounds/TEMP-vent-pins.wav',         icon: '🌲', pack: 'boreale', fr: 'Vent dans les pins', en: 'Wind in the pines' },
  { id: 'ruisseau-forestier',file: 'sounds/TEMP-ruisseau-forestier.wav',icon: '💧', pack: 'boreale', fr: 'Ruisseau forestier', en: 'Forest stream' },
  { id: 'branches',          file: 'sounds/TEMP-branches.wav',          icon: '🪵', pack: 'boreale', fr: 'Branches qui craquent', en: 'Cracking branches' },
  { id: 'pluie-en-foret',    file: 'sounds/TEMP-pluie-en-foret.wav',    icon: '🍂', pack: 'boreale', fr: 'Pluie en forêt',     en: 'Forest rain' },
  { id: 'mesanges',          file: 'sounds/TEMP-mesanges.wav',          icon: '🐤', pack: 'boreale', fr: 'Mésanges',           en: 'Chickadees' },
];

export const PACKS = {
  orage:   { fr: 'Orage',          en: 'Storm',          price: '4,99 $', icon: '⛈️' },
  boreale: { fr: 'Forêt boréale',  en: 'Boreal forest',  price: '4,99 $', icon: '🌲' },
};

export const LIFETIME_PRICE = '19,99 $';
