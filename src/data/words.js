// Vocabulary corpus.
//
// Images: static file at public/images/words/{id}.jpg (fetched from Pexels by
// scripts/fetch-images.mjs). When missing (noImage) WordCard falls back to the
// emoji, rendered big on a soft tile — so every word always has a face.
//
// Audio: pre-baked WAV at public/audio/words/{id}.wav; words without one
// (noAudio) speak through the device's native Hebrew voice.
//
// Fields:
//   id       filename-safe key (image + audio filename)
//   he       Hebrew with nikud, for display
//   bare     Hebrew without nikud — the real spelling INCLUDING final forms;
//            spelling games split this string, so kids build words correctly
//   letters  base-form letters, used only for curriculum gating (what's learned)
//   roman    romanization (mic matching + tiny caption)
//   en       English meaning
//   emoji    friendly stand-in when the photo is missing or as a decoration

export const WORDS = [
  // — Family —
  { id: 'aba',    he: 'אַבָּא',    bare: 'אבא',  letters: ['א','ב','א'],     roman: 'Aba',    en: 'Dad',      emoji: '👨' },
  { id: 'ima',    he: 'אִמָּא',    bare: 'אמא',  letters: ['א','מ','א'],     roman: 'Ima',    en: 'Mom',      emoji: '👩' },
  { id: 'yeled',  he: 'יֶלֶד',     bare: 'ילד',  letters: ['י','ל','ד'],     roman: 'Yeled',  en: 'Boy',      emoji: '👦' },
  { id: 'savta',  he: 'סַבְתָּא',  bare: 'סבתא', letters: ['ס','ב','ת','א'], roman: 'Savta',  en: 'Grandma',  emoji: '👵' },

  // — Animals —
  { id: 'arie',   he: 'אַרְיֵה',  bare: 'אריה', letters: ['א','ר','י','ה'], roman: 'Arye',   en: 'Lion',     emoji: '🦁' },
  { id: 'kelev',  he: 'כֶּלֶב',   bare: 'כלב',  letters: ['כ','ל','ב'],     roman: 'Kelev',  en: 'Dog',      emoji: '🐶' },
  { id: 'chatul', he: 'חָתוּל',   bare: 'חתול', letters: ['ח','ת','ו','ל'], roman: 'Chatul', en: 'Cat',      emoji: '🐱' },
  { id: 'sus',    he: 'סוּס',     bare: 'סוס',  letters: ['ס','ו','ס'],     roman: 'Sus',    en: 'Horse',    emoji: '🐴' },
  { id: 'dag',    he: 'דָּג',     bare: 'דג',   letters: ['ד','ג'],         roman: 'Dag',    en: 'Fish',     emoji: '🐟' },
  { id: 'kof',    he: 'קוֹף',     bare: 'קוף',  letters: ['ק','ו','פ'],     roman: 'Kof',    en: 'Monkey',   emoji: '🐵' },
  { id: 'pil',    he: 'פִּיל',    bare: 'פיל',  letters: ['פ','י','ל'],     roman: 'Pil',    en: 'Elephant', emoji: '🐘' },
  { id: 'tsipor', he: 'צִפּוֹר',  bare: 'צפור', letters: ['צ','פ','ו','ר'], roman: 'Tsipor', en: 'Bird',     emoji: '🐦' },
  { id: 'gamal',  he: 'גָּמָל',   bare: 'גמל',  letters: ['ג','מ','ל'],     roman: 'Gamal',  en: 'Camel',    emoji: '🐫' },
  { id: 'namer',  he: 'נָמֵר',    bare: 'נמר',  letters: ['נ','מ','ר'],     roman: 'Namer',  en: 'Leopard',  emoji: '🐆' },

  // — Nature —
  { id: 'shemesh',he: 'שֶׁמֶשׁ',  bare: 'שמש',  letters: ['ש','מ','ש'],     roman: 'Shemesh', en: 'Sun',      emoji: '☀️' },
  { id: 'yareach',he: 'יָרֵחַ',   bare: 'ירח',  letters: ['י','ר','ח'],     roman: 'Yareach', en: 'Moon',     emoji: '🌙' },
  { id: 'kochav', he: 'כּוֹכָב',  bare: 'כוכב', letters: ['כ','ו','כ','ב'], roman: 'Kochav',  en: 'Star',     emoji: '⭐' },
  { id: 'yam',    he: 'יָם',      bare: 'ים',   letters: ['י','מ'],         roman: 'Yam',     en: 'Sea',      emoji: '🌊' },
  { id: 'har',    he: 'הַר',      bare: 'הר',   letters: ['ה','ר'],         roman: 'Har',     en: 'Mountain', emoji: '⛰️' },
  { id: 'etz',    he: 'עֵץ',      bare: 'עץ',   letters: ['ע','צ'],         roman: 'Etz',     en: 'Tree',     emoji: '🌳' },
  { id: 'perach', he: 'פֶּרַח',   bare: 'פרח',  letters: ['פ','ר','ח'],     roman: 'Perach',  en: 'Flower',   emoji: '🌸' },
  { id: 'mayim',  he: 'מַיִם',    bare: 'מים',  letters: ['מ','י','מ'],     roman: 'Mayim',   en: 'Water',    emoji: '💧' },
  { id: 'vered',  he: 'וֶרֶד',    bare: 'ורד',  letters: ['ו','ר','ד'],     roman: 'Vered',   en: 'Rose',     emoji: '🌹' },

  // — House & things —
  { id: 'bayit',  he: 'בַּיִת',   bare: 'בית',  letters: ['ב','י','ת'],     roman: 'Bayit', en: 'House', emoji: '🏠' },
  { id: 'delet',  he: 'דֶּלֶת',   bare: 'דלת',  letters: ['ד','ל','ת'],     roman: 'Delet', en: 'Door',  emoji: '🚪' },
  { id: 'kise',   he: 'כִּסֵּא',  bare: 'כסא',  letters: ['כ','ס','א'],     roman: 'Kise',  en: 'Chair', emoji: '🪑' },
  { id: 'sefer',  he: 'סֵפֶר',    bare: 'ספר',  letters: ['ס','פ','ר'],     roman: 'Sefer', en: 'Book',  emoji: '📖' },
  { id: 'kos',    he: 'כּוֹס',    bare: 'כוס',  letters: ['כ','ו','ס'],     roman: 'Kos',   en: 'Cup',   emoji: '☕' },

  // — Food —
  { id: 'lechem', he: 'לֶחֶם',    bare: 'לחם',  letters: ['ל','ח','מ'],     roman: 'Lechem',  en: 'Bread',  emoji: '🍞' },
  { id: 'chalav', he: 'חָלָב',    bare: 'חלב',  letters: ['ח','ל','ב'],     roman: 'Chalav',  en: 'Milk',   emoji: '🥛' },
  { id: 'tapuz',  he: 'תַּפּוּז', bare: 'תפוז', letters: ['ת','פ','ו','ז'], roman: 'Tapuz',   en: 'Orange', emoji: '🍊' },
  { id: 'tapuach',he: 'תַּפּוּחַ',bare: 'תפוח', letters: ['ת','פ','ו','ח'], roman: 'Tapuach', en: 'Apple',  emoji: '🍎' },
  { id: 'dvash',  he: 'דְּבַשׁ',  bare: 'דבש',  letters: ['ד','ב','ש'],     roman: 'Dvash',   en: 'Honey',  emoji: '🍯' },

  // — Body —
  { id: 'rosh',   he: 'רֹאשׁ',    bare: 'ראש',  letters: ['ר','א','ש'],     roman: 'Rosh',  en: 'Head',  emoji: '🙂' },
  { id: 'ayin',   he: 'עַיִן',    bare: 'עין',  letters: ['ע','י','נ'],     roman: 'Ayin',  en: 'Eye',   emoji: '👁️' },
  { id: 'regel',  he: 'רֶגֶל',    bare: 'רגל',  letters: ['ר','ג','ל'],     roman: 'Regel', en: 'Leg',   emoji: '🦵' },
  { id: 'lev',    he: 'לֵב',      bare: 'לב',   letters: ['ל','ב'],         roman: 'Lev',   en: 'Heart', emoji: '❤️' },

  // — Sparkle —
  { id: 'or',     he: 'אוֹר',     bare: 'אור',  letters: ['א','ו','ר'],     roman: 'Or',     en: 'Light', emoji: '💡' },
  { id: 'tov',    he: 'טוֹב',     bare: 'טוב',  letters: ['ט','ו','ב'],     roman: 'Tov',    en: 'Good',  emoji: '👍' },
  { id: 'zahav',  he: 'זָהָב',    bare: 'זהב',  letters: ['ז','ה','ב'],     roman: 'Zahav',  en: 'Gold',  emoji: '🥇' },
  { id: 'shir',   he: 'שִׁיר',    bare: 'שיר',  letters: ['ש','י','ר'],     roman: 'Shir',   en: 'Song',  emoji: '🎵' },

  // — Longer words (4-5 letters), emoji-art cards, Avri-voiced mp3 audio —
  { id: 'shamayim', he: 'שָׁמַיִם',   bare: 'שמים',  letters: ['ש','מ','י','מ'],     roman: 'Shamayim', en: 'Sky',       emoji: '☁️', noImage: true },
  { id: 'migdal',   he: 'מִגְדָּל',   bare: 'מגדל',  letters: ['מ','ג','ד','ל'],     roman: 'Migdal',   en: 'Tower',     emoji: '🗼', noImage: true },
  { id: 'galgal',   he: 'גַּלְגַּל',  bare: 'גלגל',  letters: ['ג','ל','ג','ל'],     roman: 'Galgal',   en: 'Wheel',     emoji: '🛞', noImage: true },
  { id: 'shablul',  he: 'שַׁבְּלוּל', bare: 'שבלול', letters: ['ש','ב','ל','ו','ל'], roman: 'Shablul',  en: 'Snail',     emoji: '🐌', noImage: true },
  { id: 'machshev', he: 'מַחְשֵׁב',   bare: 'מחשב',  letters: ['מ','ח','ש','ב'],     roman: 'Machshev', en: 'Computer',  emoji: '💻', noImage: true },
  { id: 'chamor',   he: 'חֲמוֹר',     bare: 'חמור',  letters: ['ח','מ','ו','ר'],     roman: 'Chamor',   en: 'Donkey',    emoji: '🫏', noImage: true },
  { id: 'parpar',   he: 'פַּרְפַּר',  bare: 'פרפר',  letters: ['פ','ר','פ','ר'],     roman: 'Parpar',   en: 'Butterfly', emoji: '🦋', noImage: true },
  { id: 'kadur',    he: 'כַּדּוּר',   bare: 'כדור',  letters: ['כ','ד','ו','ר'],     roman: 'Kadur',    en: 'Ball',      emoji: '⚽', noImage: true },
  { id: 'kaftor',   he: 'כַּפְתּוֹר', bare: 'כפתור', letters: ['כ','פ','ת','ו','ר'], roman: 'Kaftor',   en: 'Button',    emoji: '🔘', noImage: true },
  { id: 'banana',   he: 'בָּנָנָה',   bare: 'בננה',  letters: ['ב','נ','נ','ה'],     roman: 'Banana',   en: 'Banana',    emoji: '🍌', noImage: true },
  { id: 'arnav',    he: 'אַרְנָב',    bare: 'ארנב',  letters: ['א','ר','נ','ב'],     roman: 'Arnav',    en: 'Rabbit',    emoji: '🐰', noImage: true },
  { id: 'nemala',   he: 'נְמָלָה',    bare: 'נמלה',  letters: ['נ','מ','ל','ה'],     roman: 'Nemala',   en: 'Ant',       emoji: '🐜', noImage: true },
  { id: 'sfina',    he: 'סְפִינָה',   bare: 'ספינה', letters: ['ס','פ','י','נ','ה'], roman: 'Sfina',    en: 'Boat',      emoji: '🚢', noImage: true },
  { id: 'karnaf',   he: 'קַרְנַף',    bare: 'קרנף',  letters: ['ק','ר','נ','פ'],     roman: 'Karnaf',   en: 'Rhino',     emoji: '🦏', noImage: true },
  { id: 'matos',    he: 'מָטוֹס',     bare: 'מטוס',  letters: ['מ','ט','ו','ס'],     roman: 'Matos',    en: 'Airplane',  emoji: '✈️', noImage: true },
  { id: 'zebra',    he: 'זֶבְּרָה',   bare: 'זברה',  letters: ['ז','ב','ר','ה'],     roman: 'Zebra',    en: 'Zebra',     emoji: '🦓', noImage: true },
  { id: 'tsfardea', he: 'צְפַרְדֵּעַ', bare: 'צפרדע', letters: ['צ','פ','ר','ד','ע'], roman: 'Tsfardea', en: 'Frog',      emoji: '🐸', noImage: true },
  { id: 'akavish',  he: 'עַכָּבִישׁ', bare: 'עכביש', letters: ['ע','כ','ב','י','ש'], roman: 'Akavish',  en: 'Spider',    emoji: '🕷️', noImage: true },
  { id: 'telefon',  he: 'טֵלֵפוֹן',   bare: 'טלפון', letters: ['ט','ל','פ','ו','נ'], roman: 'Telefon',  en: 'Phone',     emoji: '📱', noImage: true },
  { id: 'atzitz',   he: 'עָצִיץ',     bare: 'עציץ',  letters: ['ע','צ','י','צ'],     roman: 'Atzitz',   en: 'Plant pot', emoji: '🪴', noImage: true },

  // — Story Mountain (teaches ך) —
  { id: 'melech',   he: 'מֶלֶךְ',     bare: 'מלך',   letters: ['מ','ל','כ'],         roman: 'Melech',   en: 'King',      emoji: '👑', noImage: true },
];

export const WORDS_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
