// Source de vérité pour les 22 sons V1.
// `file` : chemin dans /public/sounds/. Sons réels intégrés le 2026-09-29
// (CC0 Freesound + 1 domaine public NPS). Crédits : SOUNDS_CREDITS.md.
// Le service worker (public/sw.js) duplique cette liste (SOUND_FILES) pour le
// pré-cache hors-ligne : un test (tools/check_sync.mjs) vérifie la synchro.

export const SOUNDS = [
  // ---- Gratuits (10) ----
  { id: 'pluie-douce',       file: 'sounds/pluie-douce.mp3',       icon: '🌧️', pack: null, fr: 'Pluie douce',      en: 'Gentle rain' },
  { id: 'tonnerre-lointain', file: 'sounds/tonnerre-lointain.mp3', icon: '⛈️', pack: null, fr: 'Tonnerre lointain', en: 'Distant thunder' },
  { id: 'vagues',            file: 'sounds/vagues.mp3',            icon: '🌊', pack: null, fr: 'Vagues',            en: 'Ocean waves' },
  { id: 'vent',              file: 'sounds/vent.mp3',              icon: '🍃', pack: null, fr: 'Vent',              en: 'Wind' },
  { id: 'feu-foyer',         file: 'sounds/feu-foyer.mp3',          icon: '🔥', pack: null, fr: 'Feu de foyer',      en: 'Fireplace' },
  { id: 'cafe-anime',        file: 'sounds/cafe-anime.mp3',        icon: '☕', pack: null, fr: 'Café animé',        en: 'Busy café' },
  { id: 'oiseaux',           file: 'sounds/oiseaux.mp3',           icon: '🐦', pack: null, fr: 'Oiseaux',           en: 'Birds' },
  { id: 'grillons',          file: 'sounds/grillons.mp3',          icon: '🦗', pack: null, fr: 'Grillons',          en: 'Crickets' },
  { id: 'bruit-blanc',       file: 'sounds/bruit-blanc.mp3',       icon: '📻', pack: null, fr: 'Bruit blanc pur',   en: 'Pure white noise' },
  { id: 'ventilateur',       file: 'sounds/ventilateur.mp3',       icon: '🌀', pack: null, fr: 'Ventilateur',       en: 'Fan' },
  // ---- Pack « Orage » (6) — 4,99 $ ----
  { id: 'pluie-battante',    file: 'sounds/pluie-battante.mp3',    icon: '🌧️', pack: 'orage', fr: 'Pluie battante',  en: 'Heavy rain' },
  { id: 'tonnerre-proche',   file: 'sounds/tonnerre-proche.mp3',   icon: '⚡', pack: 'orage', fr: 'Tonnerre proche', en: 'Close thunder' },
  { id: 'pluie-sur-vitre',   file: 'sounds/pluie-sur-vitre.mp3',   icon: '🪟', pack: 'orage', fr: 'Pluie sur vitre', en: 'Rain on glass' },
  { id: 'vent-tempete',      file: 'sounds/vent-tempete.mp3',      icon: '🌪️', pack: 'orage', fr: 'Vent de tempête', en: 'Storm wind' },
  { id: 'grele',             file: 'sounds/grele.mp3',             icon: '🧊', pack: 'orage', fr: 'Grêle',           en: 'Hail' },
  { id: 'ruisseau-en-crue',  file: 'sounds/ruisseau-en-crue.mp3',  icon: '🏞️', pack: 'orage', fr: 'Ruisseau en crue', en: 'Rushing stream' },
  // ---- Pack « Forêt boréale » (6) — 4,99 $ ----
  { id: 'huard',             file: 'sounds/huard.mp3',             icon: '🪶', pack: 'boreale', fr: 'Huard',              en: 'Loon' },
  { id: 'vent-pins',         file: 'sounds/vent-pins.mp3',         icon: '🌲', pack: 'boreale', fr: 'Vent dans les pins', en: 'Wind in the pines' },
  { id: 'ruisseau-forestier',file: 'sounds/ruisseau-forestier.mp3',icon: '💧', pack: 'boreale', fr: 'Ruisseau forestier', en: 'Forest stream' },
  { id: 'branches',          file: 'sounds/branches.mp3',          icon: '🪵', pack: 'boreale', fr: 'Branches qui craquent', en: 'Cracking branches' },
  { id: 'pluie-en-foret',    file: 'sounds/pluie-en-foret.mp3',    icon: '🍂', pack: 'boreale', fr: 'Pluie en forêt',     en: 'Forest rain' },
  { id: 'mesanges',          file: 'sounds/mesanges.wav',          icon: '🐤', pack: 'boreale', fr: 'Mésanges',           en: 'Chickadees' },
];

export const PACKS = {
  orage:   { fr: 'Orage',          en: 'Storm',          price: '4,99 $', icon: '⛈️' },
  boreale: { fr: 'Forêt boréale',  en: 'Boreal forest',  price: '4,99 $', icon: '🌲' },
};

export const LIFETIME_PRICE = '19,99 $';
