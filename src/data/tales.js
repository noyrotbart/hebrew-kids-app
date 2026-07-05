// אֶרֶץ הַדְּרָקוֹן — listening-comprehension tales (world 9, the summit).
// Each tale is told sentence by sentence, then Draki asks free-form questions
// the kid ANSWERS BY SPEAKING ("איך קוראים לילדה?" → "קוראים לה קרן").
//
// Matching is keyword-based: the mic transcript passes if it contains any of
// `keywords` (nikud-stripped, substring — so natural full-sentence answers
// work). Include common spelling variants (אדום/אדם) because stripNikud of
// the ktiv-menukad form drops the vav some recognizers emit.
//
// Audio clips (parent-recorded in /#studio → tales tab, Avri mp3 fallback):
//   sentence i (1-based) → tales/{taleId}-s{i}
//   question           → tales/{taleId}-{qId}
//   spoken answer      → tales/{taleId}-{qId}-ans
//
// `decoys` power the no-mic fallback (multiple-choice chips).

export const TALES = [
  {
    id: 'keren-dog',
    title: 'קֶרֶן וְהַכֶּלֶב שׁוֹקוֹ',
    emoji: '👧🐶',
    mapEmoji: '🐶',
    sentences: [
      'קֶרֶן הִיא יַלְדָּה קְטַנָּה עִם כֶּלֶב גָּדוֹל.',
      'לַכֶּלֶב שֶׁל קֶרֶן קוֹרְאִים שׁוֹקוֹ.',
      'שׁוֹקוֹ אוֹהֵב לְשַׂחֵק בַּגִּנָּה עִם כַּדּוּר אָדֹם.',
      'בָּעֶרֶב קֶרֶן וְשׁוֹקוֹ שׁוֹתִים חָלָב וְהוֹלְכִים לִישֹׁן.',
    ],
    questions: [
      { id: 'q1', text: 'אֵיךְ קוֹרְאִים לַיַּלְדָּה בַּסִּפּוּר?', keywords: ['קרן'], answer: 'קוֹרְאִים לָהּ קֶרֶן!', decoys: ['דנה', 'עלמה'] },
      { id: 'q2', text: 'אֵיךְ קוֹרְאִים לַכֶּלֶב?', keywords: ['שוקו'], answer: 'קוֹרְאִים לוֹ שׁוֹקוֹ!', decoys: ['רקסי', 'מקס'] },
      { id: 'q3', text: 'בְּאֵיזֶה צֶבַע הַכַּדּוּר?', keywords: ['אדום', 'אדם'], answer: 'הַכַּדּוּר אָדֹם!', decoys: ['כחול', 'צהוב'] },
      { id: 'q4', text: 'מָה שׁוֹתִים בָּעֶרֶב?', keywords: ['חלב'], answer: 'שׁוֹתִים חָלָב!', decoys: ['מים', 'מיץ'] },
    ],
  },
  {
    id: 'trip-sea',
    title: 'הַטִּיּוּל שֶׁל יוֹנָתָן לַיָּם',
    emoji: '🌊⛱️',
    mapEmoji: '🌊',
    sentences: [
      'יוֹנָתָן נוֹסֵעַ עִם אַבָּא וְאִמָּא לַיָּם.',
      'בַּדֶּרֶךְ הֵם רוֹאִים גָּמָל גָּדוֹל עַל הַר.',
      'יוֹנָתָן בּוֹנֶה בַּחוֹל מִגְדָּל עָצוּם.',
      'בַּסּוֹף כֻּלָּם אוֹכְלִים תַּפּוּחַ מָתוֹק.',
    ],
    questions: [
      { id: 'q1', text: 'לְאָן נוֹסְעִים בַּסִּפּוּר?', keywords: ['ים'], answer: 'נוֹסְעִים לַיָּם!', decoys: ['הר', 'גן'] },
      { id: 'q2', text: 'אֵיזוֹ חַיָּה רוֹאִים עַל הָהָר?', keywords: ['גמל'], answer: 'רוֹאִים גָּמָל!', decoys: ['פיל', 'סוס'] },
      { id: 'q3', text: 'מָה יוֹנָתָן בּוֹנֶה בַּחוֹל?', keywords: ['מגדל'], answer: 'בּוֹנֶה מִגְדָּל!', decoys: ['בית', 'גשר'] },
      { id: 'q4', text: 'מָה אוֹכְלִים בַּסּוֹף?', keywords: ['תפוח'], answer: 'אוֹכְלִים תַּפּוּחַ!', decoys: ['בננה', 'לחם'] },
    ],
  },
  {
    id: 'dana-bird',
    title: 'הַצִּפּוֹר שֶׁל דָּנָה',
    emoji: '👧🐦',
    mapEmoji: '🐦',
    sentences: [
      'לְדָנָה יֵשׁ צִפּוֹר קְטַנָּה בְּצֶבַע צָהֹב.',
      'הַצִּפּוֹר אוֹהֶבֶת לָשִׁיר שִׁיר יָפֶה כָּל בֹּקֶר.',
      'יוֹם אֶחָד הַצִּפּוֹר עָפָה גָּבוֹהַּ אֶל הַשָּׁמַיִם.',
      'בָּעֶרֶב הִיא חָזְרָה הַבַּיְתָה, וְדָנָה שָׂמְחָה מְאוֹד.',
    ],
    questions: [
      { id: 'q1', text: 'אֵיךְ קוֹרְאִים לַיַּלְדָּה עִם הַצִּפּוֹר?', keywords: ['דנה'], answer: 'קוֹרְאִים לָהּ דָּנָה!', decoys: ['קרן', 'נעמי'] },
      { id: 'q2', text: 'בְּאֵיזֶה צֶבַע הַצִּפּוֹר?', keywords: ['צהוב', 'צהב'], answer: 'הַצִּפּוֹר צְהֻבָּה!', decoys: ['אדום', 'ירוק'] },
      { id: 'q3', text: 'מָה הַצִּפּוֹר אוֹהֶבֶת לַעֲשׂוֹת בַּבֹּקֶר?', keywords: ['לשיר', 'שיר', 'שרה'], answer: 'הִיא אוֹהֶבֶת לָשִׁיר!', decoys: ['לרקוד', 'לישון'] },
      { id: 'q4', text: 'לְאָן עָפָה הַצִּפּוֹר?', keywords: ['שמים'], answer: 'הִיא עָפָה לַשָּׁמַיִם!', decoys: ['לים', 'להר'] },
    ],
  },
  {
    id: 'draki-star',
    title: 'דְּרָקִי וְהַכּוֹכָב',
    emoji: '🐉⭐',
    mapEmoji: '⭐',
    sentences: [
      'בַּלַּיְלָה דְּרָקִי הַדְּרָקוֹן עָף בֵּין הַכּוֹכָבִים.',
      'פִּתְאוֹם הוּא רוֹאֶה כּוֹכָב קָטָן שֶׁנּוֹפֵל לַיָּם.',
      'דְּרָקִי צוֹלֵל לַמַּיִם וּמַחְזִיר אֶת הַכּוֹכָב לַשָּׁמַיִם.',
      'הַכּוֹכָב נוֹצֵץ וְאוֹמֵר: תּוֹדָה דְּרָקִי, אַתָּה חָבֵר אֲמִתִּי!',
    ],
    questions: [
      { id: 'q1', text: 'מִי עָף בֵּין הַכּוֹכָבִים?', keywords: ['דרקי', 'דרקון'], answer: 'דְּרָקִי הַדְּרָקוֹן!', decoys: ['ציפור', 'מטוס'] },
      { id: 'q2', text: 'לְאָן נָפַל הַכּוֹכָב?', keywords: ['ים', 'מים'], answer: 'הַכּוֹכָב נָפַל לַיָּם!', decoys: ['להר', 'לגינה'] },
      { id: 'q3', text: 'מָה אָמַר הַכּוֹכָב לִדְרָקִי?', keywords: ['תודה', 'חבר'], answer: 'הוּא אָמַר: תּוֹדָה, חָבֵר!', decoys: ['שלום', 'לילה טוב'] },
    ],
  },
];

export const TALE_BY_ID = Object.fromEntries(TALES.map(t => [t.id, t]));

export const sentenceClipId = (tale, i) => `${tale.id}-s${i + 1}`;
export const questionClipId = (tale, q) => `${tale.id}-${q.id}`;
export const answerClipId = (tale, q) => `${tale.id}-${q.id}-ans`;
