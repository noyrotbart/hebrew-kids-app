// Vocabulary corpus.
//
// Image strategy (in order of preference):
//   1. Static file at public/images/words/{id}.jpg, downloaded by scripts/fetch-images.mjs
//      from Pexels. Best quality + offline-friendly.
//   2. Wikipedia REST API thumbnail at runtime — free, no key, CORS-open, real photo.
//      Cached in localStorage. Used for words with `wiki` set.
//   3. Gradient placeholder (ugly but neutral, never reveals the answer).
//
// Audio: pre-generated WAV at public/audio/words/{id}.wav (scripts/fetch-audio.mjs)
//   → /api/tts proxy → Web Speech API.
//
// Fields:
//   id           filename-safe key (also used for image and audio filenames)
//   he           Hebrew with nikud, for display
//   bare         Hebrew without nikud, the "real" spelling for spelling games
//   letters      array of bare letters in spelling order (left → right reading order)
//   roman        romanization, shown as a small caption to help kids say it
//   en           English meaning
//   imageQuery   English search query handed to Pexels (build-time)
//   wiki         Wikipedia article title for the runtime fallback
//   group        category (used to group lessons later)

export const WORDS = [
  // — Family —
  { id: 'aba',    he: 'אַבָּא',   bare: 'אבא',   letters: ['א','ב','א'],     roman: 'Aba',   en: 'Dad',     imageQuery: 'father with child smiling', wiki: 'Father',     group: 'family' },
  { id: 'ima',    he: 'אִמָּא',   bare: 'אמא',   letters: ['א','מ','א'],     roman: 'Ima',   en: 'Mom',     imageQuery: 'mother with child smiling', wiki: 'Mother',     group: 'family' },
  { id: 'yeled',  he: 'יֶלֶד',    bare: 'ילד',   letters: ['י','ל','ד'],     roman: 'Yeled', en: 'Boy',     imageQuery: 'happy boy portrait',        wiki: 'Boy',        group: 'family' },
  { id: 'savta',  he: 'סַבְתָּא', bare: 'סבתא',  letters: ['ס','ב','ת','א'], roman: 'Savta', en: 'Grandma', imageQuery: 'grandmother smiling',       wiki: 'Grandparent', group: 'family' },

  // — Animals —
  { id: 'arie',   he: 'אַרְיֵה', bare: 'אריה',  letters: ['א','ר','י','ה'], roman: 'Arie',   en: 'Lion',    imageQuery: 'lion portrait',         wiki: 'Lion',     group: 'animals' },
  { id: 'kelev',  he: 'כֶּלֶב',  bare: 'כלב',   letters: ['כ','ל','ב'],     roman: 'Kelev',  en: 'Dog',     imageQuery: 'happy dog portrait',    wiki: 'Dog',      group: 'animals' },
  { id: 'chatul', he: 'חָתוּל',  bare: 'חתול',  letters: ['ח','ת','ו','ל'], roman: 'Chatul', en: 'Cat',     imageQuery: 'cute cat portrait',     wiki: 'Cat',      group: 'animals' },
  { id: 'sus',    he: 'סוּס',    bare: 'סוס',   letters: ['ס','ו','ס'],     roman: 'Sus',    en: 'Horse',   imageQuery: 'horse in field',        wiki: 'Horse',    group: 'animals' },
  { id: 'dag',    he: 'דָּג',    bare: 'דג',    letters: ['ד','ג'],         roman: 'Dag',    en: 'Fish',    imageQuery: 'colorful fish underwater', wiki: 'Fish', group: 'animals' },
  { id: 'kof',    he: 'קוֹף',    bare: 'קוף',   letters: ['ק','ו','פ'],     roman: 'Kof',    en: 'Monkey',  imageQuery: 'monkey portrait',       wiki: 'Monkey',   group: 'animals' },
  { id: 'pil',    he: 'פִּיל',   bare: 'פיל',   letters: ['פ','י','ל'],     roman: 'Pil',    en: 'Elephant',imageQuery: 'elephant savanna',      wiki: 'Elephant', group: 'animals' },
  { id: 'tsipor', he: 'צִפּוֹר', bare: 'צפור',  letters: ['צ','פ','ו','ר'], roman: 'Tsipor', en: 'Bird',    imageQuery: 'colorful bird closeup', wiki: 'Bird',     group: 'animals' },
  { id: 'gamal',  he: 'גָּמָל',  bare: 'גמל',   letters: ['ג','מ','ל'],     roman: 'Gamal',  en: 'Camel',   imageQuery: 'camel desert',          wiki: 'Camel',    group: 'animals' },
  { id: 'namer',  he: 'נָמֵר',   bare: 'נמר',   letters: ['נ','מ','ר'],     roman: 'Namer',  en: 'Leopard', imageQuery: 'leopard portrait',      wiki: 'Leopard',  group: 'animals' },

  // — Nature —
  { id: 'shemesh',he: 'שֶׁמֶשׁ', bare: 'שמש',   letters: ['ש','מ','ש'],     roman: 'Shemesh', en: 'Sun',      imageQuery: 'sun bright sky',       wiki: 'Sun',      group: 'nature' },
  { id: 'yareach',he: 'יָרֵחַ',  bare: 'ירח',   letters: ['י','ר','ח'],     roman: 'Yareach', en: 'Moon',     imageQuery: 'full moon night sky',  wiki: 'Moon',     group: 'nature' },
  { id: 'kochav', he: 'כּוֹכָב', bare: 'כוכב',  letters: ['כ','ו','כ','ב'], roman: 'Kochav',  en: 'Star',     imageQuery: 'starry night sky',     wiki: 'Star',     group: 'nature' },
  { id: 'yam',    he: 'יָם',     bare: 'ים',    letters: ['י','מ'],         roman: 'Yam',     en: 'Sea',      imageQuery: 'turquoise sea waves',  wiki: 'Sea',      group: 'nature' },
  { id: 'har',    he: 'הַר',     bare: 'הר',    letters: ['ה','ר'],         roman: 'Har',     en: 'Mountain', imageQuery: 'mountain landscape',   wiki: 'Mountain', group: 'nature' },
  { id: 'etz',    he: 'עֵץ',     bare: 'עץ',    letters: ['ע','צ'],         roman: 'Etz',     en: 'Tree',     imageQuery: 'lone oak tree',        wiki: 'Tree',     group: 'nature' },
  { id: 'perach', he: 'פֶּרַח',  bare: 'פרח',   letters: ['פ','ר','ח'],     roman: 'Perach',  en: 'Flower',   imageQuery: 'pink flower closeup',  wiki: 'Flower',   group: 'nature' },
  { id: 'mayim',  he: 'מַיִם',   bare: 'מים',   letters: ['מ','י','מ'],     roman: 'Mayim',   en: 'Water',    imageQuery: 'glass of water',       wiki: 'Water',    group: 'nature' },

  // — House & objects —
  { id: 'bayit',  he: 'בַּיִת',  bare: 'בית',   letters: ['ב','י','ת'],     roman: 'Bayit', en: 'House',  imageQuery: 'cozy house exterior', wiki: 'House',  group: 'home' },
  { id: 'delet',  he: 'דֶּלֶת',  bare: 'דלת',   letters: ['ד','ל','ת'],     roman: 'Delet', en: 'Door',   imageQuery: 'colorful front door', wiki: 'Door',   group: 'home' },
  { id: 'kise',   he: 'כִּסֵּא', bare: 'כסא',   letters: ['כ','ס','א'],     roman: 'Kise',  en: 'Chair',  imageQuery: 'wooden chair simple', wiki: 'Chair',  group: 'home' },
  { id: 'sefer',  he: 'סֵפֶר',   bare: 'ספר',   letters: ['ס','פ','ר'],     roman: 'Sefer', en: 'Book',   imageQuery: 'open book on table',  wiki: 'Book',   group: 'home' },
  { id: 'kos',    he: 'כּוֹס',   bare: 'כוס',   letters: ['כ','ו','ס'],     roman: 'Kos',   en: 'Cup',    imageQuery: 'ceramic mug minimal', wiki: 'Mug',    group: 'home' },

  // — Food —
  { id: 'lechem', he: 'לֶחֶם',   bare: 'לחם',   letters: ['ל','ח','מ'],     roman: 'Lechem', en: 'Bread',  imageQuery: 'fresh bread loaf',     wiki: 'Bread',  group: 'food' },
  { id: 'chalav', he: 'חָלָב',   bare: 'חלב',   letters: ['ח','ל','ב'],     roman: 'Chalav', en: 'Milk',   imageQuery: 'glass of milk',        wiki: 'Milk',   group: 'food' },
  { id: 'tapuz',  he: 'תַּפּוּז',bare: 'תפוז',  letters: ['ת','פ','ו','ז'], roman: 'Tapuz',  en: 'Orange', imageQuery: 'orange fruit closeup', wiki: 'Orange_(fruit)', group: 'food' },
  { id: 'tapuach',he: 'תַּפּוּחַ',bare: 'תפוח', letters: ['ת','פ','ו','ח'], roman: 'Tapuach',en: 'Apple',  imageQuery: 'red apple closeup',    wiki: 'Apple',  group: 'food' },
  { id: 'dvash',  he: 'דְּבַשׁ', bare: 'דבש',   letters: ['ד','ב','ש'],     roman: 'Dvash',  en: 'Honey',  imageQuery: 'honey jar wooden',     wiki: 'Honey',  group: 'food' },

  // — Body —
  { id: 'rosh',   he: 'רֹאשׁ',   bare: 'ראש',   letters: ['ר','א','ש'],     roman: 'Rosh',  en: 'Head',  imageQuery: 'child smiling face',   wiki: 'Head',       group: 'body' },
  { id: 'ayin',   he: 'עַיִן',   bare: 'עין',   letters: ['ע','י','נ'],     roman: 'Ayin',  en: 'Eye',   imageQuery: 'human eye macro',      wiki: 'Human_eye',  group: 'body' },
  { id: 'regel',  he: 'רֶגֶל',   bare: 'רגל',   letters: ['ר','ג','ל'],     roman: 'Regel', en: 'Leg',   imageQuery: 'running shoes legs',   wiki: 'Human_leg',  group: 'body' },
  { id: 'lev',    he: 'לֵב',     bare: 'לב',    letters: ['ל','ב'],         roman: 'Lev',   en: 'Heart', imageQuery: 'red heart shape',      wiki: 'Heart',      group: 'body' },

  // — Color/abstract for variety —
  { id: 'vered',  he: 'וֶרֶד',   bare: 'ורד',   letters: ['ו','ר','ד'],     roman: 'Vered', en: 'Rose',   imageQuery: 'red rose closeup',     wiki: 'Rose',     group: 'nature' },
  { id: 'or',     he: 'אוֹר',    bare: 'אור',   letters: ['א','ו','ר'],     roman: 'Or',    en: 'Light',  imageQuery: 'sunbeam through window', wiki: 'Sunlight', group: 'abstract' },
  { id: 'tov',    he: 'טוֹב',    bare: 'טוב',   letters: ['ט','ו','ב'],     roman: 'Tov',   en: 'Good',   imageQuery: 'thumbs up smile',       wiki: 'Thumb_signal', group: 'abstract' },
  { id: 'zahav',  he: 'זָהָב',   bare: 'זהב',   letters: ['ז','ה','ב'],     roman: 'Zahav', en: 'Gold',   imageQuery: 'gold metal nuggets',    wiki: 'Gold',     group: 'abstract' },
  { id: 'shir',   he: 'שִׁיר',   bare: 'שיר',   letters: ['ש','י','ר'],     roman: 'Shir',  en: 'Song',   imageQuery: 'kid singing microphone', wiki: 'Singing', group: 'abstract' },
];

export const WORDS_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));

export const wordsUsingOnlyLetters = (allowed) => {
  const set = new Set(allowed);
  return WORDS.filter(w => w.letters.every(l => set.has(l)));
};
