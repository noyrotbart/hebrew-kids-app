// Curriculum: two levels.
//   Beginner — 7 lessons, each teaching 3-4 letters via the 4-stage flow
//              (Flashcards → Listen → Speak → Spell).
//   Intermediate — story composition lessons, each one wrapping a few scenes
//              that the kid assembles from a tray of word tiles.
//
// Intermediate lessons unlock once any beginner lesson has earned at least one
// star — the kid has met some letters and is ready to build sentences.

import { ALPHABET } from './alphabet.js';
import { WORDS } from './words.js';
import { SCENES } from './scenes.js';

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
export const BEGINNER_LESSONS = groupLetters.map((ids, i) => {
  const newLetters = ids.map(id => ALPHABET.find(l => l.id === id));
  cumulativeLetters.push(...newLetters.map(l => l.heb));
  const allowed = new Set(cumulativeLetters);
  const newSet = new Set(newLetters.map(l => l.heb));

  const strict = WORDS
    .filter(w => w.letters.every(l => allowed.has(l)))
    .sort((a, b) => a.letters.length - b.letters.length);

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
    level: 'beginner',
    index: i,
    number: i + 1,
    title: `שיעור ${i + 1}`,
    letters: newLetters,
    cumulativeLetters: [...cumulativeLetters],
    words,
    spellableWords: strict.slice(0, MAX_WORDS),
  };
});

// Each intermediate lesson packages 2-3 scenes into a single StoryCompose run.
const intermediateChunks = chunk(SCENES, 2);
export const INTERMEDIATE_LESSONS = intermediateChunks.map((scenes, i) => ({
  id: `int-${i + 1}`,
  level: 'intermediate',
  index: i,
  number: i + 1,
  title: `סיפור ${i + 1}`,
  scenes,
}));

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export const LESSONS = [...BEGINNER_LESSONS, ...INTERMEDIATE_LESSONS];
export const LESSON_BY_ID = Object.fromEntries(LESSONS.map(l => [l.id, l]));

export const NUM_LESSONS = LESSONS.length;
