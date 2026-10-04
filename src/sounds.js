// Source de vérité pour les 46 sons (10 gratuits + 6 packs de 6).
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
  // ---- Pack « Jardin japonais » (6) — 2,99 $ ----
  { id: 'fontaine-bambou',  file: 'sounds/fontaine-bambou.mp3',  icon: 'fountain-bamboo', trim: 17.64, pack: 'japon', fr: 'Fontaine de bambou',   en: 'Bamboo fountain' },
  { id: 'carillon-vent',    file: 'sounds/carillon-vent.mp3',    icon: 'windchime',       trim: -1.42, pack: 'japon', fr: 'Carillon à vent',       en: 'Wind chime' },
  { id: 'ruisseau-zen',     file: 'sounds/ruisseau-zen.mp3',     icon: 'stream-zen',      trim: -2.76, pack: 'japon', fr: 'Ruisseau zen',          en: 'Zen stream' },
  { id: 'cigales',          file: 'sounds/cigales.mp3',          icon: 'cicadas',         trim: -11.6, pack: 'japon', fr: 'Cigales',               en: 'Cicadas' },
  { id: 'vent-bambous',     file: 'sounds/vent-bambous.mp3',     icon: 'bamboo',          trim: 18.92, pack: 'japon', fr: 'Vent dans les bambous', en: 'Wind in bamboo' },
  { id: 'bol-chantant',     file: 'sounds/bol-chantant.mp3',     icon: 'singing-bowl',    trim: -10.74, pack: 'japon', fr: 'Bol chantant',          en: 'Singing bowl' },
  // ---- Pack « Côte sauvage » (6) — 2,99 $ ----
  { id: 'vagues-rochers',   file: 'sounds/vagues-rochers.mp3',   icon: 'waves-rocks',     trim: -5.14, pack: 'cote', fr: 'Vagues sur les rochers', en: 'Waves on rocks' },
  { id: 'vent-cotier',      file: 'sounds/vent-cotier.mp3',      icon: 'wind-coast',      trim: 10.99, pack: 'cote', fr: 'Vent côtier',            en: 'Coastal wind' },
  { id: 'mouettes',         file: 'sounds/mouettes.mp3',         icon: 'seagull',         trim: 7.99, pack: 'cote', fr: 'Mouettes',               en: 'Seagulls' },
  { id: 'corne-brume',      file: 'sounds/corne-brume.mp3',      icon: 'foghorn',         trim: -0.4, pack: 'cote', fr: 'Corne de brume',         en: 'Foghorn' },
  { id: 'galets',           file: 'sounds/galets.mp3',           icon: 'pebbles',         trim: -24.14, pack: 'cote', fr: 'Galets roulés',          en: 'Rolling pebbles' },
  { id: 'pluie-fine',       file: 'sounds/pluie-fine.mp3',       icon: 'drizzle',         trim: 21.02, pack: 'cote', fr: 'Pluie fine',             en: 'Drizzle' },
  // ---- Pack « Nuit au camp » (6) — 2,99 $ ----
  { id: 'feu-de-camp',      file: 'sounds/feu-de-camp.mp3',      icon: 'campfire',        trim: 8.1, pack: 'camp', fr: 'Feu de camp',            en: 'Campfire' },
  { id: 'hibou',            file: 'sounds/hibou.mp3',            icon: 'owl',             trim: 3.18, pack: 'camp', fr: 'Hibou',                  en: 'Owl' },
  { id: 'pluie-sur-tente',  file: 'sounds/pluie-sur-tente.mp3',  icon: 'tent-rain',       trim: -2.97, pack: 'camp', fr: 'Pluie sur la tente',     en: 'Rain on a tent' },
  { id: 'vent-feuilles',    file: 'sounds/vent-feuilles.mp3',    icon: 'leaves',          trim: 18.27, pack: 'camp', fr: 'Vent dans les feuilles', en: 'Wind in leaves' },
  { id: 'bois-craque',      file: 'sounds/bois-craque.mp3',      icon: 'wood-crack',      trim: -0.53, pack: 'camp', fr: 'Bois qui craque',        en: 'Creaking wood' },
  { id: 'loup',             file: 'sounds/loup.mp3',             icon: 'wolf',            trim: 3.44, pack: 'camp', fr: 'Loup lointain',          en: 'Distant wolf' },
  // ---- Pack « Pluie tropicale » (6) — 2,99 $ ----
  { id: 'averse-tropicale', file: 'sounds/averse-tropicale.mp3', icon: 'downpour',        trim: -0.69, pack: 'tropical', fr: 'Averse tropicale',    en: 'Tropical downpour' },
  { id: 'grenouilles',      file: 'sounds/grenouilles.mp3',      icon: 'frogs',           trim: -7.62, pack: 'tropical', fr: 'Grenouilles',         en: 'Frogs' },
  { id: 'oiseaux-tropicaux',file: 'sounds/oiseaux-tropicaux.mp3',icon: 'tropical-bird',   trim: -2.46, pack: 'tropical', fr: 'Oiseaux tropicaux',   en: 'Tropical birds' },
  { id: 'ruisseau-jungle',  file: 'sounds/ruisseau-jungle.mp3',  icon: 'stream-jungle',   trim: 1.45, pack: 'tropical', fr: 'Ruisseau de jungle',  en: 'Jungle stream' },
  { id: 'vent-palmiers',    file: 'sounds/vent-palmiers.mp3',    icon: 'palms',           trim: -0.22, pack: 'tropical', fr: 'Vent dans les palmiers', en: 'Wind in palms' },
  { id: 'cascade',          file: 'sounds/cascade.mp3',          icon: 'waterfall',       trim: -9.47, pack: 'tropical', fr: 'Cascade',             en: 'Waterfall' },
];

export const PACKS = {
  orage:   { fr: 'Orage',          en: 'Storm',          price: '2,99 $', icon: 'thunder' },
  boreale: { fr: 'Forêt boréale',  en: 'Boreal forest',  price: '2,99 $', icon: 'pines' },
  japon:   { fr: 'Jardin japonais',en: 'Japanese garden',price: '2,99 $', icon: 'torii' },
  cote:    { fr: 'Côte sauvage',   en: 'Wild coast',     price: '2,99 $', icon: 'cliff' },
  camp:    { fr: 'Nuit au camp',   en: 'Night at camp',  price: '2,99 $', icon: 'tent' },
  tropical:{ fr: 'Pluie tropicale',en: 'Tropical rain',  price: '2,99 $', icon: 'palm' },
};

export const LIFETIME_PRICE = '12,99 $';
