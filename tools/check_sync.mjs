// Vérifie : 1) la liste des sons est identique entre src/sounds.js et public/sw.js
//            2) les clés i18n FR et EN sont en parité.
// Usage : npm run check
import { readFileSync } from 'fs';

let fail = false;

// 1) synchro sons
const soundsSrc = readFileSync('src/sounds.js', 'utf8');
const swSrc = readFileSync('public/sw.js', 'utf8');
const fromSounds = [...soundsSrc.matchAll(/file:\s*'([^']+)'/g)].map(m => m[1]).sort();
const fromSW = [...swSrc.matchAll(/'([^']+\.wav)'/g)].map(m => m[1]).sort();
const onlyA = fromSounds.filter(f => !fromSW.includes(f));
const onlyB = fromSW.filter(f => !fromSounds.includes(f));
if (onlyA.length || onlyB.length || fromSounds.length === 0) {
  fail = true;
  console.error('❌ sons désynchronisés');
  if (onlyA.length) console.error('  dans sounds.js seulement :', onlyA);
  if (onlyB.length) console.error('  dans sw.js seulement :', onlyB);
} else {
  console.log(`✅ ${fromSounds.length} sons synchronisés (sounds.js ↔ sw.js)`);
}

// 2) parité i18n — compare les blocs fr: et en: de src/i18n.js
const i18n = readFileSync('src/i18n.js', 'utf8');
const block = (lang) => {
  const m = i18n.match(new RegExp(lang + ':\\s*\\{([\\s\\S]*?)\\n  \\},'));
  return m ? [...m[1].matchAll(/^\s*(\w+):/gm)].map(x => x[1]).sort() : [];
};
const fr = block('fr'), en = block('en');
const missEn = fr.filter(k => !en.includes(k));
const missFr = en.filter(k => !fr.includes(k));
if (missEn.length || missFr.length) {
  fail = true;
  console.error('❌ i18n non paritaire');
  if (missEn.length) console.error('  manque en EN :', missEn);
  if (missFr.length) console.error('  manque en FR :', missFr);
} else {
  console.log(`✅ i18n paritaire (${fr.length} clés FR/EN)`);
}

process.exit(fail ? 1 : 0);
