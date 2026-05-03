// 22 letters of the Hebrew alphabet (without final forms — those are taught after the base 22).
// Each letter ships with a pre-recorded .m4a in public/audio/letters/{audio}.m4a.
//
// Fields:
//   id           stable key, also the audio filename
//   heb          the letter glyph
//   final        final-form glyph if any (sofit), shown alongside in flashcards
//   nameHe       Hebrew name with nikud, for display
//   nameEn       romanized name — for kids who can't read Hebrew yet
//   sound        IPA-ish phonetic ("b", "g", "—" for silent)
//   tip          short Hebrew teaching note shown on flashcard back
//   color        which letter color slot to use (1..6)

export const ALPHABET = [
  { id: 'alef',  heb: 'א',         nameHe: 'אָלֶף',   nameEn: 'Alef',    sound: '—',  tip: 'אות שקטה',                       color: 1 },
  { id: 'bet',   heb: 'ב',         nameHe: 'בֵּית',   nameEn: 'Bet',     sound: 'B',  tip: 'נשמעת כמו B',                    color: 2 },
  { id: 'gimel', heb: 'ג',         nameHe: 'גִּימֶל', nameEn: 'Gimel',   sound: 'G',  tip: 'נשמעת כמו G ב־Go',               color: 3 },
  { id: 'dalet', heb: 'ד',         nameHe: 'דָּלֶת',  nameEn: 'Dalet',   sound: 'D',  tip: 'נשמעת כמו D',                    color: 4 },
  { id: 'he',    heb: 'ה',         nameHe: 'הֵא',     nameEn: 'Hey',     sound: 'H',  tip: 'נשימה קלה',                      color: 5 },
  { id: 'vav',   heb: 'ו',         nameHe: 'וָו',     nameEn: 'Vav',     sound: 'V',  tip: 'נשמעת כמו V',                    color: 6 },
  { id: 'zayin', heb: 'ז',         nameHe: 'זַיִן',   nameEn: 'Zayin',   sound: 'Z',  tip: 'נשמעת כמו Z ב־Zoo',              color: 1 },
  { id: 'het',   heb: 'ח',         nameHe: 'חֵית',    nameEn: 'Chet',    sound: 'Ch', tip: 'גרונית — כמו ח ב־חמש',           color: 2 },
  { id: 'tet',   heb: 'ט',         nameHe: 'טֵית',    nameEn: 'Tet',     sound: 'T',  tip: 'נשמעת כמו T',                    color: 3 },
  { id: 'yod',   heb: 'י',         nameHe: 'יוֹד',    nameEn: 'Yod',     sound: 'Y',  tip: 'נשמעת כמו Y ב־Yes',              color: 4 },
  { id: 'kaf',   heb: 'כ', final: 'ך', nameHe: 'כַּף', nameEn: 'Kaf',    sound: 'K',  tip: 'נשמעת כמו K — בסוף מילה: ך',     color: 5 },
  { id: 'lamed', heb: 'ל',         nameHe: 'לָמֶד',   nameEn: 'Lamed',   sound: 'L',  tip: 'נשמעת כמו L',                    color: 6 },
  { id: 'mem',   heb: 'מ', final: 'ם', nameHe: 'מֵם',  nameEn: 'Mem',    sound: 'M',  tip: 'נשמעת כמו M — בסוף מילה: ם',     color: 1 },
  { id: 'nun',   heb: 'נ', final: 'ן', nameHe: 'נוּן', nameEn: 'Nun',    sound: 'N',  tip: 'נשמעת כמו N — בסוף מילה: ן',     color: 2 },
  { id: 'samex', heb: 'ס',         nameHe: 'סָמֶךְ',  nameEn: 'Samech',  sound: 'S',  tip: 'נשמעת כמו S',                    color: 3 },
  { id: 'ayin',  heb: 'ע',         nameHe: 'עַיִן',   nameEn: 'Ayin',    sound: '—',  tip: 'אות שקטה (גרונית עתיקה)',        color: 4 },
  { id: 'pe',    heb: 'פ', final: 'ף', nameHe: 'פֵּא', nameEn: 'Pey',    sound: 'P',  tip: 'נשמעת כמו P — בסוף מילה: ף',     color: 5 },
  { id: 'tsadi', heb: 'צ', final: 'ץ', nameHe: 'צָדִי', nameEn: 'Tzadi', sound: 'Tz', tip: 'נשמעת כמו Tz ב־Pizza',           color: 6 },
  { id: 'kof',   heb: 'ק',         nameHe: 'קוֹף',    nameEn: 'Kof',     sound: 'K',  tip: 'גם היא נשמעת כמו K',             color: 1 },
  { id: 'resh',  heb: 'ר',         nameHe: 'רֵישׁ',   nameEn: 'Resh',    sound: 'R',  tip: 'מתגלגלת בגרון',                  color: 2 },
  { id: 'shin',  heb: 'ש',         nameHe: 'שִׁין',   nameEn: 'Shin',    sound: 'Sh', tip: 'נשמעת כמו Sh ב־Shoe',            color: 3 },
  { id: 'tav',   heb: 'ת',         nameHe: 'תָּו',    nameEn: 'Tav',     sound: 'T',  tip: 'גם היא נשמעת כמו T',             color: 4 },
];

export const ALPHABET_BY_ID = Object.fromEntries(ALPHABET.map(l => [l.id, l]));
export const ALPHABET_BY_HEB = Object.fromEntries(ALPHABET.map(l => [l.heb, l]));

export const LETTER_COLOR = (slot) => `var(--letter-${((slot - 1) % 6) + 1})`;

// Strip Hebrew nikud (vowel points) so TTS / matching ignores them.
export const stripNikud = (s) => s.replace(/[֑-ׇ]/g, '');

// All base (non-final) letters as a set, for spelling games.
export const ALL_LETTERS = ALPHABET.map(l => l.heb);
