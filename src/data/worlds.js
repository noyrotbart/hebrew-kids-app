// The kingdom map: 8 islands, each a themed chunk of the curriculum.
//
// Letters are ordered for fast word unlocks, not alphabetically — א,מ,ב alone
// already spell אבא and אמא, so island 1 pays off in the first five minutes.
// Every island's words are 100% spellable from letters learned so far, so no
// game ever shows a kid a letter they haven't met.
//
// Island trail = one node per letter (meet → trace → bubble hunt), then
// word lab (spelling), echo (mic), memory, and a boss quiz that awards the
// island sticker. Island 8 (Story Mountain) teaches the five final forms and
// full sentences.

import { ALPHABET_BY_ID, FINALS } from './letters.js';
import { WORDS_BY_ID } from './words.js';
import { SCENES } from './scenes.js';
import { TALES } from './tales.js';

const defs = [
  {
    id: 'family',  name: 'אִי הַמִּשְׁפָּחָה',    emoji: '🏡', color: '#FF7A59',
    letterIds: ['alef', 'mem', 'bet'],
    wordIds: ['aba', 'ima'],
    sticker: { emoji: '🦊', name: 'שׁוּעָל הַחִבּוּקִים' },
  },
  {
    id: 'sunsea',  name: 'אִי הַשֶּׁמֶשׁ וְהַיָּם', emoji: '🌞', color: '#3DB7B0',
    letterIds: ['shin', 'yod', 'resh'],
    wordIds: ['shemesh', 'yam', 'mayim', 'shir', 'rosh', 'shamayim'],
    sticker: { emoji: '🐬', name: 'דּוֹלְפִין הַגַּלִּים' },
  },
  {
    id: 'animals', name: 'אִי הַחַיּוֹת',        emoji: '🐾', color: '#3FB87E',
    letterIds: ['lamed', 'dalet', 'gimel'],
    wordIds: ['dag', 'gamal', 'yeled', 'lev', 'regel', 'dvash', 'migdal', 'galgal'],
    sticker: { emoji: '🐢', name: 'צָב הַחָכְמָה' },
  },
  {
    id: 'home',    name: 'אִי הֶחָתוּל וְהַבַּיִת', emoji: '🐱', color: '#7C5CFF',
    letterIds: ['het', 'tav', 'vav'],
    wordIds: ['chatul', 'bayit', 'delet', 'chalav', 'lechem', 'yareach', 'shablul', 'machshev'],
    extraWordIds: ['or', 'vered', 'chamor'],
    sticker: { emoji: '🐱', name: 'חָתוּל הַלַּיְלָה' },
  },
  {
    id: 'school',  name: 'אִי בֵּית הַסֵּפֶר',    emoji: '🎒', color: '#4C9AFF',
    letterIds: ['kaf', 'samex', 'pe'],
    wordIds: ['sefer', 'kise', 'kos', 'kelev', 'sus', 'pil', 'parpar', 'kadur'],
    extraWordIds: ['kochav', 'savta', 'perach', 'tapuach', 'kaftor'],
    sticker: { emoji: '🦉', name: 'יַנְשׁוּף הַסְּפָרִים' },
  },
  {
    id: 'safari',  name: 'אִי הַסָּפָארִי',       emoji: '🦁', color: '#FFB930',
    letterIds: ['he', 'nun', 'kof'],
    wordIds: ['arie', 'har', 'namer', 'kof', 'banana', 'arnav', 'nemala'],
    extraWordIds: ['sfina', 'karnaf'],
    sticker: { emoji: '🦁', name: 'אַרְיֵה הָאֹמֶץ' },
  },
  {
    id: 'garden',  name: 'הַגַּן הַקָּסוּם',      emoji: '🦋', color: '#FF6FA5',
    letterIds: ['ayin', 'tsadi', 'zayin', 'tet'],
    wordIds: ['etz', 'tsipor', 'tapuz', 'zahav', 'matos', 'zebra', 'tsfardea'],
    extraWordIds: ['tov', 'ayin', 'akavish', 'telefon', 'atzitz'],
    sticker: { emoji: '🦋', name: 'פַּרְפַּר הַקֶּסֶם' },
  },
  {
    id: 'stories', name: 'הַר הַסִּפּוּרִים',     emoji: '📖', color: '#E3A008',
    letterIds: [],
    wordIds: ['melech'],
    sticker: { emoji: '👑', name: 'כֶּתֶר הַמְּלוּכָה' },
  },
  {
    id: 'dragon',  name: 'אֶרֶץ הַדְּרָקוֹן',     emoji: '🐉', color: '#2E9E82',
    letterIds: [],
    wordIds: [],
    sticker: { emoji: '🐉', name: 'דְּרָקִי הַזָּהָב' },
  },
];

// Node type → map icon + kid-facing label.
export const NODE_META = {
  letter:   { label: 'אוֹת חֲדָשָׁה' },
  lab:      { icon: '🧩', label: 'בּוֹנִים מִלִּים' },
  echo:     { icon: '🎤', label: 'אוֹמְרִים בְּקוֹל' },
  memory:   { icon: '🃏', label: 'מִשְׂחַק זִכָּרוֹן' },
  boss:     { icon: '👑', label: 'אֶתְגַּר הָאִי' },
  finals:   { icon: '✨', label: 'אוֹתִיּוֹת סוֹפִיּוֹת' },
  story:    { icon: '📖', label: 'בּוֹנִים סִפּוּר' },
  tale:     { icon: '🐉', label: 'מַקְשִׁיבִים וְעוֹנִים' },
  taleboss: { icon: '👑', label: 'אֶתְגַּר הַדְּרָקוֹן' },
};

const cumulativeLetters = [];
const cumulativeWordIds = [];

export const WORLDS = defs.map((def, i) => {
  const letters = def.letterIds.map(id => ALPHABET_BY_ID[id]);
  cumulativeLetters.push(...letters);
  const ownWordIds = [...def.wordIds, ...(def.extraWordIds ?? [])];
  cumulativeWordIds.push(...ownWordIds);

  const world = {
    ...def,
    index: i,
    number: i + 1,
    letters,
    words: def.wordIds.map(id => WORDS_BY_ID[id]),
    allWords: ownWordIds.map(id => WORDS_BY_ID[id]),
    cumulativeLetters: [...cumulativeLetters],
    cumulativeWordIds: [...cumulativeWordIds],
  };

  if (def.id === 'dragon') {
    world.nodes = [
      ...TALES.map(t => ({ type: 'tale', taleId: t.id })),
      { type: 'taleboss' },
    ];
  } else if (def.id === 'stories') {
    world.nodes = [
      { type: 'finals' },
      { type: 'story', sceneIds: SCENES.slice(0, 2).map(s => s.id) },
      { type: 'story', sceneIds: SCENES.slice(2, 4).map(s => s.id) },
      { type: 'story', sceneIds: SCENES.slice(4).map(s => s.id) },
      { type: 'boss' },
    ];
  } else {
    world.nodes = [
      ...letters.map(l => ({ type: 'letter', letterId: l.id })),
      { type: 'lab' },
      { type: 'echo' },
      { type: 'memory' },
      { type: 'boss' },
    ];
  }

  world.nodes = world.nodes.map((n, j) => ({
    ...n,
    id: `${def.id}:${j}:${n.type}`,
    worldId: def.id,
    indexInWorld: j,
  }));

  return world;
});

export const WORLD_BY_ID = Object.fromEntries(WORLDS.map(w => [w.id, w]));

// Flat ordered node list — unlock order across the whole kingdom.
export const NODES = WORLDS.flatMap(w => w.nodes);
export const NODE_BY_ID = Object.fromEntries(NODES.map(n => [n.id, n]));
const NODE_POS = Object.fromEntries(NODES.map((n, i) => [n.id, i]));

export const nodeAfter = (nodeId) => NODES[NODE_POS[nodeId] + 1] ?? null;

// A node is unlocked when every node before it has been completed.
export const nodeStatus = (nodeId, doneStars) => {
  if (doneStars[nodeId] != null) return 'done';
  const pos = NODE_POS[nodeId];
  if (pos === 0) return 'open';
  const prev = NODES[pos - 1];
  return doneStars[prev.id] != null ? 'open' : 'locked';
};

export const FINAL_FORMS = FINALS;
