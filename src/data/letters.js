// The 22 Hebrew letters + the 5 final forms (sofiot).
//
// Fields:
//   id        stable key — also the audio filename (public/audio/letters/{id}.m4a)
//   heb       the glyph
//   final     final-form glyph, if the letter has one
//   nameHe    Hebrew name with nikud (display)
//   nameEn    romanized name (mic matching + caption for pre-readers' parents)
//   sound     what the letter sounds like, kid-phrasing
//   color     palette slot 1..6 (see --letter-N tokens)
//   wordId    canonical example word — letter appears prominently, ideally first
//   similar   glyphs kids visually confuse with this one; used as bubble-pop
//             decoys so the game trains real discrimination, not random luck

export const ALPHABET = [
  { id: 'alef',  heb: 'א', nameHe: 'אָלֶף',   nameEn: 'Alef',   sound: 'אות שקטה', color: 1, wordId: 'aba',     similar: ['צ', 'ץ', 'ע'] },
  { id: 'bet',   heb: 'ב', nameHe: 'בֵּית',   nameEn: 'Bet',    sound: 'בּ כמו בַּיִת', color: 2, wordId: 'bayit',  similar: ['כ', 'נ', 'פ'] },
  { id: 'gimel', heb: 'ג', nameHe: 'גִּימֶל', nameEn: 'Gimel',  sound: 'גּ כמו גָּמָל', color: 3, wordId: 'gamal',  similar: ['נ', 'ז', 'ב'] },
  { id: 'dalet', heb: 'ד', nameHe: 'דָּלֶת',  nameEn: 'Dalet',  sound: 'ד כמו דָּג', color: 4, wordId: 'dag',     similar: ['ר', 'ך', 'ת'] },
  { id: 'he',    heb: 'ה', nameHe: 'הֵא',     nameEn: 'Hey',    sound: 'ה כמו הַר', color: 5, wordId: 'har',     similar: ['ח', 'ת', 'ה'] },
  { id: 'vav',   heb: 'ו', nameHe: 'וָו',     nameEn: 'Vav',    sound: 'ו כמו וֶרֶד', color: 6, wordId: 'vered',  similar: ['ז', 'ן', 'י'] },
  { id: 'zayin', heb: 'ז', nameHe: 'זַיִן',   nameEn: 'Zayin',  sound: 'ז כמו זָהָב', color: 1, wordId: 'zahav',  similar: ['ו', 'ן', 'ג'] },
  { id: 'het',   heb: 'ח', nameHe: 'חֵית',    nameEn: 'Chet',   sound: 'ח כמו חָתוּל', color: 2, wordId: 'chatul', similar: ['ה', 'ת', 'ר'] },
  { id: 'tet',   heb: 'ט', nameHe: 'טֵית',    nameEn: 'Tet',    sound: 'ט כמו טוֹב', color: 3, wordId: 'tov',     similar: ['מ', 'ס', 'פ'] },
  { id: 'yod',   heb: 'י', nameHe: 'יוֹד',    nameEn: 'Yod',    sound: 'י כמו יָם', color: 4, wordId: 'yam',     similar: ['ו', 'ן', 'ז'] },
  { id: 'kaf',   heb: 'כ', final: 'ך', nameHe: 'כַּף',  nameEn: 'Kaf',   sound: 'כּ כמו כֶּלֶב', color: 5, wordId: 'kelev',  similar: ['ב', 'נ', 'פ'] },
  { id: 'lamed', heb: 'ל', nameHe: 'לָמֶד',   nameEn: 'Lamed',  sound: 'ל כמו לֵב', color: 6, wordId: 'lev',     similar: ['ן', 'ך', 'ץ'] },
  { id: 'mem',   heb: 'מ', final: 'ם', nameHe: 'מֵם',   nameEn: 'Mem',   sound: 'מ כמו מַיִם', color: 1, wordId: 'mayim',  similar: ['ט', 'ס', 'ם'] },
  { id: 'nun',   heb: 'נ', final: 'ן', nameHe: 'נוּן',  nameEn: 'Nun',   sound: 'נ כמו נָמֵר', color: 2, wordId: 'namer',  similar: ['ג', 'כ', 'ב'] },
  { id: 'samex', heb: 'ס', nameHe: 'סָמֶךְ',  nameEn: 'Samech', sound: 'ס כמו סוּס', color: 3, wordId: 'sus',     similar: ['ם', 'ט', 'ף'] },
  { id: 'ayin',  heb: 'ע', nameHe: 'עַיִן',   nameEn: 'Ayin',   sound: 'אות שקטה', color: 4, wordId: 'etz',     similar: ['צ', 'א', 'ץ'] },
  { id: 'pe',    heb: 'פ', final: 'ף', nameHe: 'פֵּא',  nameEn: 'Pey',   sound: 'פּ כמו פִּיל', color: 5, wordId: 'pil',    similar: ['כ', 'ב', 'ט'] },
  { id: 'tsadi', heb: 'צ', final: 'ץ', nameHe: 'צָדִי', nameEn: 'Tzadi', sound: 'צ כמו צִפּוֹר', color: 6, wordId: 'tsipor', similar: ['ע', 'א', 'ז'] },
  { id: 'kof',   heb: 'ק', nameHe: 'קוֹף',    nameEn: 'Kuf',    sound: 'ק כמו קוֹף', color: 1, wordId: 'kof',     similar: ['ה', 'ר', 'ף'] },
  { id: 'resh',  heb: 'ר', nameHe: 'רֵישׁ',   nameEn: 'Resh',   sound: 'ר כמו רֹאשׁ', color: 2, wordId: 'rosh',   similar: ['ד', 'ך', 'כ'] },
  { id: 'shin',  heb: 'ש', nameHe: 'שִׁין',   nameEn: 'Shin',   sound: 'שׁ כמו שֶׁמֶשׁ', color: 3, wordId: 'shemesh', similar: ['ט', 'ס', 'ע'] },
  { id: 'tav',   heb: 'ת', nameHe: 'תָּו',    nameEn: 'Tav',    sound: 'ת כמו תַּפּוּחַ', color: 4, wordId: 'tapuach', similar: ['ח', 'ה', 'ר'] },
];

export const ALPHABET_BY_ID = Object.fromEntries(ALPHABET.map(l => [l.id, l]));
export const ALPHABET_BY_HEB = Object.fromEntries(ALPHABET.map(l => [l.heb, l]));

// Final forms, taught on Story Mountain (world 8). exampleWordId points to a
// corpus word whose bare spelling ends with the final glyph.
export const FINALS = [
  { baseId: 'kaf',   base: 'כ', final: 'ך', nameHe: 'כַף סוֹפִית',  say: 'כף סופית',  exampleWordId: 'melech' },
  { baseId: 'mem',   base: 'מ', final: 'ם', nameHe: 'מֵם סוֹפִית',  say: 'מם סופית',  exampleWordId: 'mayim' },
  { baseId: 'nun',   base: 'נ', final: 'ן', nameHe: 'נוּן סוֹפִית', say: 'נון סופית', exampleWordId: 'ayin' },
  { baseId: 'pe',    base: 'פ', final: 'ף', nameHe: 'פֵא סוֹפִית',  say: 'פא סופית',  exampleWordId: 'kof' },
  { baseId: 'tsadi', base: 'צ', final: 'ץ', nameHe: 'צָדִי סוֹפִית', say: 'צדי סופית', exampleWordId: 'etz' },
];

export const LETTER_COLOR = (slot) => `var(--letter-${((slot - 1) % 6) + 1})`;

// Strip Hebrew nikud (vowel points) so TTS / matching ignores them.
export const stripNikud = (s) => s.replace(/[֑-ׇ]/g, '');
