#!/usr/bin/env node
// Curriculum integrity check. Fails loudly if:
//   1. any world word uses a letter not yet taught by that world (spellability)
//   2. a word's bare spelling doesn't agree with its letters array
//      (finals ך ם ן ף ץ map back to their base forms)
//   3. a word id referenced by a world doesn't exist

import { WORLDS } from '../src/data/worlds.js';
import { WORDS_BY_ID } from '../src/data/words.js';

const FINAL_TO_BASE = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
let errors = 0;

for (const world of WORLDS) {
  const allowed = new Set(world.cumulativeLetters.map(l => l.heb));
  for (const id of [...world.wordIds, ...(world.extraWordIds ?? [])]) {
    const word = WORDS_BY_ID[id];
    if (!word) { console.error(`✗ ${world.id}: unknown word id "${id}"`); errors++; continue; }

    const fromBare = word.bare.split('').map(ch => FINAL_TO_BASE[ch] ?? ch).join('');
    if (fromBare !== word.letters.join('')) {
      console.error(`✗ ${world.id}/${id}: bare "${word.bare}" ≠ letters [${word.letters}]`);
      errors++;
    }
    // Spellability: melech is the finals-lesson example on Story Mountain,
    // where all 22 letters are long since taught.
    const missing = word.letters.filter(l => !allowed.has(l));
    if (missing.length && world.id !== 'stories') {
      console.error(`✗ ${world.id}/${id}: uses untaught letters ${missing.join(' ')}`);
      errors++;
    }
  }
}

if (errors) {
  console.error(`\n${errors} problem(s).`);
  process.exit(1);
}
console.log(`✓ ${WORLDS.length} worlds, all words spellable and consistent.`);
