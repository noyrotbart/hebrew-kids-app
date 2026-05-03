// Curriculum: 7 lessons grouping the 22 letters in alphabet order.
// Each lesson teaches 3–4 letters and ships with two word lists:
//   - words:           a curated set used by Flashcards / Listen / Matching.
//                      Prefers words built only from cumulative letters; falls back to
//                      words that simply *feature* one of the new letters when that's
//                      too sparse (early lessons), so kids always see meaningful words.
//   - spellableWords:  strict subset where every letter has been introduced. Used by
//                      Spelling so kids never have to assemble letters they haven't met.

import { ALPHABET } from './alphabet.js';
import { WORDS } from './words.js';

const groupLetters = [
  ['alef', 'bet', 'gimel'],
  ['dalet', 'he', 'vav'],
  ['zayin', 'het', 'tet'],
  ['yod', 'kaf', 'lamed'],
  ['mem', 'nun', 'samex'],
  ['ayin', 'pe', 'tsadi'],
  ['kof', 'resh', 'shin', 'tav'],
];

const MIN_WORDS = 4;
const MAX_WORDS = 6;

const cumulativeLetters = [];
export const LESSONS = groupLetters.map((ids, i) => {
  const newLetters = ids.map(id => ALPHABET.find(l => l.id === id));
  cumulativeLetters.push(...newLetters.map(l => l.heb));
  const allowed = new Set(cumulativeLetters);
  const newSet = new Set(newLetters.map(l => l.heb));

  const strict = WORDS
    .filter(w => w.letters.every(l => allowed.has(l)))
    .sort((a, b) => a.letters.length - b.letters.length);

  // Pad with words that *feature* a new letter, even if other letters aren't yet introduced.
  // Kids meet those letters as exposure here, then formally learn them in later lessons.
  let words = strict.slice(0, MAX_WORDS);
  if (words.length < MIN_WORDS) {
    const extra = WORDS
      .filter(w => !words.some(x => x.id === w.id))
      .filter(w => w.letters.some(l => newSet.has(l)))
      .sort((a, b) => a.letters.length - b.letters.length);
    for (const w of extra) {
      if (words.length >= MIN_WORDS) break;
      words.push(w);
    }
  }

  return {
    id: `lesson-${i + 1}`,
    index: i,
    number: i + 1,
    title: `שיעור ${i + 1}`,
    letters: newLetters,
    cumulativeLetters: [...cumulativeLetters],
    words,
    spellableWords: strict.slice(0, MAX_WORDS),
  };
});

export const LESSON_BY_ID = Object.fromEntries(LESSONS.map(l => [l.id, l]));

export const NUM_LESSONS = LESSONS.length;
