// Vocabulary corpus.
// Each word ships with a real photo (downloaded by scripts/fetch-images.mjs from Pexels)
// and a pre-generated audio file (downloaded by scripts/fetch-audio.mjs from the Phonikud
// HF Space). Until those scripts are run, the app shows a graceful placeholder and falls
// back to the runtime /api/tts endpoint.
//
// Fields:
//   id           filename-safe key (also used for image and audio filenames)
//   he           Hebrew with nikud, for display
//   bare         Hebrew without nikud, the "real" spelling for spelling games
//   letters      array of bare letters in spelling order (left → right reading order)
//   roman        romanization, shown as a small caption to help kids say it
//   en           English meaning
//   imageQuery   English search query handed to Pexels
//   group        category (used to group lessons later)

export const WORDS = [
  // — Family —
  { id: 'aba',    he: 'אַבָּא',   bare: 'אבא',   letters: ['א','ב','א'],     roman: 'Aba',   en: 'Dad',     imageQuery: 'father with child smiling', group: 'family' },
  { id: 'ima',    he: 'אִמָּא',   bare: 'אמא',   letters: ['א','מ','א'],     roman: 'Ima',   en: 'Mom',     imageQuery: 'mother with child smiling', group: 'family' },
  { id: 'yeled',  he: 'יֶלֶד',    bare: 'ילד',   letters: ['י','ל','ד'],     roman: 'Yeled', en: 'Boy',     imageQuery: 'happy boy portrait',        group: 'family' },
  { id: 'savta',  he: 'סַבְתָּא', bare: 'סבתא',  letters: ['ס','ב','ת','א'], roman: 'Savta', en: 'Grandma', imageQuery: 'grandmother smiling',       group: 'family' },

  // — Animals —
  { id: 'arie',   he: 'אַרְיֵה', bare: 'אריה',  letters: ['א','ר','י','ה'], roman: 'Arie',   en: 'Lion',    imageQuery: 'lion portrait',         group: 'animals' },
  { id: 'kelev',  he: 'כֶּלֶב',  bare: 'כלב',   letters: ['כ','ל','ב'],     roman: 'Kelev',  en: 'Dog',     imageQuery: 'happy dog portrait',    group: 'animals' },
  { id: 'chatul', he: 'חָתוּל',  bare: 'חתול',  letters: ['ח','ת','ו','ל'], roman: 'Chatul', en: 'Cat',     imageQuery: 'cute cat portrait',     group: 'animals' },
  { id: 'sus',    he: 'סוּס',    bare: 'סוס',   letters: ['ס','ו','ס'],     roman: 'Sus',    en: 'Horse',   imageQuery: 'horse in field',        group: 'animals' },
  { id: 'dag',    he: 'דָּג',    bare: 'דג',    letters: ['ד','ג'],         roman: 'Dag',    en: 'Fish',    imageQuery: 'colorful fish underwater', group: 'animals' },
  { id: 'kof',    he: 'קוֹף',    bare: 'קוף',   letters: ['ק','ו','פ'],     roman: 'Kof',    en: 'Monkey',  imageQuery: 'monkey portrait',       group: 'animals' },
  { id: 'pil',    he: 'פִּיל',   bare: 'פיל',   letters: ['פ','י','ל'],     roman: 'Pil',    en: 'Elephant',imageQuery: 'elephant savanna',      group: 'animals' },
  { id: 'tsipor', he: 'צִפּוֹר', bare: 'צפור',  letters: ['צ','פ','ו','ר'], roman: 'Tsipor', en: 'Bird',    imageQuery: 'colorful bird closeup', group: 'animals' },
  { id: 'gamal',  he: 'גָּמָל',  bare: 'גמל',   letters: ['ג','מ','ל'],     roman: 'Gamal',  en: 'Camel',   imageQuery: 'camel desert',          group: 'animals' },
  { id: 'namer',  he: 'נָמֵר',   bare: 'נמר',   letters: ['נ','מ','ר'],     roman: 'Namer',  en: 'Leopard', imageQuery: 'leopard portrait',      group: 'animals' },

  // — Nature —
  { id: 'shemesh',he: 'שֶׁמֶשׁ', bare: 'שמש',   letters: ['ש','מ','ש'],     roman: 'Shemesh', en: 'Sun',     imageQuery: 'sun bright sky',       group: 'nature' },
  { id: 'yareach',he: 'יָרֵחַ',  bare: 'ירח',   letters: ['י','ר','ח'],     roman: 'Yareach', en: 'Moon',    imageQuery: 'full moon night sky',  group: 'nature' },
  { id: 'kochav', he: 'כּוֹכָב', bare: 'כוכב',  letters: ['כ','ו','כ','ב'], roman: 'Kochav',  en: 'Star',    imageQuery: 'starry night sky',     group: 'nature' },
  { id: 'yam',    he: 'יָם',     bare: 'ים',    letters: ['י','מ'],         roman: 'Yam',     en: 'Sea',     imageQuery: 'turquoise sea waves',  group: 'nature' },
  { id: 'har',    he: 'הַר',     bare: 'הר',    letters: ['ה','ר'],         roman: 'Har',     en: 'Mountain', imageQuery: 'mountain landscape',  group: 'nature' },
  { id: 'etz',    he: 'עֵץ',     bare: 'עץ',    letters: ['ע','צ'],         roman: 'Etz',     en: 'Tree',    imageQuery: 'lone oak tree',        group: 'nature' },
  { id: 'perach', he: 'פֶּרַח',  bare: 'פרח',   letters: ['פ','ר','ח'],     roman: 'Perach',  en: 'Flower',  imageQuery: 'pink flower closeup',  group: 'nature' },
  { id: 'mayim',  he: 'מַיִם',   bare: 'מים',   letters: ['מ','י','מ'],     roman: 'Mayim',   en: 'Water',   imageQuery: 'glass of water',       group: 'nature' },

  // — House & objects —
  { id: 'bayit',  he: 'בַּיִת',  bare: 'בית',   letters: ['ב','י','ת'],     roman: 'Bayit', en: 'House',  imageQuery: 'cozy house exterior', group: 'home' },
  { id: 'delet',  he: 'דֶּלֶת',  bare: 'דלת',   letters: ['ד','ל','ת'],     roman: 'Delet', en: 'Door',   imageQuery: 'colorful front door', group: 'home' },
  { id: 'kise',   he: 'כִּסֵּא', bare: 'כסא',   letters: ['כ','ס','א'],     roman: 'Kise',  en: 'Chair',  imageQuery: 'wooden chair simple', group: 'home' },
  { id: 'sefer',  he: 'סֵפֶר',   bare: 'ספר',   letters: ['ס','פ','ר'],     roman: 'Sefer', en: 'Book',   imageQuery: 'open book on table',  group: 'home' },
  { id: 'kos',    he: 'כּוֹס',   bare: 'כוס',   letters: ['כ','ו','ס'],     roman: 'Kos',   en: 'Cup',    imageQuery: 'ceramic mug minimal', group: 'home' },

  // — Food —
  { id: 'lechem', he: 'לֶחֶם',   bare: 'לחם',   letters: ['ל','ח','מ'],     roman: 'Lechem', en: 'Bread', imageQuery: 'fresh bread loaf',     group: 'food' },
  { id: 'chalav', he: 'חָלָב',   bare: 'חלב',   letters: ['ח','ל','ב'],     roman: 'Chalav', en: 'Milk',  imageQuery: 'glass of milk',        group: 'food' },
  { id: 'tapuz',  he: 'תַּפּוּז',bare: 'תפוז',  letters: ['ת','פ','ו','ז'], roman: 'Tapuz',  en: 'Orange',imageQuery: 'orange fruit closeup', group: 'food' },
  { id: 'tapuach',he: 'תַּפּוּחַ',bare: 'תפוח', letters: ['ת','פ','ו','ח'], roman: 'Tapuach',en: 'Apple', imageQuery: 'red apple closeup',    group: 'food' },
  { id: 'dvash',  he: 'דְּבַשׁ', bare: 'דבש',   letters: ['ד','ב','ש'],     roman: 'Dvash',  en: 'Honey', imageQuery: 'honey jar wooden',     group: 'food' },

  // — Body —
  { id: 'rosh',   he: 'רֹאשׁ',   bare: 'ראש',   letters: ['ר','א','ש'],     roman: 'Rosh',  en: 'Head',  imageQuery: 'child smiling face',   group: 'body' },
  { id: 'ayin',   he: 'עַיִן',   bare: 'עין',   letters: ['ע','י','נ'],     roman: 'Ayin',  en: 'Eye',   imageQuery: 'human eye macro',      group: 'body' },
  { id: 'regel',  he: 'רֶגֶל',   bare: 'רגל',   letters: ['ר','ג','ל'],     roman: 'Regel', en: 'Leg',   imageQuery: 'running shoes legs',   group: 'body' },
  { id: 'lev',    he: 'לֵב',     bare: 'לב',    letters: ['ל','ב'],         roman: 'Lev',   en: 'Heart', imageQuery: 'red heart shape',      group: 'body' },

  // — Color/abstract for variety —
  { id: 'vered',  he: 'וֶרֶד',   bare: 'ורד',   letters: ['ו','ר','ד'],     roman: 'Vered', en: 'Rose',   imageQuery: 'red rose closeup',     group: 'nature' },
  { id: 'or',     he: 'אוֹר',    bare: 'אור',   letters: ['א','ו','ר'],     roman: 'Or',    en: 'Light',  imageQuery: 'sunbeam through window', group: 'abstract' },
  { id: 'tov',    he: 'טוֹב',    bare: 'טוב',   letters: ['ט','ו','ב'],     roman: 'Tov',   en: 'Good',   imageQuery: 'thumbs up smile',       group: 'abstract' },
  { id: 'zahav',  he: 'זָהָב',   bare: 'זהב',   letters: ['ז','ה','ב'],     roman: 'Zahav', en: 'Gold',   imageQuery: 'gold metal nuggets',    group: 'abstract' },
  { id: 'shir',   he: 'שִׁיר',   bare: 'שיר',   letters: ['ש','י','ר'],     roman: 'Shir',  en: 'Song',   imageQuery: 'kid singing microphone', group: 'abstract' },
];

export const WORDS_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));

// Words that can be spelled with letters from a given set (for staged spelling games).
export const wordsUsingOnlyLetters = (allowed) => {
  const set = new Set(allowed);
  return WORDS.filter(w => w.letters.every(l => set.has(l)));
};
