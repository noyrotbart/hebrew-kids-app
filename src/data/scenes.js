// Intermediate scenes — kid sees a photo + hears a 4-word Hebrew sentence and
// builds it from a tray of 8 word tiles (4 correct + 4 distractors). Distractors
// are deliberately close in shape (gendered noun, nearby verb, paired adjective)
// so the kid has to listen + read carefully, not just pattern-match.
//
// Fields:
//   id              key
//   wiki            Wikipedia title (fallback image, like words.js)
//   imageQuery      Pexels search query (preferred image source)
//   sentence        Hebrew with nikud — what we play through TTS and put in slots
//   bareSentence    spelling without nikud — used for caption/title screens
//   words[]         4 ordered words: { id, he (with nikud), bare }
//   decoys[]        4 plausible-but-wrong words

export const SCENES = [
  {
    id: 'boy-reading',
    wiki: 'Reading',
    imageQuery: 'happy child reading book',
    sentence:    'הַיֶּלֶד קוֹרֵא סֵפֶר גָּדוֹל',
    bareSentence:'הילד קורא ספר גדול',
    words: [
      { id: 'w1', he: 'הַיֶּלֶד',  bare: 'הילד' },
      { id: 'w2', he: 'קוֹרֵא',    bare: 'קורא' },
      { id: 'w3', he: 'סֵפֶר',     bare: 'ספר' },
      { id: 'w4', he: 'גָּדוֹל',   bare: 'גדול' },
    ],
    decoys: [
      { id: 'd1', he: 'הַיַּלְדָּה', bare: 'הילדה' },
      { id: 'd2', he: 'שׁוֹתֶה',     bare: 'שותה' },
      { id: 'd3', he: 'תַּפּוּחַ',   bare: 'תפוח' },
      { id: 'd4', he: 'קָטָן',       bare: 'קטן' },
    ],
  },

  {
    id: 'cat-sleeping',
    wiki: 'Cat',
    imageQuery: 'sleeping cat couch',
    sentence:    'הַחָתוּל יָשֵׁן עַל סַפָּה',
    bareSentence:'החתול ישן על ספה',
    words: [
      { id: 'w1', he: 'הַחָתוּל', bare: 'החתול' },
      { id: 'w2', he: 'יָשֵׁן',   bare: 'ישן' },
      { id: 'w3', he: 'עַל',      bare: 'על' },
      { id: 'w4', he: 'סַפָּה',   bare: 'ספה' },
    ],
    decoys: [
      { id: 'd1', he: 'הַכֶּלֶב', bare: 'הכלב' },
      { id: 'd2', he: 'רָץ',      bare: 'רץ' },
      { id: 'd3', he: 'תַּחַת',   bare: 'תחת' },
      { id: 'd4', he: 'מִטָּה',   bare: 'מטה' },
    ],
  },

  {
    id: 'sun-shining',
    wiki: 'Sun',
    imageQuery: 'bright sun blue sky',
    sentence:    'הַשֶּׁמֶשׁ זוֹרַחַת בַּשָּׁמַיִם',
    bareSentence:'השמש זורחת בשמים',
    words: [
      { id: 'w1', he: 'הַשֶּׁמֶשׁ', bare: 'השמש' },
      { id: 'w2', he: 'זוֹרַחַת',   bare: 'זורחת' },
      { id: 'w3', he: 'בַּשָּׁמַיִם', bare: 'בשמים' },
      { id: 'w4', he: 'בְּהִירָה',  bare: 'בהירה' },
    ],
    decoys: [
      { id: 'd1', he: 'הַיָּרֵחַ', bare: 'הירח' },
      { id: 'd2', he: 'נִסְתֶּרֶת', bare: 'נסתרת' },
      { id: 'd3', he: 'בַּיָּם',     bare: 'בים' },
      { id: 'd4', he: 'חֲשׁוּכָה',  bare: 'חשוכה' },
    ],
  },

  {
    id: 'girl-eating-apple',
    wiki: 'Apple',
    imageQuery: 'child eating red apple',
    sentence:    'הַיַּלְדָּה אוֹכֶלֶת תַּפּוּחַ אָדוֹם',
    bareSentence:'הילדה אוכלת תפוח אדום',
    words: [
      { id: 'w1', he: 'הַיַּלְדָּה', bare: 'הילדה' },
      { id: 'w2', he: 'אוֹכֶלֶת',    bare: 'אוכלת' },
      { id: 'w3', he: 'תַּפּוּחַ',   bare: 'תפוח' },
      { id: 'w4', he: 'אָדוֹם',      bare: 'אדום' },
    ],
    decoys: [
      { id: 'd1', he: 'הַיֶּלֶד',  bare: 'הילד' },
      { id: 'd2', he: 'שׁוֹתָה',   bare: 'שותה' },
      { id: 'd3', he: 'בָּנָנָה',  bare: 'בננה' },
      { id: 'd4', he: 'יָרוֹק',    bare: 'ירוק' },
    ],
  },

  {
    id: 'dog-running',
    wiki: 'Dog',
    imageQuery: 'happy dog running grass',
    sentence:    'הַכֶּלֶב רָץ בַּגִּנָּה הַיְּרֻקָּה',
    bareSentence:'הכלב רץ בגינה הירוקה',
    words: [
      { id: 'w1', he: 'הַכֶּלֶב',    bare: 'הכלב' },
      { id: 'w2', he: 'רָץ',         bare: 'רץ' },
      { id: 'w3', he: 'בַּגִּנָּה',  bare: 'בגינה' },
      { id: 'w4', he: 'הַיְּרֻקָּה', bare: 'הירוקה' },
    ],
    decoys: [
      { id: 'd1', he: 'הַחָתוּל',  bare: 'החתול' },
      { id: 'd2', he: 'יוֹשֵׁב',   bare: 'יושב' },
      { id: 'd3', he: 'בַּבַּיִת', bare: 'בבית' },
      { id: 'd4', he: 'הַכְּחֻלָּה', bare: 'הכחולה' },
    ],
  },
];

export const SCENES_BY_ID = Object.fromEntries(SCENES.map(s => [s.id, s]));
