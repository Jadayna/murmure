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
