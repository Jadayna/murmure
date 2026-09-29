// White Murmure — bibliothèque d'icônes SVG (style ligne, 24×24).
// Zéro emoji dans l'interface : chaque son et chaque action a son pictogramme.

const svg = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const CLOUD = '<path d="M7 11a3.5 3.5 0 1 1 .7-6.9A5 5 0 0 1 17.4 5.6 3.6 3.6 0 0 1 18 12H7z"/>';

export const ICONS = {
  // ---- Sons gratuits ----
  rain: svg(`${CLOUD}<path d="M8 15.5 7 19M12.5 15.5 11.5 19M17 15.5 16 19"/>`),
  thunder: svg(`${CLOUD}<path d="M12.5 11 9.5 15.5h2.6L11 20l4.5-6.5h-2.6l1.6-2.5z"/>`),
  waves: svg('<path d="M2 9.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 15.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>'),
  wind: svg('<path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2"/>'),
  fire: svg('<path d="M12 22c3.9 0 6.5-2.8 6.5-6.7 0-4-3.2-5.8-4.4-9.1-.5 1.5-1.6 2.6-3.1 3 .4-2.3-.3-4.9-1.9-7.2C7.4 4.4 5.5 8.6 5.5 13.3 5.5 18.2 8.1 22 12 22z"/><path d="M12 22c-1.9 0-3.2-1.4-3.2-3.2 0-2.1 2.1-3.1 2.6-5.2.9 1.1 2.6 2.1 2.6 4.4 0 2.3-1.1 4-2 4z"/>'),
  cafe: svg('<path d="M17 9h1.5a3.5 3.5 0 0 1 0 7H17"/><path d="M3 9h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V9z"/><path d="M7 3.5c0 1 .8 1.2.8 2.2M11 3.5c0 1 .8 1.2.8 2.2"/>'),
  birds: svg('<path d="M2.5 14.5c1.8-2.4 3.8-2.4 5.6 0 1.8-2.4 3.8-2.4 5.6 0"/><path d="M9.5 9.5c1.5-2 3-2 4.5 0 1.5-2 3-2 4.5 0"/>'),
  crickets: svg('<ellipse cx="12" cy="13.5" rx="3.2" ry="4.5"/><path d="M12 9V4.5M9.6 5.3 11 9M14.4 5.3 13 9"/><path d="M8.8 11.5 4.5 9.5M8.8 14H4M8.8 16.5l-4.3 2M15.2 11.5l4.3-2M15.2 14H20M15.2 16.5l4.3 2"/>'),
  whitenoise: svg('<path d="M11 5 6.5 9H3v6h3.5L11 19V5z"/><path d="M15 9.5a4 4 0 0 1 0 5M17.8 7a8 8 0 0 1 0 10"/>'),
  fan: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 10.5C10.6 8.2 10.4 5.6 11.6 3.9M13.5 12.7c2.7.5 4.9 2 5.7 3.8M10.5 12.7c-2.7.5-4.9 2-5.7 3.8"/>'),

  // ---- Pack Orage ----
  'rain-heavy': svg(`${CLOUD}<path d="M7 15.5 6 19M10.8 15.5l-1 3.5M14.6 15.5l-1 3.5M18.4 15.5l-1 3.5"/>`),
  'thunder-near': svg('<path d="M13 2 5 13.5h5.5L10 22l8-11.5h-5.5L13 2z"/>'),
  'rain-glass': svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18"/><path d="M8 14.5 7.2 17M16 15.5l-.8 2.5"/>'),
  'wind-storm': svg('<path d="M2 9h7M2 13h9M2 17h7"/><path d="M15 5c2.8 0 5 2.2 5 5s-2.2 6-5 6c-2.3 0-4-1.7-4-4 0-1.8 1.4-3.2 3.2-3.2"/>'),
  hail: svg(`${CLOUD}<circle cx="9" cy="16.8" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="18.2" r="1" fill="currentColor" stroke="none"/><circle cx="16.6" cy="16" r="1" fill="currentColor" stroke="none"/>`),
  stream: svg('<path d="M7 3c-2.2 2.8 2.2 4.2 0 7s2.2 4.2 0 7"/><path d="M12 3c-2.2 2.8 2.2 4.2 0 7s2.2 4.2 0 7"/><path d="M17 3c-2.2 2.8 2.2 4.2 0 7s2.2 4.2 0 7"/>'),

  // ---- Pack Forêt boréale ----
  loon: svg('<ellipse cx="10.5" cy="14" rx="5" ry="2.8"/><path d="M14.8 13.2c.4-2.8 1.4-4.8 2.9-6"/><circle cx="18.3" cy="6.4" r="1.7"/><path d="M19.8 6.4h2.2"/><circle cx="18.7" cy="6" r=".55" fill="currentColor" stroke="none"/><path d="M3 19.5c1.8 1.2 3.6 1.2 5.4 0s3.6-1.2 5.4 0 3.6 1.2 5.4 0"/>'),
  pines: svg('<path d="M12 2.5 16.5 9h-2.6l3.6 5.5H6.5L10.1 9H7.5L12 2.5z"/><path d="M12 14.5V21"/><path d="M1.5 8h4M1.5 12h5"/>'),
  'stream-forest': svg('<path d="M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><circle cx="7" cy="8.5" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="17" cy="8.5" r="1.2"/>'),
  branches: svg('<path d="M5 19 15 9"/><path d="M9.5 14.5 5.5 14M12 12l.8-4.5M14.5 9.5 19 8.5"/><path d="M5.5 14 4 12M19 8.5l1.5-2"/>'),
  'rain-forest': svg('<path d="M12 3l3.2 4.6h-2L15.8 12H8.2l2.6-4.4h-2L12 3z"/><path d="M12 12v4"/><path d="M5.5 16 4.5 19M18.5 16l-1 3"/>'),
  chickadees: svg('<circle cx="12" cy="10.5" r="4.2"/><path d="M15.8 11.5 20 14.5"/><path d="M16 9.5l2.6-.6"/><circle cx="13.2" cy="9.4" r=".55" fill="currentColor" stroke="none"/><path d="M10.8 14.4 10 19M13.2 14.4l.8 4.6"/><path d="M7 21h10"/>'),

  // ---- Pack Jardin japonais ----
  torii: svg('<path d="M3.5 6.5c3 1.2 5.8 1.8 8.5 1.8s5.5-.6 8.5-1.8"/><path d="M6 8v12M18 8v12"/><path d="M9.5 10.5h5"/><path d="M10.5 10.5V17M13.5 10.5V17"/>'),
  'fountain-bamboo': svg('<path d="M3 7.5 13 4.5l1 3-10 3z"/><path d="M11.5 12.5c0 2-1 3.2-1 5.5M14.5 13.5c0 2-1 3.2-1 5.5"/><path d="M6 21h12"/>'),
  windchime: svg('<path d="M4 4.5h16"/><path d="M8 4.5V9M12 4.5v11M16 4.5V9"/><rect x="6.3" y="9" width="3.4" height="6" rx="1"/><rect x="10.3" y="15.5" width="3.4" height="5" rx="1"/><rect x="14.3" y="9" width="3.4" height="6" rx="1"/>'),
  'stream-zen': svg('<circle cx="12" cy="7.5" r="4"/><path d="M2 16.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>'),
  cicadas: svg('<ellipse cx="12" cy="13.5" rx="2.6" ry="4"/><path d="M9.6 11.5C6.5 9.5 5 6.8 4.8 4.5c2.6.2 4.6 1.8 5.6 4.5M14.4 11.5c3.1-2 4.6-4.7 4.8-7-2.6.2-4.6 1.8-5.6 4.5"/><path d="M12 9.5V5.5"/>'),
  bamboo: svg('<path d="M8.5 21V7M15.5 21V7"/><path d="M8.5 12h7M8.5 16.5h7"/><path d="M8.5 7C6.5 5 4.5 4.8 3 5.2M15.5 7c2-2 4-2.2 5.5-1.8"/>'),
  'singing-bowl': svg('<path d="M4.5 12.5h15c0 3.8-3.4 6.5-7.5 6.5s-7.5-2.7-7.5-6.5z"/><path d="M15.5 4.5l4.5 4.5"/>'),

  // ---- Pack Côte sauvage ----
  cliff: svg('<path d="M3 16.5 8 7l4 5 3.5-2.5L21 16.5"/><path d="M2 21c2.5 0 2.5-1.8 5-1.8s2.5 1.8 5 1.8 2.5-1.8 5-1.8 2.5 1.8 5 1.8"/>'),
  'waves-rocks': svg('<path d="M8 13.5 11 4.5l3.5 9z"/><path d="M2 17.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>'),
  'wind-coast': svg('<path d="M2 7.5h8.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M2 12h12.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M2 17.5c2.5 0 2.5 1.8 5 1.8s2.5-1.8 5-1.8 2.5 1.8 5 1.8"/>'),
  seagull: svg('<path d="M2.5 15.5c2-2.8 4.2-2.8 6.2 0 2-2.8 4.2-2.8 6.2 0 2-2.8 4.2-2.8 6.2 0"/><path d="M7 9.5c1.4-2 3-2 4.4 0 1.4-2 3-2 4.4 0"/>'),
  foghorn: svg('<path d="M3 10.5h6.5L17 6v12l-7.5-4.5H3z"/><path d="M19 9.5a3.5 3.5 0 0 1 0 5"/>'),
  pebbles: svg('<ellipse cx="8" cy="13.5" rx="3.2" ry="2.3"/><ellipse cx="15.8" cy="16" rx="2.6" ry="1.9"/><ellipse cx="13.2" cy="9.8" rx="2" ry="1.5"/>'),
  drizzle: svg(`${CLOUD}<circle cx="9" cy="16.5" r=".9" fill="currentColor" stroke="none"/><circle cx="13" cy="17.5" r=".9" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16" r=".9" fill="currentColor" stroke="none"/>`),

  // ---- Pack Nuit au camp ----
  tent: svg('<path d="M12 4 4 20h16L12 4z"/><path d="M12 12.5 8.5 20M12 12.5 15.5 20"/>'),
  campfire: svg('<path d="M5.5 17.5 18.5 14M5.5 14l13 3.5"/><path d="M12 12.5c-1.8-2-1.8-4.5.2-6.8.5 1.8 2.4 2.6 2.4 4.8 0 1.6-1.3 2.8-2.6 2z"/>'),
  owl: svg('<circle cx="8.8" cy="9.5" r="2.4"/><circle cx="15.2" cy="9.5" r="2.4"/><circle cx="8.8" cy="9.5" r=".65" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.5" r=".65" fill="currentColor" stroke="none"/><path d="M12 11.5l-1.2 2 1.2 2 1.2-2z"/><path d="M5.5 15.5c0 3.2 2.8 5.5 6.5 5.5s6.5-2.3 6.5-5.5"/>'),
  'tent-rain': svg('<path d="M12 9 5.5 18.5h13L12 9z"/><path d="M7 3.5 6 6M12 2.8l-1 2.7M17 3.5l-1 2.5"/>'),
  leaves: svg('<path d="M5 19.5C5 12.5 10 7.5 19 5.5c-2 9-7 14-14 14z"/><path d="M5 19.5C9 15.5 12.5 12.5 16 9.5"/>'),
  'wood-crack': svg('<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5V9l-2.2 2 3.2 2.2-2.2 2.2 2.4 2.4"/>'),
  wolf: svg('<path d="M6 21.5v-8l8-7.5 4 1-2 4.5 4 2c0 4-4 7-8.5 8"/><path d="M14 6 13 3.5M17.5 7l.8-2.5"/><circle cx="15" cy="11" r=".7" fill="currentColor" stroke="none"/>'),

  // ---- Pack Pluie tropicale ----
  palm: svg('<path d="M12 21.5v-8"/><path d="M12 13.5c-3.2 0-6-2-7-5 3 0 5.5 1 7 2.2 1.5-1.2 4-2.2 7-2.2-1 3-3.8 5-7 5z"/><path d="M12 13.5c0-3 1-5.2 3-7"/>'),
  downpour: svg(`${CLOUD}<path d="M7.5 15.5 6.5 19M11 15.5l-1 3.5M14.5 15.5l-1 3.5M18 15.5l-1 3.5M9.2 15.8l-.8 2.7M16.2 15.8l-.8 2.7"/>`),
  frogs: svg('<ellipse cx="12" cy="14.5" rx="6" ry="4"/><circle cx="8.8" cy="9.5" r="2.1"/><circle cx="15.2" cy="9.5" r="2.1"/><circle cx="8.8" cy="9.5" r=".6" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.5" r=".6" fill="currentColor" stroke="none"/>'),
  'tropical-bird': svg('<ellipse cx="10.5" cy="15.5" rx="5" ry="3.4"/><circle cx="15.5" cy="9.5" r="2.4"/><path d="M17.7 9.3 21.5 11l-3.8 1.4"/><circle cx="16" cy="9" r=".6" fill="currentColor" stroke="none"/><path d="M7.5 17.5 4.5 20.5"/>'),
  'stream-jungle': svg('<path d="M2 16.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M12 3.5c-3 2-4.2 5-3.7 8 3 .5 6-.7 8-3.7C15 5.5 13.5 4 12 3.5z"/>'),
  palms: svg('<path d="M9.5 21.5v-7"/><path d="M9.5 14.5c-2.6 0-4.8-1.6-5.8-4.2 2.6 0 4.7.9 5.8 2 1.1-1.1 3.2-2 5.8-2-1 2.6-3.2 4.2-5.8 4.2z"/><path d="M17 6.5h5M18.5 10.5h4"/>'),
  waterfall: svg('<path d="M4.5 4.5h15"/><path d="M7.5 4.5V14M11.5 4.5v16M15.5 4.5V14"/><path d="M4 19.5c3.5 1.8 12.5 1.8 16 0"/>'),

  // ---- Interface ----
  play: svg('<path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none"/>'),
  pause: svg('<rect x="7" y="5" width="3.6" height="14" rx="1.6" fill="currentColor" stroke="none"/><rect x="13.4" y="5" width="3.6" height="14" rx="1.6" fill="currentColor" stroke="none"/>'),
  lock: svg('<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  infinity: svg('<path d="M12 12c-1.6-2.6-3.6-4.2-5.7-4.2a3.7 3.7 0 1 0 0 7.4c2.1 0 4.1-1.6 5.7-4.2zm0 0c1.6 2.6 3.6 4.2 5.7 4.2a3.7 3.7 0 1 0 0-7.4c-2.1 0-4.1 1.6-5.7 4.2z"/>'),
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  theme: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
};
