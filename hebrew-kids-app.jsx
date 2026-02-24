import { useState, useEffect, useRef } from "react";

const ALEPH_BET = [
  { hebrew: "א", audio: "alef",  name: "Aleph",  nameHebrew: "אָלֶף", sound: "silent", word: "Aryeh",   wordHebrew: "אַרְיֵה", emoji: "🦁", wordMeaning: "Lion" },
  { hebrew: "ב", audio: "bet",   name: "Bet",    nameHebrew: "בֵּית", sound: "B",      word: "Bayit",   wordHebrew: "בַּיִת", emoji: "🏠", wordMeaning: "House" },
  { hebrew: "ג", audio: "gimel", name: "Gimel",  nameHebrew: "גִּימֶל", sound: "G",    word: "Gamal",   wordHebrew: "גָּמָל", emoji: "🐪", wordMeaning: "Camel" },
  { hebrew: "ד", audio: "dalet", name: "Dalet",  nameHebrew: "דָּלֶת", sound: "D",    word: "Dag",     wordHebrew: "דָּג",   emoji: "🐟", wordMeaning: "Fish" },
  { hebrew: "ה", audio: "he",    name: "Hey",    nameHebrew: "הֵא",   sound: "H",      word: "Har",     wordHebrew: "הַר",    emoji: "⛰️", wordMeaning: "Mountain" },
  { hebrew: "ו", audio: "vav",   name: "Vav",    nameHebrew: "וָו",   sound: "V",      word: "Vered",   wordHebrew: "וֶרֶד",  emoji: "🌹", wordMeaning: "Rose" },
  { hebrew: "ז", audio: "zayin", name: "Zayin",  nameHebrew: "זַיִן", sound: "Z",      word: "Zahav",   wordHebrew: "זָהָב",  emoji: "⭐", wordMeaning: "Gold" },
  { hebrew: "ח", audio: "het",   name: "Chet",   nameHebrew: "חֵית", sound: "Ch",      word: "Chatul",  wordHebrew: "חָתוּל", emoji: "🐱", wordMeaning: "Cat" },
  { hebrew: "ט", audio: "tet",   name: "Tet",    nameHebrew: "טֵית", sound: "T",       word: "Taus",    wordHebrew: "טַוָּס", emoji: "🦚", wordMeaning: "Peacock" },
  { hebrew: "י", audio: "yod",   name: "Yod",    nameHebrew: "יוֹד", sound: "Y",       word: "Yam",     wordHebrew: "יָם",    emoji: "🌊", wordMeaning: "Sea" },
  { hebrew: "כ", audio: "kaf",   name: "Kaf",    nameHebrew: "כַּף", sound: "K",       word: "Kelev",   wordHebrew: "כֶּלֶב", emoji: "🐶", wordMeaning: "Dog" },
  { hebrew: "ל", audio: "lamed", name: "Lamed",  nameHebrew: "לָמֶד", sound: "L",     word: "Lev",     wordHebrew: "לֵב",    emoji: "❤️", wordMeaning: "Heart" },
  { hebrew: "מ", audio: "mem",   name: "Mem",    nameHebrew: "מֵם",  sound: "M",       word: "Mayim",   wordHebrew: "מַיִם",  emoji: "💧", wordMeaning: "Water" },
  { hebrew: "נ", audio: "nun",   name: "Nun",    nameHebrew: "נוּן", sound: "N",       word: "Namer",   wordHebrew: "נָמֵר",  emoji: "🐆", wordMeaning: "Leopard" },
  { hebrew: "ס", audio: "samex", name: "Samech", nameHebrew: "סָמֶךְ", sound: "S",    word: "Soos",    wordHebrew: "סוּס",   emoji: "🐴", wordMeaning: "Horse" },
  { hebrew: "ע", audio: "ayin",  name: "Ayin",   nameHebrew: "עַיִן", sound: "silent", word: "Etz",    wordHebrew: "עֵץ",    emoji: "🌳", wordMeaning: "Tree" },
  { hebrew: "פ", audio: "pe",    name: "Pey",    nameHebrew: "פֵּא", sound: "P",       word: "Pil",     wordHebrew: "פִּיל",  emoji: "🐘", wordMeaning: "Elephant" },
  { hebrew: "צ", audio: "tsadi", name: "Tzadi",  nameHebrew: "צָדִי", sound: "Tz",    word: "Tzipor",  wordHebrew: "צִפּוֹר", emoji: "🐦", wordMeaning: "Bird" },
  { hebrew: "ק", audio: "kof",   name: "Kuf",    nameHebrew: "קוֹף", sound: "K",       word: "Kof",     wordHebrew: "קוֹף",   emoji: "🐒", wordMeaning: "Monkey" },
  { hebrew: "ר", audio: "resh",  name: "Resh",   nameHebrew: "רֵישׁ", sound: "R",     word: "Rachev",  wordHebrew: "רֶכֶב",  emoji: "🚗", wordMeaning: "Car" },
  { hebrew: "ש", audio: "shin",  name: "Shin",   nameHebrew: "שִׁין", sound: "Sh",    word: "Shemesh", wordHebrew: "שֶׁמֶשׁ", emoji: "☀️", wordMeaning: "Sun" },
  { hebrew: "ת", audio: "tav",   name: "Tav",    nameHebrew: "תָּו", sound: "T",       word: "Tapuz",   wordHebrew: "תַּפּוּז", emoji: "🍊", wordMeaning: "Orange" },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ALL_HEB_LETTERS = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];

const WORD_CODEX = [
  { word:'אבא', letters:['א','ב','א'], meaning:'Dad',      emoji:'👨' },
  { word:'אמא', letters:['א','מ','א'], meaning:'Mom',      emoji:'👩' },
  { word:'בית', letters:['ב','י','ת'], meaning:'House',    emoji:'🏠' },
  { word:'כוס', letters:['כ','ו','ס'], meaning:'Cup',      emoji:'🥤' },
  { word:'ספר', letters:['ס','פ','ר'], meaning:'Book',     emoji:'📚' },
  { word:'כסא', letters:['כ','ס','א'], meaning:'Chair',    emoji:'🪑' },
  { word:'דלת', letters:['ד','ל','ת'], meaning:'Door',     emoji:'🚪' },
  { word:'שמש', letters:['ש','מ','ש'], meaning:'Sun',      emoji:'☀️' },
  { word:'ירח', letters:['י','ר','ח'], meaning:'Moon',     emoji:'🌙' },
  { word:'ענן', letters:['ע','נ','נ'], meaning:'Cloud',    emoji:'☁️' },
  { word:'שלג', letters:['ש','ל','ג'], meaning:'Snow',     emoji:'❄️' },
  { word:'גשם', letters:['ג','ש','מ'], meaning:'Rain',     emoji:'🌧️' },
  { word:'רוח', letters:['ר','ו','ח'], meaning:'Wind',     emoji:'💨' },
  { word:'אור', letters:['א','ו','ר'], meaning:'Light',    emoji:'💡' },
  { word:'נהר', letters:['נ','ה','ר'], meaning:'River',    emoji:'🌊' },
  { word:'לחם', letters:['ל','ח','מ'], meaning:'Bread',    emoji:'🍞' },
  { word:'חלב', letters:['ח','ל','ב'], meaning:'Milk',     emoji:'🥛' },
  { word:'פרח', letters:['פ','ר','ח'], meaning:'Flower',   emoji:'🌸' },
  { word:'כלב', letters:['כ','ל','ב'], meaning:'Dog',      emoji:'🐶' },
  { word:'דבש', letters:['ד','ב','ש'], meaning:'Honey',    emoji:'🍯' },
  { word:'שיר', letters:['ש','י','ר'], meaning:'Song',     emoji:'🎵' },
  { word:'זהב', letters:['ז','ה','ב'], meaning:'Gold',     emoji:'✨' },
  { word:'אבן', letters:['א','ב','נ'], meaning:'Stone',    emoji:'🪨' },
  { word:'כסף', letters:['כ','ס','פ'], meaning:'Money',    emoji:'💰' },
  { word:'ילד', letters:['י','ל','ד'], meaning:'Boy',      emoji:'👦' },
  { word:'שור', letters:['ש','ו','ר'], meaning:'Bull',     emoji:'🐂' },
  { word:'סוס', letters:['ס','ו','ס'], meaning:'Horse',    emoji:'🐴' },
  { word:'נחש', letters:['נ','ח','ש'], meaning:'Snake',    emoji:'🐍' },
  { word:'ארי', letters:['א','ר','י'], meaning:'Lion',     emoji:'🦁' },
  { word:'דוב', letters:['ד','ו','ב'], meaning:'Bear',     emoji:'🐻' },
  { word:'עוף', letters:['ע','ו','פ'], meaning:'Bird',     emoji:'🐦' },
  { word:'קוף', letters:['ק','ו','פ'], meaning:'Monkey',   emoji:'🐒' },
  { word:'ראש', letters:['ר','א','ש'], meaning:'Head',     emoji:'🗣️' },
  { word:'עין', letters:['ע','י','נ'], meaning:'Eye',      emoji:'👁️' },
  { word:'רגל', letters:['ר','ג','ל'], meaning:'Leg',      emoji:'🦵' },
  { word:'אזן', letters:['א','ז','נ'], meaning:'Ear',      emoji:'👂' },
  { word:'קיר', letters:['ק','י','ר'], meaning:'Wall',     emoji:'🧱' },
  { word:'גוף', letters:['ג','ו','פ'], meaning:'Body',     emoji:'🫀' },
  { word:'יום', letters:['י','ו','מ'], meaning:'Day',      emoji:'📅' },
  { word:'פיל', letters:['פ','י','ל'], meaning:'Elephant', emoji:'🐘' },
  { word:'טוב', letters:['ט','ו','ב'], meaning:'Good',     emoji:'👍' },
  { word:'גדי', letters:['ג','ד','י'], meaning:'Goat',     emoji:'🐐' },
  { word:'כבש', letters:['כ','ב','ש'], meaning:'Lamb',     emoji:'🐑' },
  { word:'נמר', letters:['נ','מ','ר'], meaning:'Leopard',  emoji:'🐆' },
  { word:'שדה', letters:['ש','ד','ה'], meaning:'Field',    emoji:'🌾' },
  { word:'מים', letters:['מ','י','מ'], meaning:'Water',    emoji:'💧' },
  { word:'שפה', letters:['ש','פ','ה'], meaning:'Language', emoji:'👄' },
  { word:'גבר', letters:['ג','ב','ר'], meaning:'Man',      emoji:'🧔' },
  { word:'שבת', letters:['ש','ב','ת'], meaning:'Shabbat',  emoji:'✡️' },
  { word:'אכל', letters:['א','כ','ל'], meaning:'Ate',      emoji:'🍴' },
];

// ── 4-LETTER WORD CODEX (Advanced) ────────────────────────────
const WORD_CODEX_4 = [
  { word:'ילדה', letters:['י','ל','ד','ה'], meaning:'Girl',        emoji:'👧' },
  { word:'חתול', letters:['ח','ת','ו','ל'], meaning:'Cat',         emoji:'🐱' },
  { word:'ארנב', letters:['א','ר','נ','ב'], meaning:'Rabbit',      emoji:'🐰' },
  { word:'כבשה', letters:['כ','ב','ש','ה'], meaning:'Sheep',       emoji:'🐑' },
  { word:'תפוח', letters:['ת','פ','ו','ח'], meaning:'Apple',       emoji:'🍎' },
  { word:'חלון', letters:['ח','ל','ו','נ'], meaning:'Window',      emoji:'🪟' },
  { word:'לילה', letters:['ל','י','ל','ה'], meaning:'Night',       emoji:'🌙' },
  { word:'בוקר', letters:['ב','ו','ק','ר'], meaning:'Morning',     emoji:'🌅' },
  { word:'חודש', letters:['ח','ו','ד','ש'], meaning:'Month',       emoji:'📅' },
  { word:'שבוע', letters:['ש','ב','ו','ע'], meaning:'Week',        emoji:'📆' },
  { word:'מטוס', letters:['מ','ט','ו','ס'], meaning:'Airplane',    emoji:'✈️' },
  { word:'כדור', letters:['כ','ד','ו','ר'], meaning:'Ball',        emoji:'⚽' },
  { word:'כיתה', letters:['כ','י','ת','ה'], meaning:'Classroom',   emoji:'🏫' },
  { word:'מורה', letters:['מ','ו','ר','ה'], meaning:'Teacher',     emoji:'👩‍🏫' },
  { word:'אחות', letters:['א','ח','ו','ת'], meaning:'Sister',      emoji:'👧' },
  { word:'דודה', letters:['ד','ו','ד','ה'], meaning:'Aunt',        emoji:'👩' },
  { word:'סבתא', letters:['ס','ב','ת','א'], meaning:'Grandma',     emoji:'👵' },
  { word:'מלכה', letters:['מ','ל','כ','ה'], meaning:'Queen',       emoji:'👑' },
  { word:'כוכב', letters:['כ','ו','כ','ב'], meaning:'Star',        emoji:'⭐' },
  { word:'אדמה', letters:['א','ד','מ','ה'], meaning:'Earth',       emoji:'🌍' },
  { word:'אריה', letters:['א','ר','י','ה'], meaning:'Lion',        emoji:'🦁' },
  { word:'שחור', letters:['ש','ח','ו','ר'], meaning:'Black',       emoji:'⚫' },
  { word:'כחול', letters:['כ','ח','ו','ל'], meaning:'Blue',        emoji:'🔵' },
  { word:'צהוב', letters:['צ','ה','ו','ב'], meaning:'Yellow',      emoji:'🌟' },
  { word:'ירוק', letters:['י','ר','ו','ק'], meaning:'Green',       emoji:'🌿' },
  { word:'אדום', letters:['א','ד','ו','מ'], meaning:'Red',         emoji:'🔴' },
  { word:'ורוד', letters:['ו','ר','ו','ד'], meaning:'Pink',        emoji:'🌸' },
  { word:'רכבת', letters:['ר','כ','ב','ת'], meaning:'Train',       emoji:'🚂' },
  { word:'תפוז', letters:['ת','פ','ו','ז'], meaning:'Orange',      emoji:'🍊' },
  { word:'נמלה', letters:['נ','מ','ל','ה'], meaning:'Ant',         emoji:'🐜' },
  { word:'פרפר', letters:['פ','ר','פ','ר'], meaning:'Butterfly',   emoji:'🦋' },
  { word:'דובי', letters:['ד','ו','ב','י'], meaning:'Teddy Bear',  emoji:'🧸' },
  { word:'בובה', letters:['ב','ו','ב','ה'], meaning:'Doll',        emoji:'🪆' },
  { word:'שינה', letters:['ש','י','נ','ה'], meaning:'Sleep',       emoji:'😴' },
  { word:'ריצה', letters:['ר','י','צ','ה'], meaning:'Running',     emoji:'🏃' },
  { word:'ציור', letters:['צ','י','ו','ר'], meaning:'Drawing',     emoji:'🎨' },
  { word:'שעון', letters:['ש','ע','ו','נ'], meaning:'Clock',       emoji:'⏰' },
  { word:'מחשב', letters:['מ','ח','ש','ב'], meaning:'Computer',    emoji:'💻' },
  { word:'עוגה', letters:['ע','ו','ג','ה'], meaning:'Cake',        emoji:'🎂' },
  { word:'שמלה', letters:['ש','מ','ל','ה'], meaning:'Dress',       emoji:'👗' },
  { word:'כובע', letters:['כ','ו','ב','ע'], meaning:'Hat',         emoji:'🎩' },
  { word:'בלון', letters:['ב','ל','ו','נ'], meaning:'Balloon',     emoji:'🎈' },
  { word:'טירה', letters:['ט','י','ר','ה'], meaning:'Castle',      emoji:'🏰' },
  { word:'נרות', letters:['נ','ר','ו','ת'], meaning:'Candles',     emoji:'🕯️' },
  { word:'שופר', letters:['ש','ו','פ','ר'], meaning:'Shofar',      emoji:'📯' },
  { word:'חלום', letters:['ח','ל','ו','מ'], meaning:'Dream',       emoji:'💭' },
  { word:'גדול', letters:['ג','ד','ו','ל'], meaning:'Big',         emoji:'🐘' },
  { word:'עצוב', letters:['ע','צ','ו','ב'], meaning:'Sad',         emoji:'😢' },
  { word:'שמחה', letters:['ש','מ','ח','ה'], meaning:'Joy',         emoji:'😊' },
  { word:'חנות', letters:['ח','נ','ו','ת'], meaning:'Shop',        emoji:'🏪' },
];

// ── 5-LETTER WORD CODEX (Expert) ──────────────────────────────
const WORD_CODEX_5 = [
  { word:'ציפור', letters:['צ','י','פ','ו','ר'], meaning:'Bird',        emoji:'🐦' },
  { word:'ילדים', letters:['י','ל','ד','י','מ'], meaning:'Children',    emoji:'👦' },
  { word:'שולחן', letters:['ש','ו','ל','ח','נ'], meaning:'Table',       emoji:'🪑' },
  { word:'מחברת', letters:['מ','ח','ב','ר','ת'], meaning:'Notebook',    emoji:'📓' },
  { word:'תלמיד', letters:['ת','ל','מ','י','ד'], meaning:'Student',     emoji:'🎒' },
  { word:'ספינה', letters:['ס','פ','י','נ','ה'], meaning:'Ship',        emoji:'⛵' },
  { word:'ברווז', letters:['ב','ר','ו','ו','ז'], meaning:'Duck',        emoji:'🦆' },
  { word:'עכביש', letters:['ע','כ','ב','י','ש'], meaning:'Spider',      emoji:'🕷️' },
  { word:'אפרוח', letters:['א','פ','ר','ו','ח'], meaning:'Chick',       emoji:'🐥' },
  { word:'דבורה', letters:['ד','ב','ו','ר','ה'], meaning:'Bee',         emoji:'🐝' },
  { word:'לימון', letters:['ל','י','מ','ו','נ'], meaning:'Lemon',       emoji:'🍋' },
  { word:'אבטיח', letters:['א','ב','ט','י','ח'], meaning:'Watermelon',  emoji:'🍉' },
  { word:'ענבים', letters:['ע','נ','ב','י','מ'], meaning:'Grapes',      emoji:'🍇' },
  { word:'נסיכה', letters:['נ','ס','י','כ','ה'], meaning:'Princess',    emoji:'👸' },
  { word:'גיבור', letters:['ג','י','ב','ו','ר'], meaning:'Hero',        emoji:'🦸' },
  { word:'ספריה', letters:['ס','פ','ר','י','ה'], meaning:'Library',     emoji:'📚' },
  { word:'מנורה', letters:['מ','נ','ו','ר','ה'], meaning:'Lamp',        emoji:'🕎' },
  { word:'שמיכה', letters:['ש','מ','י','כ','ה'], meaning:'Blanket',     emoji:'🛏️' },
  { word:'מונית', letters:['מ','ו','נ','י','ת'], meaning:'Taxi',        emoji:'🚕' },
  { word:'משפחה', letters:['מ','ש','פ','ח','ה'], meaning:'Family',      emoji:'👨‍👩‍👦' },
  { word:'גלידה', letters:['ג','ל','י','ד','ה'], meaning:'Ice Cream',   emoji:'🍦' },
  { word:'עוגיה', letters:['ע','ו','ג','י','ה'], meaning:'Cookie',      emoji:'🍪' },
  { word:'נעלים', letters:['נ','ע','ל','י','מ'], meaning:'Shoes',       emoji:'👟' },
  { word:'חולצה', letters:['ח','ו','ל','צ','ה'], meaning:'Shirt',       emoji:'👕' },
  { word:'בקבוק', letters:['ב','ק','ב','ו','ק'], meaning:'Bottle',      emoji:'🍼' },
  { word:'חגיגה', letters:['ח','ג','י','ג','ה'], meaning:'Celebration', emoji:'🎉' },
  { word:'מסיבה', letters:['מ','ס','י','ב','ה'], meaning:'Party',       emoji:'🎊' },
  { word:'ארמון', letters:['א','ר','מ','ו','נ'], meaning:'Palace',      emoji:'🏰' },
  { word:'חנוכה', letters:['ח','נ','ו','כ','ה'], meaning:'Hanukkah',    emoji:'🕎' },
  { word:'סוכות', letters:['ס','ו','כ','ו','ת'], meaning:'Sukkot',      emoji:'🌿' },
  { word:'מדינה', letters:['מ','ד','י','נ','ה'], meaning:'Country',     emoji:'🗺️' },
  { word:'ילדות', letters:['י','ל','ד','ו','ת'], meaning:'Childhood',   emoji:'🧒' },
  { word:'כלבלב', letters:['כ','ל','ב','ל','ב'], meaning:'Puppy',       emoji:'🐶' },
  { word:'ארנבת', letters:['א','ר','נ','ב','ת'], meaning:'Bunny',       emoji:'🐰' },
  { word:'קופים', letters:['ק','ו','פ','י','מ'], meaning:'Monkeys',     emoji:'🐒' },
  { word:'פילים', letters:['פ','י','ל','י','מ'], meaning:'Elephants',   emoji:'🐘' },
  { word:'אריות', letters:['א','ר','י','ו','ת'], meaning:'Lions',       emoji:'🦁' },
  { word:'נמרים', letters:['נ','מ','ר','י','מ'], meaning:'Leopards',    emoji:'🐆' },
  { word:'לויתן', letters:['ל','ו','י','ת','נ'], meaning:'Whale',       emoji:'🐋' },
  { word:'נהרות', letters:['נ','ה','ר','ו','ת'], meaning:'Rivers',      emoji:'🌊' },
  { word:'פרחים', letters:['פ','ר','ח','י','מ'], meaning:'Flowers',     emoji:'🌸' },
  { word:'שיעור', letters:['ש','י','ע','ו','ר'], meaning:'Lesson',      emoji:'📖' },
  { word:'אחיות', letters:['א','ח','י','ו','ת'], meaning:'Sisters',     emoji:'👧' },
  { word:'תמרים', letters:['ת','מ','ר','י','מ'], meaning:'Dates',       emoji:'🌴' },
  { word:'גיטרה', letters:['ג','י','ט','ר','ה'], meaning:'Guitar',      emoji:'🎸' },
  { word:'פסנתר', letters:['פ','ס','נ','ת','ר'], meaning:'Piano',       emoji:'🎹' },
  { word:'חינוך', letters:['ח','י','נ','ו','כ'], meaning:'Education',   emoji:'📚' },
  { word:'בריכה', letters:['ב','ר','י','כ','ה'], meaning:'Pool',        emoji:'🏊' },
  { word:'אופנה', letters:['א','ו','פ','נ','ה'], meaning:'Fashion',     emoji:'👗' },
  { word:'שמחות', letters:['ש','מ','ח','ו','ת'], meaning:'Celebrations',emoji:'🎊' },
];

// ── HELPERS ───────────────────────────────────────────────────
// Remove Hebrew nikud (vowel points) so TTS doesn't stumble on them
const stripNikud = (s) => s.replace(/[\u0591-\u05C7]/g, '');

// Fuzzy string distance for speech recognition matching
const levenshtein = (a, b) => {
  const dp = Array(b.length + 1).fill(null).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = a[i-1] === b[j-1] ? dp[j-1] : Math.min(dp[j], dp[j-1], prev) + 1;
      dp[j-1] = prev; prev = cur;
    }
    dp[b.length] = prev;
  }
  return dp[b.length];
};

// Phonetic alternatives: how Chrome en-US might transcribe each letter name
const LETTER_PHONETICS = {
  'Aleph':  ['alef','elif','alpha','alfa','olef','ale','elf'],
  'Bet':    ['beit','bayt','bate','bit','bad','bed'],
  'Gimel':  ['giml','gimmel','gemel','geemel','gimme'],
  'Dalet':  ['daled','dollet','dahlet','ballet','dollar'],
  'Hey':    ['hay','hei','he','hi','hate'],
  'Vav':    ['waw','wov','wav','vov','vow','bob','wave'],
  'Zayin':  ['zayn','zain','zion','zayen','sign'],
  'Chet':   ['het','khes','khet','cheat','chest','cat','chat','hate'],
  'Tet':    ['teth','tes','tate','teeth','debt'],
  'Yod':    ['yud','jod','yode','jot','yard'],
  'Kaf':    ['kaph','caf','cop','caph','kopp','cup'],
  'Lamed':  ['lamet','lammed','lam','lame','llama'],
  'Mem':    ['meme','maim','mam','meow','main'],
  'Nun':    ['noon','none','known','newn','nun'],
  'Samech': ['samek','sonic','stomach','simek','some','sonic'],
  'Ayin':   ['ain','ayn','aein','eyen','iyin','nine'],
  'Pey':    ['pe','pay','peh','pie','hay'],
  'Tzadi':  ['tsadi','tsadik','zadi','sadee','tzaddik','zadik','sadie','sadi','daddy'],
  'Kuf':    ['koph','cough','cuf','coop','cool','cop'],
  'Resh':   ['reish','rash','raish','rush','mesh'],
  'Shin':   ['sheen','scene','shinn','chin','been'],
  'Tav':    ['taf','tow','tuv','tab','tov','top','tough'],
};

// Hebrew QWERTY keyboard rows (only 22 base letters, QWERTY positions)
const HEB_KEYBOARD = [
  ['ק','ר','א','ט','ו','פ'],          // e r t y u p
  ['ש','ד','ג','כ','ע','י','ח','ל'],  // a s d f g h j k
  ['ז','ס','ב','ה','נ','מ','צ','ת'],  // z x c v b n m ,
];
// Physical key → Hebrew letter mapping
const KEY_MAP = {
  'e':'ק','r':'ר','t':'א','y':'ט','u':'ו','p':'פ',
  'a':'ש','s':'ד','d':'ג','f':'כ','g':'ע','h':'י','j':'ח','k':'ל',
  'z':'ז','x':'ס','c':'ב','v':'ה','b':'נ','n':'מ','m':'צ',',':'ת','<':'ת',
};

// ── AUDIO ─────────────────────────────────────────────────────
// Cache: text → blob URL (fetched once per session, then instant)
const _ttsCache = new Map();

/**
 * Speak Hebrew text — Phonikud quality when available, Web Speech fallback.
 *
 * Calls /api/tts (unified endpoint):
 *   • Locally:   Vite proxies to the Flask server  (tts-server/server.py)
 *   • On Vercel: served by api/tts.js → HF Space   (no extra server needed)
 *
 * Race logic — starts the TTS fetch immediately, then:
 *   ≤ 2.5 s  → plays the Phonikud audio (and caches it)
 *   > 2.5 s  → plays Web Speech right now; TTS still runs in the background
 *              and caches the result so the *next* call is instant Phonikud.
 *
 * This handles HF Space cold-starts (can take 30–60 s after 15 min idle)
 * without ever blocking the UI.
 *
 * Returns a Promise that resolves when audio ends (useful for chaining).
 */
const speakHebrew = async (text) => {
  // ── Serve from cache immediately ─────────────────────────────
  const cached = _ttsCache.get(text);
  if (cached) {
    return new Promise((resolve) => {
      const a = new Audio(cached);
      a.onended = resolve;
      a.onerror = resolve;
      a.play().catch(resolve);
    });
  }

  // ── Fire TTS fetch in the background ─────────────────────────
  const ttsFetch = fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(15000),
  }).then(async (r) => {
    if (!r.ok) return null;
    const url = URL.createObjectURL(await r.blob());
    _ttsCache.set(text, url); // cache for next call
    if (typeof _setTtsStatus === 'function') _setTtsStatus('hot'); // light goes green
    return url;
  }).catch(() => null);

  // ── Race: TTS within 2.5 s vs. Web Speech fallback ──────────
  const winner = await Promise.race([
    ttsFetch,
    new Promise((resolve) => setTimeout(() => resolve('slow'), 2500)),
  ]);

  if (winner && winner !== 'slow') {
    // TTS responded in time — play Phonikud audio
    return new Promise((resolve) => {
      const a = new Audio(winner);
      a.onended = resolve;
      a.onerror = resolve;
      a.play().catch(resolve);
    });
  }

  // ── Fallback: Web Speech API ─────────────────────────────────
  // ttsFetch keeps running in the background; once it resolves (within 10 s)
  // we replay the phrase in the good Phonikud voice automatically.
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const wsPromise = new Promise((resolve) => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'he-IL';
    utt.rate = 0.8;
    utt.onend  = resolve;
    utt.onerror = resolve;
    window.speechSynthesis.speak(utt);
  });

  // After Web Speech ends, replay in Phonikud voice if it arrives within 10 s
  wsPromise.then(async () => {
    const retryUrl = await Promise.race([
      ttsFetch,
      new Promise(r => setTimeout(() => r(null), 10000)),
    ]);
    if (retryUrl) {
      const a = new Audio(retryUrl);
      a.play().catch(() => {});
    }
  });

  return wsPromise;
};

// Play a recorded letter audio file; fall back to Phonikud / Web Speech API
const speakLetter = (letter) => {
  if (letter.audio) {
    const a = new Audio(`/audio/${letter.audio}.m4a`);
    a.play().catch(() => speakHebrew(stripNikud(letter.nameHebrew)));
  } else {
    speakHebrew(stripNikud(letter.nameHebrew));
  }
};

// Spell a word: say the whole word (Phonikud/TTS), then each letter name (recorded audio)
const speakSpelled = (word) => {
  const entries = word.letters
    .map(ch => ALEPH_BET.find(l => l.hebrew === ch))
    .filter(Boolean);
  const playChain = (i) => {
    if (i >= entries.length) return;
    const a = new Audio(`/audio/${entries[i].audio}.m4a`);
    a.onended = () => playChain(i + 1);
    a.play().catch(() => {
      speakHebrew(stripNikud(entries[i].nameHebrew)).then(() => playChain(i + 1));
    });
  };
  // Say the whole word first, then chain the letter names
  speakHebrew(word.word).then(() => playChain(0));
};

// Spell a plain Hebrew string letter-by-letter via recorded audio
const speakWordLetters = (wordStr) => {
  const stripped = stripNikud(wordStr);
  const entries = [...stripped]
    .map(ch => ALEPH_BET.find(l => l.hebrew === ch))
    .filter(Boolean);
  const playChain = (i) => {
    if (i >= entries.length) return;
    const a = new Audio(`/audio/${entries[i].audio}.m4a`);
    a.onended = () => playChain(i + 1);
    a.play().catch(() => {
      speakHebrew(stripNikud(entries[i].nameHebrew)).then(() => playChain(i + 1));
    });
  };
  playChain(0);
};

function SpeakButton({ onClick, style = {} }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)',
        borderRadius: 50, width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 18, color: '#60a5fa',
        ...style,
      }}
    >🔊</button>
  );
}

// Interactive letter tile for the home screen alphabet bar
function LetterButton({ letter }) {
  const [popped, setPopped] = useState(false);
  const handleClick = () => {
    speakLetter(letter);
    setPopped(true);
    setTimeout(() => setPopped(false), 350);
  };
  return (
    <button onClick={handleClick} style={{
      fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, color: '#c4b5fd',
      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
      transform: popped ? 'scale(1.9)' : 'scale(1)',
      transition: 'transform 0.15s ease-out', display: 'inline-block',
    }}>{letter.hebrew}</button>
  );
}

// ── STARS / XP ────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[...Array(3)].map((_, i) => (
        <span key={i} style={{ fontSize: 20, filter: i < count ? "none" : "grayscale(1) opacity(0.3)" }}>⭐</span>
      ))}
    </div>
  );
}

// ── FLASHCARD MODE ─────────────────────────────────────────────
function Flashcards({ onXP }) {
  // Infinite-cycling shuffled queue
  const [queue, setQueue] = useState(() => shuffle(ALEPH_BET));
  const [qPos, setQPos] = useState(0);
  const [totalSeen, setTotalSeen] = useState(0);

  const [phase, setPhase] = useState('ready'); // ready | listening | result
  const [timeLeft, setTimeLeft] = useState(5);
  const [result, setResult] = useState(null); // { correct, heard }
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const resultDoneRef = useRef(false);
  const autoStartRef = useRef(null);

  const L = queue[qPos];

  // Speak the letter name (recorded audio) then auto-start mic
  useEffect(() => {
    // First play the recorded letter name so the user hears it clearly
    const speakT = setTimeout(() => speakLetter(L), 300);
    // Then start listening after the letter name has had time to play (~1.2 s)
    autoStartRef.current = setTimeout(() => doListen(L), 1500);
    return () => { clearTimeout(speakT); clearTimeout(autoStartRef.current); };
  }, [qPos, queue]); // re-runs whenever we advance to a new letter

  const [appealed, setAppealed] = useState(false);

  const finishRound = (heard, correct, letter) => {
    if (resultDoneRef.current) return;
    resultDoneRef.current = true;
    clearInterval(timerRef.current);
    setResult({ heard, correct });
    setAppealed(false);
    setPhase('result');
    if (correct) {
      speakHebrew('נכון');
      onXP(100);
    } else {
      speakLetter(letter);
      onXP(-50);
      // After the letter name plays, ask the appeal question
      setTimeout(() => speakHebrew('אני חושבת שטעית. אתה מסכים?'), 1400);
    }
  };

  const handleAppeal = () => {
    // Reverse the -50 and give +100 (net +150)
    setAppealed(true);
    onXP(150);
    speakHebrew('בסדר, נקבל את זה!');
  };

  const doListen = (letter) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    clearTimeout(autoStartRef.current);
    resultDoneRef.current = false;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 5;

    let count = 5;
    setTimeLeft(count);
    setPhase('listening');

    timerRef.current = setInterval(() => {
      count--;
      setTimeLeft(count);
      if (count <= 0) { clearInterval(timerRef.current); try { rec.stop(); } catch(e) {} }
    }, 1000);

    rec.onresult = (e) => {
      const alts = Array.from({ length: e.results[0].length }, (_, i) =>
        e.results[0][i].transcript.trim().toLowerCase()
      );
      const expected = letter.name.toLowerCase();
      const extras = LETTER_PHONETICS[letter.name] || [];
      const allForms = [expected, ...extras];
      const correct = alts.some(alt => {
        const a = alt.replace(/[^a-z]/g, '');
        if (!a) return false;
        return allForms.some(form => {
          if (a.includes(form) || form.includes(a)) return true;
          // Fuzzy: allow up to 2 edits for longer words, 1 for short
          const maxDist = form.length <= 4 ? 1 : 2;
          return levenshtein(a, form) <= maxDist;
        });
      });
      finishRound(alts[0], correct, letter);
    };
    rec.onerror = (e) => { if (e.error !== 'no-speech') finishRound('(error)', false, letter); };
    rec.onend = () => { if (!resultDoneRef.current) finishRound('(no speech)', false, letter); };
    rec.start();
  };

  const next = () => {
    clearInterval(timerRef.current);
    clearTimeout(autoStartRef.current);
    if (recRef.current) { try { recRef.current.stop(); } catch(e) {} }
    setPhase('ready');
    setResult(null);
    setTimeLeft(5);
    resultDoneRef.current = false;
    setTotalSeen(n => n + 1);
    const nextPos = qPos + 1;
    if (nextPos >= queue.length) {
      // Reshuffle for next cycle
      setQueue(shuffle(ALEPH_BET));
      setQPos(0);
    } else {
      setQPos(nextPos);
    }
  };

  // Keyboard: Space/Enter advances to next card when result is showing
  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'result') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, qPos]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ color: '#60a5fa', fontSize: 14, fontWeight: 700, letterSpacing: 2, fontFamily:"'Noto Serif Hebrew',serif", direction:'rtl' }}>
        #{totalSeen + 1} · !אמרו את שם האות
      </div>

      <div style={{
        width: 300, height: 320, borderRadius: 28,
        background: phase === 'result'
          ? result?.correct ? 'linear-gradient(135deg,#065f46,#047857)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)'
          : phase === 'listening' ? 'linear-gradient(135deg,#1e40af,#0369a1)'
          : 'linear-gradient(135deg,#0d2160,#1a3a8f)',
        border: '3px solid rgba(96,165,250,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: 24,
        boxShadow: phase === 'listening' ? '0 0 50px rgba(29,78,216,0.8)' : '0 20px 60px rgba(29,78,216,0.4)',
        transition: 'all 0.4s',
      }}>
        <div style={{ fontSize: 120, lineHeight: 1, fontFamily: "'Noto Serif Hebrew', serif", color: '#f0e6ff' }}>
          {L.hebrew}
        </div>
        {phase === 'result' && result && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              {result.correct ? '✅ נכון! +100' : appealed ? '!🏅 ערעור התקבל' : '❌ לא נכון −50'}
            </div>
            <div style={{ fontSize: 18, opacity: 0.9, marginTop: 4, fontFamily: "'Noto Serif Hebrew', serif" }}>
              {L.nameHebrew}
            </div>
            {result.heard && !result.heard.startsWith('(') && (
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2, direction:'rtl' }}>:אמרת "{result.heard}"</div>
            )}
          </div>
        )}
      </div>

      {phase === 'ready' && (
        <div style={{ color: '#60a5fa', fontSize: 15, opacity: 0.7, fontFamily:"'Noto Serif Hebrew',serif" }}>…מתחיל</div>
      )}

      {phase === 'listening' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: '0 0 30px rgba(14,165,233,0.7)',
            animation: 'pulse-ring 1s ease-in-out infinite',
          }}>🎤</div>
          <div style={{ color: '#93c5fd', fontSize: 22, fontWeight: 900, fontFamily:"'Noto Serif Hebrew',serif", direction:'rtl' }}>
            {timeLeft} · מאזין
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* Appeal button — only when wrong and not yet appealed */}
          {result && !result.correct && !appealed && (
            <button onClick={handleAppeal} style={{
              padding: '11px 28px', borderRadius: 50, border: '2px solid #f59e0b',
              background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
              fontSize: 14, fontWeight: 900, cursor: 'pointer',
              fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl',
            }}>💪 אני בטוח שאני צודק</button>
          )}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <SpeakButton onClick={() => speakLetter(L)} />
            <button onClick={next} style={{
              padding: '14px 36px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
              fontSize: 16, fontWeight: 900, cursor: 'pointer',
            }}>← הבא</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MATCHING GAME ──────────────────────────────────────────────
// ── 100 MATCHING PAIRS ────────────────────────────────────────
const MATCHING_PAIRS = [
  // Animals (1-25)
  { id:'m1',  word:'אריה',    emoji:'🦁' },
  { id:'m2',  word:'דוב',     emoji:'🐻' },
  { id:'m3',  word:'כלב',     emoji:'🐶' },
  { id:'m4',  word:'חתול',    emoji:'🐱' },
  { id:'m5',  word:'פיל',     emoji:'🐘' },
  { id:'m6',  word:'קוף',     emoji:'🐒' },
  { id:'m7',  word:'נמר',     emoji:'🐆' },
  { id:'m8',  word:'גמל',     emoji:'🐪' },
  { id:'m9',  word:'סוס',     emoji:'🐴' },
  { id:'m10', word:'פרה',     emoji:'🐄' },
  { id:'m11', word:'כבש',     emoji:'🐑' },
  { id:'m12', word:'עז',      emoji:'🐐' },
  { id:'m13', word:'תרנגול',  emoji:'🐓' },
  { id:'m14', word:'ברווז',   emoji:'🦆' },
  { id:'m15', word:'צב',      emoji:'🐢' },
  { id:'m16', word:'נחש',     emoji:'🐍' },
  { id:'m17', word:'דג',      emoji:'🐟' },
  { id:'m18', word:'צפרדע',   emoji:'🐸' },
  { id:'m19', word:'פרפר',    emoji:'🦋' },
  { id:'m20', word:'דבורה',   emoji:'🐝' },
  { id:'m21', word:'ציפור',   emoji:'🐦' },
  { id:'m22', word:'כריש',    emoji:'🦈' },
  { id:'m23', word:'זאב',     emoji:'🐺' },
  { id:'m24', word:'ארנב',    emoji:'🐰' },
  { id:'m25', word:'עכבר',    emoji:'🐭' },
  // Food & Drinks (26-45)
  { id:'m26', word:'תפוח',    emoji:'🍎' },
  { id:'m27', word:'בננה',    emoji:'🍌' },
  { id:'m28', word:'ענב',     emoji:'🍇' },
  { id:'m29', word:'תפוז',    emoji:'🍊' },
  { id:'m30', word:'לימון',   emoji:'🍋' },
  { id:'m31', word:'תות',     emoji:'🍓' },
  { id:'m32', word:'גזר',     emoji:'🥕' },
  { id:'m33', word:'לחם',     emoji:'🍞' },
  { id:'m34', word:'גבינה',   emoji:'🧀' },
  { id:'m35', word:'ביצה',    emoji:'🥚' },
  { id:'m36', word:'חלב',     emoji:'🥛' },
  { id:'m37', word:'דבש',     emoji:'🍯' },
  { id:'m38', word:'עוגה',    emoji:'🎂' },
  { id:'m39', word:'גלידה',   emoji:'🍦' },
  { id:'m40', word:'שוקולד',  emoji:'🍫' },
  { id:'m41', word:'פיצה',    emoji:'🍕' },
  { id:'m42', word:'אבטיח',   emoji:'🍉' },
  { id:'m43', word:'אננס',    emoji:'🍍' },
  { id:'m44', word:'תירס',    emoji:'🌽' },
  { id:'m45', word:'בצל',     emoji:'🧅' },
  // Nature (46-60)
  { id:'m46', word:'שמש',     emoji:'☀️' },
  { id:'m47', word:'ירח',     emoji:'🌙' },
  { id:'m48', word:'כוכב',    emoji:'⭐' },
  { id:'m49', word:'ענן',     emoji:'☁️' },
  { id:'m50', word:'גשם',     emoji:'🌧️' },
  { id:'m51', word:'שלג',     emoji:'❄️' },
  { id:'m52', word:'קשת',     emoji:'🌈' },
  { id:'m53', word:'פרח',     emoji:'🌸' },
  { id:'m54', word:'עץ',      emoji:'🌳' },
  { id:'m55', word:'הר',      emoji:'⛰️' },
  { id:'m56', word:'ים',      emoji:'🌊' },
  { id:'m57', word:'אש',      emoji:'🔥' },
  { id:'m58', word:'ורד',     emoji:'🌹' },
  { id:'m59', word:'עלה',     emoji:'🍃' },
  { id:'m60', word:'פטרייה',  emoji:'🍄' },
  // Objects & Transport (61-80)
  { id:'m61', word:'בית',     emoji:'🏠' },
  { id:'m62', word:'מכונית',  emoji:'🚗' },
  { id:'m63', word:'מטוס',    emoji:'✈️' },
  { id:'m64', word:'ספינה',   emoji:'🚢' },
  { id:'m65', word:'רכבת',    emoji:'🚂' },
  { id:'m66', word:'אופניים', emoji:'🚲' },
  { id:'m67', word:'ספר',     emoji:'📚' },
  { id:'m68', word:'עיפרון',  emoji:'✏️' },
  { id:'m69', word:'מחשב',    emoji:'💻' },
  { id:'m70', word:'טלפון',   emoji:'📱' },
  { id:'m71', word:'שעון',    emoji:'⏰' },
  { id:'m72', word:'מפתח',    emoji:'🔑' },
  { id:'m73', word:'כדורגל',  emoji:'⚽' },
  { id:'m74', word:'כדורסל',  emoji:'🏀' },
  { id:'m75', word:'גיטרה',   emoji:'🎸' },
  { id:'m76', word:'כובע',    emoji:'🎩' },
  { id:'m77', word:'מראה',    emoji:'🪞' },
  { id:'m78', word:'מטרייה',  emoji:'☂️' },
  { id:'m79', word:'בלון',    emoji:'🎈' },
  { id:'m80', word:'מתנה',    emoji:'🎁' },
  // People & Misc (81-100)
  { id:'m81', word:'ילד',     emoji:'👦' },
  { id:'m82', word:'ילדה',    emoji:'👧' },
  { id:'m83', word:'אמא',     emoji:'👩' },
  { id:'m84', word:'אבא',     emoji:'👨' },
  { id:'m85', word:'תינוק',   emoji:'👶' },
  { id:'m86', word:'סבא',     emoji:'👴' },
  { id:'m87', word:'סבתא',    emoji:'👵' },
  { id:'m88', word:'לב',      emoji:'❤️' },
  { id:'m89', word:'עיניים',  emoji:'👀' },
  { id:'m90', word:'יד',      emoji:'✋' },
  { id:'m91', word:'חולצה',   emoji:'👕' },
  { id:'m92', word:'נעל',     emoji:'👟' },
  { id:'m93', word:'שמלה',    emoji:'👗' },
  { id:'m94', word:'שיר',     emoji:'🎵' },
  { id:'m95', word:'ריקוד',   emoji:'💃' },
  { id:'m96', word:'שינה',    emoji:'😴' },
  { id:'m97', word:'נר',      emoji:'🕯️' },
  { id:'m98', word:'מנורה',   emoji:'💡' },
  { id:'m99', word:'כסא',     emoji:'🪑' },
  { id:'m100',word:'דלת',     emoji:'🚪' },
];

const MATCH_LEVELS = {
  1: { size: 4, label: 'מתחיל',  sublabel: '4 זוגות',  emoji: '🌱', color: '#10b981', cols: 4 },
  2: { size: 6, label: 'מתקדם',  sublabel: '6 זוגות',  emoji: '🌟', color: '#f59e0b', cols: 4 },
  3: { size: 8, label: 'מומחה',  sublabel: '8 זוגות',  emoji: '🏆', color: '#ef4444', cols: 4 },
};

function MatchingGame({ onXP }) {
  const [level, setLevel] = useState(null);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matches, setMatches] = useState(0);
  const [shake, setShake] = useState(null);
  const [done, setDone] = useState(false);

  const startLevel = (lvl) => {
    const { size } = MATCH_LEVELS[lvl];
    const pool = shuffle(MATCHING_PAIRS).slice(0, size);
    const pairs = pool.flatMap(p => [
      { id: p.id + '-w', type: 'word',    value: p.word,  pairId: p.id },
      { id: p.id + '-p', type: 'picture', value: p.emoji, pairId: p.id },
    ]);
    setCards(shuffle(pairs).map((c, i) => ({ ...c, pos: i, matched: false, selected: false })));
    setLevel(lvl);
    setMatches(0);
    setSelected([]);
    setDone(false);
  };

  const SIZE = level ? MATCH_LEVELS[level].size : 0;

  const select = (pos) => {
    const card = cards[pos];
    if (card.matched || selected.length === 2) return;
    if (selected.length === 1 && selected[0].pos === pos) return;

    const newSel = [...selected, { pos, pairId: card.pairId }];
    setCards(prev => prev.map(c => c.pos === pos ? { ...c, selected: true } : c));
    setSelected(newSel);

    if (newSel.length === 2) {
      if (newSel[0].pairId === newSel[1].pairId) {
        const matched = MATCHING_PAIRS.find(p => p.id === newSel[0].pairId);
        if (matched) speakHebrew(matched.word);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === newSel[0].pairId ? { ...c, matched: true, selected: false } : c
          ));
          setSelected([]);
          const nm = matches + 1;
          setMatches(nm);
          onXP(15);
          if (nm === SIZE) setDone(true);
        }, 400);
      } else {
        setShake(newSel[1].pos);
        setTimeout(() => {
          setCards(prev => prev.map(c => ({ ...c, selected: false })));
          setSelected([]);
          setShake(null);
        }, 600);
      }
    }
  };

  // Level picker
  if (!level) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ color: '#f0e6ff', fontSize: 24, fontWeight: 900, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
          ?בחר רמה
        </div>
        {[1, 2, 3].map(lvl => {
          const L = MATCH_LEVELS[lvl];
          return (
            <button key={lvl} onClick={() => startLevel(lvl)} style={{
              width: 280, padding: '18px 24px', borderRadius: 20,
              background: `linear-gradient(135deg,${L.color}22,${L.color}11)`,
              border: `2px solid ${L.color}66`,
              color: '#f0e6ff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: `0 8px 24px ${L.color}22`,
            }}>
              <span style={{ fontSize: 40 }}>{L.emoji}</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, fontWeight: 900, direction: 'rtl', color: '#f0e6ff' }}>{L.label}</div>
                <div style={{ fontSize: 14, direction: 'rtl', color: L.color, marginTop: 2 }}>{L.sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Card size: big enough to read comfortably on iPad
  const cardSize = level === 3 ? 118 : 140;
  const wordFontSize = level === 3 ? 20 : 24;
  const emojiFontSize = level === 3 ? 56 : 66;
  const cols = MATCH_LEVELS[level].cols;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ color: "#60a5fa", fontSize: 14, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
        {matches}/{SIZE} זוגות · !מצא את הזוגות
      </div>
      {done && (
        <div style={{ background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)", borderRadius: 16, padding: "14px 32px", color: "white", fontWeight: 900, fontSize: 20, textAlign: "center", fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
          !🎉 כל הזוגות נמצאו
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => select(card.pos)}
            style={{
              width: cardSize, height: cardSize, borderRadius: 20,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: card.matched ? "default" : "pointer",
              background: card.matched
                ? "linear-gradient(135deg,#065f46,#047857)"
                : card.selected
                  ? "linear-gradient(135deg,#1d4ed8,#0ea5e9)"
                  : "rgba(255,255,255,0.07)",
              border: card.matched ? "2px solid #34d399" : card.selected ? "2px solid #93c5fd" : "2px solid rgba(255,255,255,0.12)",
              transition: "all 0.3s",
              animation: shake === card.pos ? "shake 0.5s" : "none",
              opacity: card.matched ? 0.7 : 1,
              boxShadow: card.selected ? "0 0 24px rgba(240,171,252,0.6)" : "none",
              position: 'relative',
            }}
          >
            {card.type === "word" ? (
              <>
                <div style={{ fontSize: wordFontSize, lineHeight: 1.2, fontFamily: "'Noto Serif Hebrew', serif", fontWeight: 700, color: card.matched ? "#6ee7b7" : "#f0e6ff", direction: 'rtl', textAlign: 'center', padding: '0 8px' }}>{card.value}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); speakWordLetters(card.value); }}
                  title="אייֵת"
                  style={{
                    position: 'absolute', bottom: 6, right: 6,
                    background: 'rgba(96,165,250,0.25)', border: '1px solid rgba(96,165,250,0.4)',
                    borderRadius: 50, width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 13, color: '#60a5fa', padding: 0,
                  }}
                >🔤</button>
              </>
            ) : (
              <div style={{ fontSize: emojiFontSize }}>{card.value}</div>
            )}
          </div>
        ))}
      </div>
      {done && (
        <button onClick={() => setLevel(null)} style={{
          marginTop: 8, padding: '12px 32px', borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
          fontSize: 16, fontWeight: 900, cursor: 'pointer',
          fontFamily: "'Noto Serif Hebrew', serif",
        }}>🎮 שחק שוב</button>
      )}
    </div>
  );
}

// ── QUIZ MODE ─────────────────────────────────────────────────
const QUIZ_LEVELS = {
  1: { codex: null,        label: 'מתחיל',  sublabel: '3 אותיות', emoji: '🌱', color: '#10b981' },
  2: { codex: 'codex4',   label: 'מתקדם',  sublabel: '4 אותיות', emoji: '🌟', color: '#f59e0b' },
  3: { codex: 'codex5',   label: 'מומחה',  sublabel: '5 אותיות', emoji: '🏆', color: '#ef4444' },
};

function Quiz({ onXP }) {
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);

  const buildQuestions = (codex) =>
    shuffle(codex).slice(0, 8).map(word => {
      const wrongs = shuffle(codex.filter(w => w.word !== word.word)).slice(0, 3);
      return { word, options: shuffle([word, ...wrongs]) };
    });

  const startLevel = (lvl) => {
    const codex = lvl === 1 ? WORD_CODEX : lvl === 2 ? WORD_CODEX_4 : WORD_CODEX_5;
    setQuestions(buildQuestions(codex));
    setLevel(lvl);
    setQIdx(0);
    setScore(0);
    setChosen(null);
    setDone(false);
  };

  const [learning, setLearning] = useState(false); // show learning panel

  const answer = (opt) => {
    if (chosen || learning) return;
    const Q = questions[qIdx];
    setChosen(opt.word);
    const correct = opt.word === Q.word.word;
    if (correct) {
      setScore(s => s + 1);
      onXP(20);
      speakHebrew(opt.word);
      setTimeout(() => {
        if (qIdx + 1 >= questions.length) setDone(true);
        else { setQIdx(i => i + 1); setChosen(null); }
      }, 1000);
    } else {
      // Show learning panel — don't auto-advance
      setLearning(true);
      speakHebrew(Q.word.word); // say the correct word
    }
  };

  const dismissLearning = () => {
    setLearning(false);
    setChosen(null);
    if (qIdx + 1 >= questions.length) setDone(true);
    else setQIdx(i => i + 1);
  };

  // Keyboard: 1-4 selects answer; Enter dismisses learning panel
  useEffect(() => {
    if (!level || done) return;
    const Q = questions[qIdx];
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'Enter' && learning) { dismissLearning(); return; }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 4 && Q?.options[n - 1]) answer(Q.options[n - 1]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [level, done, qIdx, chosen, learning]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Level selection ──
  if (!level) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ color: '#f0e6ff', fontSize: 24, fontWeight: 900, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
          ?בחר רמה
        </div>
        {[1, 2, 3].map(lvl => {
          const L = QUIZ_LEVELS[lvl];
          return (
            <button key={lvl} onClick={() => startLevel(lvl)} style={{
              width: 280, padding: '18px 24px', borderRadius: 20,
              background: `linear-gradient(135deg,${L.color}22,${L.color}11)`,
              border: `2px solid ${L.color}66`,
              color: '#f0e6ff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: `0 8px 24px ${L.color}22`,
            }}>
              <span style={{ fontSize: 40 }}>{L.emoji}</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, fontWeight: 900, direction: 'rtl', color: '#f0e6ff' }}>{L.label}</div>
                <div style={{ fontSize: 14, direction: 'rtl', color: L.color, marginTop: 2 }}>{L.sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // ── Done screen ──
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const L = QUIZ_LEVELS[level];
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 60 }}>{pct >= 90 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#f0e6ff', fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
          !הסתיים החידון
        </div>
        <div style={{ fontSize: 20, color: L.color, fontFamily: "'Noto Serif Hebrew', serif" }}>
          {score} / {questions.length}
        </div>
        <Stars count={stars} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          {level < 3 && (
            <button onClick={() => startLevel(level + 1)} style={{
              padding: '13px 22px', borderRadius: 50, border: 'none',
              background: `linear-gradient(135deg,${QUIZ_LEVELS[level+1].color},${QUIZ_LEVELS[level+1].color}bb)`,
              color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer',
              fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl',
            }}>
              {level === 1 ? '⬆️ נסה מתקדם' : '⬆️ נסה מומחה'}
            </button>
          )}
          <button onClick={() => startLevel(level)} style={{
            padding: '13px 22px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
            fontWeight: 900, fontSize: 15, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>שחק שוב</button>
          <button onClick={() => setLevel(null)} style={{
            padding: '13px 22px', borderRadius: 50,
            border: '2px solid rgba(96,165,250,0.4)', background: 'transparent',
            color: '#60a5fa', fontWeight: 900, fontSize: 15, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>החלף רמה</button>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  const Q = questions[qIdx];
  const L = QUIZ_LEVELS[level];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ color: L.color, fontSize: 13, fontWeight: 700, direction: 'rtl', fontFamily: "'Noto Serif Hebrew', serif" }}>
        {L.label} · {qIdx + 1}/{questions.length} · {score} נק'
      </div>

      {/* Word card */}
      <div style={{
        width: 220, borderRadius: 28,
        background: 'linear-gradient(135deg,#0d2160,#4c1d95)',
        border: `3px solid ${L.color}55`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '24px 16px', gap: 8,
        boxShadow: '0 20px 50px rgba(29,78,216,0.4)',
      }}>
        <div style={{ fontSize: 80 }}>{Q.word.emoji}</div>
        <div style={{ color: '#60a5fa', fontSize: 15, fontWeight: 700 }}>{Q.word.meaning}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ color: '#e9d5ff', fontSize: 15, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>?מה המילה בעברית</div>
        <SpeakButton onClick={() => speakHebrew(Q.word.word)} />
        {/* Spell-it button: says word then each letter name */}
        <button onClick={() => speakSpelled(Q.word)} title="איות" style={{
          background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)',
          borderRadius: 50, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 14, color: '#60a5fa',
          fontFamily: "'Noto Serif Hebrew', serif", fontWeight: 900,
        }}>אבג</button>
      </div>

      {/* Answer options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: 320 }}>
        {Q.options.map(opt => {
          const isCorrect = opt.word === Q.word.word;
          const isChosen = chosen === opt.word;
          let bg = 'rgba(255,255,255,0.08)';
          if (chosen) {
            if (isCorrect) bg = 'linear-gradient(135deg,#065f46,#047857)';
            else if (isChosen) bg = 'linear-gradient(135deg,#7f1d1d,#dc2626)';
          }
          return (
            <button key={opt.word} onClick={() => answer(opt)} style={{
              padding: '14px 10px', borderRadius: 16,
              border: chosen
                ? isCorrect ? '2px solid #34d399' : isChosen ? '2px solid #f87171' : '2px solid transparent'
                : '2px solid rgba(255,255,255,0.12)',
              background: bg, color: '#f0e6ff', fontWeight: 700,
              cursor: (chosen || learning) ? 'default' : 'pointer', transition: 'all 0.3s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 24, direction: 'rtl' }}>{opt.word}</span>
            </button>
          );
        })}
      </div>

      {/* Learning panel — shown after wrong answer */}
      {learning && (
        <div style={{
          width: 320, borderRadius: 20, padding: '20px 18px',
          background: 'linear-gradient(135deg,#1e3a5f,#0d2160)',
          border: '2px solid #3b82f6aa',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'float 0s', // just trigger reflow
        }}>
          <div style={{ fontSize: 48 }}>{Q.word.emoji}</div>
          <div style={{ color: '#93c5fd', fontSize: 14, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
            המילה הנכונה היא:
          </div>
          <div style={{ color: '#f0e6ff', fontSize: 30, fontWeight: 900, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
            {Q.word.word}
          </div>
          <div style={{ color: '#60a5fa', fontSize: 14 }}>{Q.word.meaning}</div>
          <div style={{ color: '#60a5fa', fontSize: 13, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl', textAlign: 'center' }}>
            💡 קרא את המילה בקול ונסה לזכור אותה!
          </div>
          <button onClick={dismissLearning} style={{
            marginTop: 4, padding: '12px 32px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#3b82f6,#3b82f6)', color: 'white',
            fontWeight: 900, fontSize: 16, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>הבנתי! ←</button>
        </div>
      )}
    </div>
  );
}

// ── SENTENCE COMPLETION GAME ──────────────────────────────────
const FILL_SENTENCES = [
  { text: 'אני אוהב לאכול ___', answer: 'תפוח',   options: ['תפוח','כסא','ספר','ירח'],      emoji: '🍎' },
  { text: 'הילד שותה ___',        answer: 'חלב',    options: ['חלב','אבן','עץ','ירח'],         emoji: '🥛' },
  { text: 'ב___ גרים בני אדם',   answer: 'בית',    options: ['בית','ים','שמש','עיפרון'],      emoji: '🏠' },
  { text: 'ה___ עף בשמיים',       answer: 'ציפור',  options: ['ציפור','כלב','דג','אבן'],       emoji: '🐦' },
  { text: 'ה___ שוחה בים',        answer: 'דג',     options: ['דג','סוס','גמל','ארנב'],        emoji: '🐟' },
  { text: 'ה___ נובח על גנבים',  answer: 'כלב',    options: ['כלב','חתול','פרפר','ספר'],      emoji: '🐶' },
  { text: 'אנחנו ישנים ב___',    answer: 'מיטה',   options: ['מיטה','רכב','ים','עט'],         emoji: '🛏️' },
  { text: 'ה___ זורחת ביום',      answer: 'שמש',    options: ['שמש','ירח','כוכב','לחם'],       emoji: '☀️' },
  { text: 'ה___ זורח בלילה',      answer: 'ירח',    options: ['ירח','שמש','ים','כיסא'],        emoji: '🌙' },
  { text: 'ה___ יש חדק ארוך',     answer: 'פיל',    options: ['פיל','כלב','ציפור','ארנב'],     emoji: '🐘' },
  { text: 'אוכלים ___ עם חמאה',  answer: 'לחם',    options: ['לחם','כיסא','ירח','דלת'],       emoji: '🍞' },
  { text: 'ה___ עושה מיאו',       answer: 'חתול',   options: ['חתול','כלב','פיל','נחש'],       emoji: '🐱' },
  { text: 'ה___ נוסע על פסים',   answer: 'רכבת',   options: ['רכבת','מטוס','ספינה','סוס'],    emoji: '🚂' },
  { text: 'ה___ עף גבוה מאוד',   answer: 'מטוס',   options: ['מטוס','רכבת','מכונית','אופניים'], emoji: '✈️' },
  { text: 'ה___ שייטת בים',       answer: 'ספינה',  options: ['ספינה','מכונית','אופניים','רכבת'], emoji: '🚢' },
  { text: 'ה___ חי ביער ואוהב דבש', answer: 'דוב', options: ['דוב','ארנב','כלב','חתול'],      emoji: '🐻' },
  { text: 'קוראים ___ לפני השינה', answer: 'ספר',  options: ['ספר','מכונית','בלון','כדור'],   emoji: '📚' },
  { text: 'ה___ ארוך ועם שיניים', answer: 'נחש',   options: ['נחש','חתול','ציפור','ארנב'],    emoji: '🐍' },
  { text: 'ה___ קופץ על עצים',   answer: 'קוף',    options: ['קוף','כלב','פיל','דג'],         emoji: '🐒' },
  { text: 'ה___ צהוב וטעים',      answer: 'בננה',   options: ['בננה','ירח','שמש','עיפרון'],    emoji: '🍌' },
  { text: 'הילד מצייר ב___',      answer: 'עיפרון', options: ['עיפרון','כדור','כלב','ירח'],    emoji: '✏️' },
  { text: 'בגן החיות יש ___',     answer: 'אריה',   options: ['אריה','לחם','מיטה','ספר'],      emoji: '🦁' },
  { text: 'ה___ יש שש רגליים',   answer: 'חרק',    options: ['חרק','סוס','כלב','ציפור'],      emoji: '🐛' },
  { text: 'השמים כחולים וה___ לבן', answer: 'ענן', options: ['ענן','שמש','ים','עץ'],          emoji: '☁️' },
  { text: 'בחורף יורד ___',       answer: 'שלג',    options: ['שלג','פרח','כדור','ספר'],       emoji: '❄️' },
  { text: 'ה___ יפה ועם צבעים',  answer: 'פרח',    options: ['פרח','אבן','דלת','כסא'],        emoji: '🌸' },
  { text: 'שותים ___ כשחם',      answer: 'מים',    options: ['מים','אש','עפר','אבן'],         emoji: '💧' },
  { text: 'ה___ נוהגת על הכביש', answer: 'מכונית', options: ['מכונית','ספינה','רכבת','מטוס'], emoji: '🚗' },
  { text: 'בים חי ___',           answer: 'כריש',   options: ['כריש','ארנב','גמל','ציפור'],    emoji: '🦈' },
  { text: 'ה___ קר ונמס בשמש',   answer: 'גלידה',  options: ['גלידה','לחם','תפוח','ביצה'],    emoji: '🍦' },
];

function SentenceGame({ onXP }) {
  const [questions] = useState(() => shuffle(FILL_SENTENCES).slice(0, 10));
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [learning, setLearning] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const Q = questions[qIdx];

  // Shuffle options for the current question
  useEffect(() => {
    if (Q) setShuffledOptions(shuffle(Q.options));
  }, [qIdx]);

  // Speak the full sentence (with the blank filled) when the question changes
  useEffect(() => {
    const full = Q.text.replace('___', Q.answer);
    const t = setTimeout(() => speakHebrew(full), 400);
    return () => clearTimeout(t);
  }, [qIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (opt) => {
    if (chosen || learning) return;
    setChosen(opt);
    const correct = opt === Q.answer;
    if (correct) {
      setScore(s => s + 1);
      onXP(20);
      speakHebrew(Q.answer);
      setTimeout(() => {
        if (qIdx + 1 >= questions.length) setDone(true);
        else { setQIdx(i => i + 1); setChosen(null); }
      }, 1000);
    } else {
      setLearning(true);
      speakHebrew(Q.answer);
    }
  };

  const dismissLearning = () => {
    setLearning(false); setChosen(null);
    if (qIdx + 1 >= questions.length) setDone(true);
    else setQIdx(i => i + 1);
  };

  // Keyboard: 1-4 selects answer; Enter dismisses learning panel
  useEffect(() => {
    if (done) return;
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'Enter' && learning) { dismissLearning(); return; }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 4 && shuffledOptions[n - 1]) answer(shuffledOptions[n - 1]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, qIdx, chosen, learning, shuffledOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 60 }}>{pct >= 90 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#f0e6ff', fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>!הסתיים המשחק</div>
        <div style={{ fontSize: 20, color: '#60a5fa', fontFamily: "'Noto Serif Hebrew', serif" }}>{score} / {questions.length}</div>
        <Stars count={stars} />
        <button onClick={() => { setQIdx(0); setChosen(null); setScore(0); setDone(false); setLearning(false); }} style={{
          marginTop: 8, padding: '14px 36px', borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
          fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: "'Noto Serif Hebrew', serif",
        }}>שחק שוב</button>
      </div>
    );
  }

  // Render sentence with blank highlighted
  const parts = Q.text.split('___');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ color: '#60a5fa', fontSize: 13, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
        {qIdx + 1}/{questions.length} · {score} נק'
      </div>

      {/* Sentence card */}
      <div style={{
        width: '100%', maxWidth: 420, borderRadius: 24,
        background: 'linear-gradient(135deg,#0d2160,#1a3a8f)',
        border: '2px solid rgba(96,165,250,0.35)',
        padding: '24px 20px', textAlign: 'center',
        boxShadow: '0 16px 48px rgba(29,78,216,0.4)',
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{Q.emoji}</div>
        <div style={{
          fontFamily: "'Noto Serif Hebrew', serif", fontSize: 24, color: '#f0e6ff',
          direction: 'rtl', textAlign: 'right', lineHeight: 1.8,
          width: '100%',
        }}>
          {/* RTL: parts[0] is the beginning (right side), parts[1] is the end (left side) */}
          <span>{parts[0]}</span>
          <span style={{
            display: 'inline-block', minWidth: 80, borderBottom: '3px solid #60a5fa',
            color: chosen ? (chosen === Q.answer ? '#34d399' : '#f87171') : '#60a5fa',
            fontWeight: 900, textAlign: 'center', margin: '0 6px',
          }}>{chosen || '___'}</span>
          <span>{parts[1]}</span>
        </div>
      </div>

      {/* Word options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 360 }}>
        {shuffledOptions.map(opt => {
          const isCorrect = opt === Q.answer;
          const isChosen = chosen === opt;
          let bg = 'rgba(255,255,255,0.08)';
          if (chosen) {
            if (isCorrect) bg = 'linear-gradient(135deg,#065f46,#047857)';
            else if (isChosen) bg = 'linear-gradient(135deg,#7f1d1d,#dc2626)';
          }
          return (
            <button key={opt} onClick={() => answer(opt)} style={{
              padding: '16px 12px', borderRadius: 16,
              border: chosen
                ? isCorrect ? '2px solid #34d399' : isChosen ? '2px solid #f87171' : '2px solid transparent'
                : '2px solid rgba(255,255,255,0.15)',
              background: bg, color: '#f0e6ff', fontWeight: 700,
              cursor: (chosen || learning) ? 'default' : 'pointer', transition: 'all 0.3s',
            }}>
              <span style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, direction: 'rtl' }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Learning panel */}
      {learning && (
        <div style={{
          width: '100%', maxWidth: 360, borderRadius: 20, padding: '20px 18px',
          background: 'linear-gradient(135deg,#1e3a5f,#0d2160)',
          border: '2px solid #3b82f6aa',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <div style={{ fontSize: 44 }}>{Q.emoji}</div>
          <div style={{ color: '#93c5fd', fontSize: 14, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>המילה הנכונה היא:</div>
          <div style={{ color: '#f0e6ff', fontSize: 28, fontWeight: 900, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>{Q.answer}</div>
          <div style={{ color: '#60a5fa', fontSize: 13, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl', textAlign: 'center' }}>
            💡 קרא את המשפט שוב עם המילה הנכונה!
          </div>
          <button onClick={dismissLearning} style={{
            padding: '11px 28px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#3b82f6,#3b82f6)', color: 'white',
            fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: "'Noto Serif Hebrew', serif",
          }}>הבנתי! ←</button>
        </div>
      )}
    </div>
  );
}

// ── KID AVATARS ──────────────────────────────────────────────
function AvatarNoah({ size = 100, uid = 'n' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`bgn${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0d2160" stopOpacity="0.9"/>
        </radialGradient>
        <clipPath id={`cpn${uid}`}><circle cx="50" cy="50" r="48"/></clipPath>
      </defs>
      {/* bg circle */}
      <circle cx="50" cy="50" r="48" fill={`url(#bgn${uid})`} stroke="rgba(147,197,253,0.6)" strokeWidth="2.5"/>
      {/* shirt */}
      <ellipse cx="50" cy="108" rx="40" ry="26" fill="#2563eb" clipPath={`url(#cpn${uid})`}/>
      <rect x="19" y="88" width="62" height="22" fill="#2563eb" clipPath={`url(#cpn${uid})`}/>
      {/* neck */}
      <rect x="43" y="79" width="14" height="13" rx="5" fill="#d4956a"/>
      {/* face */}
      <ellipse cx="50" cy="58" rx="24" ry="26" fill="#e8a870"/>
      {/* ears */}
      <ellipse cx="27" cy="58" rx="5" ry="7" fill="#d4956a"/>
      <ellipse cx="73" cy="58" rx="5" ry="7" fill="#d4956a"/>
      {/* brown hair — short, slightly messy boy */}
      <ellipse cx="50" cy="34" rx="26" ry="17" fill="#5c3317"/>
      <ellipse cx="50" cy="30" rx="24" ry="13" fill="#6b3d1e"/>
      <ellipse cx="34" cy="33" rx="9" ry="12" fill="#5c3317"/>
      <ellipse cx="66" cy="33" rx="9" ry="12" fill="#5c3317"/>
      <path d="M27 46 Q30 35 50 31 Q70 35 73 46" fill="#5c3317"/>
      {/* hair tufts */}
      <ellipse cx="42" cy="27" rx="6" ry="5" fill="#7a4520"/>
      <ellipse cx="58" cy="27" rx="6" ry="5" fill="#7a4520"/>
      {/* eyebrows thick brown */}
      <path d="M35 50 Q41 46 47 50" stroke="#5c3317" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M53 50 Q59 46 65 50" stroke="#5c3317" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* eyes white */}
      <ellipse cx="41" cy="58" rx="6.5" ry="6.5" fill="white"/>
      <ellipse cx="59" cy="58" rx="6.5" ry="6.5" fill="white"/>
      {/* brown irises */}
      <circle cx="41.5" cy="58.5" r="4.2" fill="#4a2c0a"/>
      <circle cx="59.5" cy="58.5" r="4.2" fill="#4a2c0a"/>
      {/* pupils */}
      <circle cx="41.5" cy="58.5" r="2.2" fill="#1a0a00"/>
      <circle cx="59.5" cy="58.5" r="2.2" fill="#1a0a00"/>
      {/* highlights */}
      <circle cx="43" cy="57" r="1.4" fill="white"/>
      <circle cx="61" cy="57" r="1.4" fill="white"/>
      {/* nose */}
      <ellipse cx="46.5" cy="67" rx="1.8" ry="1.3" fill="#c07040" opacity="0.7"/>
      <ellipse cx="53.5" cy="67" rx="1.8" ry="1.3" fill="#c07040" opacity="0.7"/>
      {/* smile — confident grin */}
      <path d="M40 74 Q50 82 60 74" stroke="#b06030" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M42 75 Q50 80 58 75 Q58 75 42 75Z" fill="white"/>
    </svg>
  );
}

function AvatarAlma({ size = 100, uid = 'a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`bga${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0d2160" stopOpacity="0.9"/>
        </radialGradient>
        <clipPath id={`cpa${uid}`}><circle cx="50" cy="50" r="48"/></clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#bga${uid})`} stroke="rgba(249,168,212,0.6)" strokeWidth="2.5"/>
      {/* long hair behind — left + right curtains */}
      <path d="M20 46 Q14 60 16 80 Q18 94 22 99" stroke="#5c3317" strokeWidth="14" fill="none" strokeLinecap="round" clipPath={`url(#cpa${uid})`}/>
      <path d="M80 46 Q86 60 84 80 Q82 94 78 99" stroke="#5c3317" strokeWidth="14" fill="none" strokeLinecap="round" clipPath={`url(#cpa${uid})`}/>
      {/* shirt */}
      <ellipse cx="50" cy="108" rx="40" ry="24" fill="#ec4899" clipPath={`url(#cpa${uid})`}/>
      <rect x="20" y="88" width="60" height="22" fill="#ec4899" clipPath={`url(#cpa${uid})`}/>
      {/* neck */}
      <rect x="43" y="79" width="14" height="12" rx="5" fill="#e0a070"/>
      {/* face — round younger */}
      <ellipse cx="50" cy="58" rx="23" ry="25" fill="#f0b080"/>
      {/* ears */}
      <ellipse cx="28" cy="57" rx="5" ry="7" fill="#e0a070"/>
      <ellipse cx="72" cy="57" rx="5" ry="7" fill="#e0a070"/>
      {/* top hair */}
      <ellipse cx="50" cy="35" rx="25" ry="18" fill="#5c3317"/>
      <ellipse cx="50" cy="31" rx="23" ry="13" fill="#6b3d1e"/>
      {/* center parting */}
      <line x1="50" y1="20" x2="50" y2="38" stroke="#4a2810" strokeWidth="2"/>
      {/* hair covering forehead */}
      <path d="M26 46 Q28 34 50 30 Q72 34 74 46" fill="#5c3317"/>
      {/* pink hair clip */}
      <ellipse cx="30" cy="43" rx="6" ry="4" fill="#f472b6"/>
      <ellipse cx="30" cy="43" rx="4" ry="2.5" fill="#fbb6d4"/>
      <circle cx="30" cy="43" r="2" fill="#0ea5e9"/>
      {/* eyebrows — arched, feminine */}
      <path d="M35 50 Q41 45 47 49" stroke="#5c3317" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M53 49 Q59 45 65 50" stroke="#5c3317" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {/* eyes with lashes */}
      <ellipse cx="41" cy="57" rx="6.5" ry="6.5" fill="white"/>
      <ellipse cx="59" cy="57" rx="6.5" ry="6.5" fill="white"/>
      <circle cx="41.5" cy="57.5" r="4.2" fill="#4a2c0a"/>
      <circle cx="59.5" cy="57.5" r="4.2" fill="#4a2c0a"/>
      <circle cx="41.5" cy="57.5" r="2.2" fill="#1a0a00"/>
      <circle cx="59.5" cy="57.5" r="2.2" fill="#1a0a00"/>
      <circle cx="43" cy="56" r="1.4" fill="white"/>
      <circle cx="61" cy="56" r="1.4" fill="white"/>
      {/* upper lashes */}
      <path d="M35.5 52 L34.5 49.5 M38 51 L37.5 48.5 M41 50.5 L41 47.5 M44 51 L44.5 48.5 M46.5 52 L47.5 49.5" stroke="#3d1f08" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M53.5 52 L52.5 49.5 M56 51 L55.5 48.5 M59 50.5 L59 47.5 M62 51 L62.5 48.5 M64.5 52 L65.5 49.5" stroke="#3d1f08" strokeWidth="1.2" strokeLinecap="round"/>
      {/* nose — small */}
      <path d="M48.5 65 Q50 67.5 51.5 65" stroke="#c07040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* big happy smile */}
      <path d="M37 72 Q50 84 63 72" stroke="#b06030" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M40 73.5 Q50 82 60 73.5 Q60 73.5 40 73.5Z" fill="white"/>
      {/* cheek blush */}
      <ellipse cx="32" cy="65" rx="7" ry="4.5" fill="#ffb3ba" opacity="0.55"/>
      <ellipse cx="68" cy="65" rx="7" ry="4.5" fill="#ffb3ba" opacity="0.55"/>
    </svg>
  );
}

function AvatarMax({ size = 100, uid = 'm' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`bgm${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0d2160" stopOpacity="0.9"/>
        </radialGradient>
        <clipPath id={`cpm${uid}`}><circle cx="50" cy="50" r="48"/></clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#bgm${uid})`} stroke="rgba(110,231,183,0.6)" strokeWidth="2.5"/>
      {/* shirt */}
      <ellipse cx="50" cy="108" rx="40" ry="26" fill="#059669" clipPath={`url(#cpm${uid})`}/>
      <rect x="19" y="88" width="62" height="22" fill="#059669" clipPath={`url(#cpm${uid})`}/>
      {/* neck */}
      <rect x="43" y="78" width="14" height="14" rx="5" fill="#d4a060"/>
      {/* face — chubby/round, younger */}
      <ellipse cx="50" cy="59" rx="27" ry="28" fill="#e8b070"/>
      {/* ears */}
      <ellipse cx="24" cy="59" rx="6" ry="8" fill="#d4a060"/>
      <ellipse cx="76" cy="59" rx="6" ry="8" fill="#d4a060"/>
      {/* sandy/light-brown fluffy hair */}
      <ellipse cx="50" cy="32" rx="29" ry="19" fill="#b07840"/>
      <ellipse cx="34" cy="30" rx="12" ry="13" fill="#c08848"/>
      <ellipse cx="50" cy="26" rx="14" ry="13" fill="#c08848"/>
      <ellipse cx="66" cy="30" rx="12" ry="13" fill="#c08848"/>
      <ellipse cx="27" cy="41" rx="8" ry="11" fill="#b07840"/>
      <ellipse cx="73" cy="41" rx="8" ry="11" fill="#b07840"/>
      {/* re-draw face/ears on top of hair */}
      <ellipse cx="50" cy="59" rx="27" ry="28" fill="#e8b070"/>
      <ellipse cx="24" cy="59" rx="6" ry="8" fill="#d4a060"/>
      <ellipse cx="76" cy="59" rx="6" ry="8" fill="#d4a060"/>
      {/* eyebrows raised/fun */}
      <path d="M33 50 Q40 44 47 49" stroke="#8b5e3c" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M53 49 Q60 44 67 50" stroke="#8b5e3c" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      {/* eyes — wide expressive */}
      <ellipse cx="40" cy="59" rx="7.5" ry="7.5" fill="white"/>
      <ellipse cx="60" cy="59" rx="7.5" ry="7.5" fill="white"/>
      <circle cx="40.5" cy="59.5" r="5" fill="#4a2c0a"/>
      <circle cx="60.5" cy="59.5" r="5" fill="#4a2c0a"/>
      <circle cx="40.5" cy="59.5" r="2.5" fill="#1a0a00"/>
      <circle cx="60.5" cy="59.5" r="2.5" fill="#1a0a00"/>
      <circle cx="42" cy="58" r="1.8" fill="white"/>
      <circle cx="62" cy="58" r="1.8" fill="white"/>
      {/* nose */}
      <ellipse cx="46.5" cy="68" rx="2" ry="1.5" fill="#c07040" opacity="0.7"/>
      <ellipse cx="53.5" cy="68" rx="2" ry="1.5" fill="#c07040" opacity="0.7"/>
      {/* big toothy grin */}
      <path d="M36 76 Q50 89 64 76" fill="white" stroke="#b06030" strokeWidth="2.5"/>
      <line x1="44" y1="77" x2="44" y2="83" stroke="#d4a060" strokeWidth="1.2"/>
      <line x1="50" y1="77" x2="50" y2="84" stroke="#d4a060" strokeWidth="1.2"/>
      <line x1="56" y1="77" x2="56" y2="83" stroke="#d4a060" strokeWidth="1.2"/>
      {/* freckles */}
      <circle cx="36" cy="67" r="1.8" fill="#c07040" opacity="0.45"/>
      <circle cx="40" cy="70" r="1.2" fill="#c07040" opacity="0.45"/>
      <circle cx="33" cy="70" r="1.2" fill="#c07040" opacity="0.45"/>
      <circle cx="64" cy="67" r="1.8" fill="#c07040" opacity="0.45"/>
      <circle cx="60" cy="70" r="1.2" fill="#c07040" opacity="0.45"/>
      <circle cx="67" cy="70" r="1.2" fill="#c07040" opacity="0.45"/>
    </svg>
  );
}

// ── PROFILES CONFIG ──────────────────────────────────────────
// Avatar lookup by key
const AVATAR_MAP = {
  noah: AvatarNoah,
  alma: AvatarAlma,
  max:  AvatarMax,
};
const AVATAR_OPTIONS = [
  { key: 'noah', color: '#3b82f6', glow: 'rgba(59,130,246,0.5)',  label: 'נח' },
  { key: 'alma', color: '#ec4899', glow: 'rgba(236,72,153,0.5)',  label: 'עלמה' },
  { key: 'max',  color: '#10b981', glow: 'rgba(16,185,129,0.5)',  label: 'מקס' },
];
const DEFAULT_PLAYERS = [
  { id: 'נח',   avatar: 'noah', color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
  { id: 'עלמה', avatar: 'alma', color: '#ec4899', glow: 'rgba(236,72,153,0.5)'  },
  { id: 'מקס',  avatar: 'max',  color: '#10b981', glow: 'rgba(16,185,129,0.5)'  },
];
// Keep PROFILES as alias for backward compat (used in Drawing/Spelling etc.)
const PROFILES = DEFAULT_PLAYERS.map(p => ({ ...p, Avatar: AVATAR_MAP[p.avatar] }));

const loadPlayers = () => {
  try { const s = localStorage.getItem('hebrewApp_players'); if (s) return JSON.parse(s); } catch(e) {}
  return DEFAULT_PLAYERS;
};
const savePlayers = (players) => {
  try { localStorage.setItem('hebrewApp_players', JSON.stringify(players)); } catch(e) {}
};

const loadXPs = () => {
  try { const s = localStorage.getItem('hebrewApp_xps'); if (s) return JSON.parse(s); } catch(e) {}
  return { נח: 0, עלמה: 0, מקס: 0 };
};
const saveXPs = (xps) => {
  try { localStorage.setItem('hebrewApp_xps', JSON.stringify(xps)); } catch(e) {}
};

// Per-player detailed progress
const DEFAULT_PROGRESS = () => ({
  totalXpEarned: 0,      // cumulative XP earned (never resets)
  gamesPlayed: { flashcards: 0, matching: 0, quiz: 0, spelling: 0, drawing: 0 },
  quizBest: { 1: 0, 2: 0, 3: 0 },  // best quiz score per level (out of 8)
  drawingBest: {},                   // { letterName: bestScore }
  matchingCompleted: 0,              // total matching rounds completed
  spellingCorrect: 0,                // total spelling words correct
  lastPlayed: null,
});

const loadProgress = (profileId) => {
  try {
    const s = localStorage.getItem(`hebrewApp_prog_${profileId}`);
    if (s) return { ...DEFAULT_PROGRESS(), ...JSON.parse(s) };
  } catch(e) {}
  return DEFAULT_PROGRESS();
};

const saveProgress = (profileId, prog) => {
  try { localStorage.setItem(`hebrewApp_prog_${profileId}`, JSON.stringify(prog)); } catch(e) {}
};

// ── PROFILE PICKER ───────────────────────────────────────────
function ProfilePicker({ players, xps, getProgress, onSelect, onAddPlayer, onDeletePlayer }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('noah');
  const [confirmDelete, setConfirmDelete] = useState(null); // player id to confirm

  // Keyboard: 1-9 selects player by position
  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9 && players[n - 1]) {
        onSelect(players[n - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [players, onSelect]);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name || players.find(p => p.id === name)) return;
    const av = AVATAR_OPTIONS.find(a => a.key === newAvatar);
    onAddPlayer({ id: name, avatar: newAvatar, color: av.color, glow: av.glow });
    setNewName(''); setAdding(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 20%, #0a2d6e 0%, #000f2b 60%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 32, padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 28, color: '#f0e6ff', fontWeight: 700, textShadow: '0 0 30px rgba(96,165,250,0.6)' }}>ברוכים הבאים! 👋</div>
        <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 18, color: '#60a5fa', marginTop: 8, direction: 'rtl' }}>בחרו שחקן להשחק</div>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {players.map(p => {
          const AvatarComp = AVATAR_MAP[p.avatar] ?? AvatarNoah;
          const xp = xps[p.id] ?? 0;
          const level = Math.floor(xp / 100) + 1;
          const progress = xp % 100;
          const prog = getProgress(p.id);
          const totalXp = prog.totalXpEarned ?? xp;
          const totalGames = Object.values(prog.gamesPlayed ?? {}).reduce((s, v) => s + v, 0);
          const isConfirming = confirmDelete === p.id;
          return (
            <div key={p.id} style={{ position: 'relative' }}>
              <button
                onClick={() => { if (!isConfirming) onSelect(p.id); }}
                style={{
                  width: 175, background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${p.color}55`, borderRadius: 28,
                  padding: '18px 14px 16px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
                  boxShadow: `0 8px 40px ${p.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  backdropFilter: 'blur(10px)', transition: 'all 0.2s', opacity: isConfirming ? 0.4 : 1,
                }}
                onMouseEnter={e => !isConfirming && (e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
              >
                <div style={{ width: 90, height: 90, borderRadius: '50%', border: `3px solid ${p.color}`, boxShadow: `0 0 20px ${p.glow}`, overflow: 'hidden', flexShrink: 0 }}>
                  <AvatarComp size={90} uid={`pick-${p.id}`}/>
                </div>
                <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 24, fontWeight: 700, color: '#f0e6ff', direction: 'rtl' }}>{p.id}</div>
                <div style={{ color: p.color, fontSize: 12, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>רמה {level} · {xp} נק'</div>
                <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg,${p.color},${p.color}cc)`, borderRadius: 99, transition: 'width 0.4s' }}/>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '2px 7px', textAlign: 'center' }}>
                    <div style={{ color: '#60a5fa', fontSize: 10, fontFamily: "'Noto Serif Hebrew', serif" }}>סה"כ נק'</div>
                    <div style={{ color: '#f0e6ff', fontSize: 12, fontWeight: 700 }}>{totalXp}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '2px 7px', textAlign: 'center' }}>
                    <div style={{ color: '#60a5fa', fontSize: 10, fontFamily: "'Noto Serif Hebrew', serif" }}>משחקים</div>
                    <div style={{ color: '#f0e6ff', fontSize: 12, fontWeight: 700 }}>{totalGames}</div>
                  </div>
                </div>
              </button>

              {/* Delete button */}
              {players.length > 1 && !isConfirming && (
                <button onClick={() => setConfirmDelete(p.id)} style={{
                  position: 'absolute', top: 8, left: 8, width: 24, height: 24,
                  borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.7)',
                  color: 'white', fontSize: 13, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>✕</button>
              )}

              {/* Confirm delete overlay */}
              {isConfirming && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 28,
                  background: 'rgba(15,10,40,0.92)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16,
                }}>
                  <div style={{ color: '#f0e6ff', fontFamily: "'Noto Serif Hebrew', serif", fontSize: 14, textAlign: 'center', direction: 'rtl' }}>?למחוק את {p.id}</div>
                  <button onClick={() => { onDeletePlayer(p.id); setConfirmDelete(null); }} style={{ padding: '8px 18px', borderRadius: 50, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Serif Hebrew', serif" }}>מחק</button>
                  <button onClick={() => setConfirmDelete(null)} style={{ padding: '6px 14px', borderRadius: 50, border: '1px solid rgba(96,165,250,0.4)', background: 'transparent', color: '#60a5fa', cursor: 'pointer', fontFamily: "'Noto Serif Hebrew', serif" }}>ביטול</button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add player card */}
        {!adding ? (
          <button onClick={() => setAdding(true)} style={{
            width: 175, minHeight: 200, background: 'rgba(255,255,255,0.03)',
            border: '2px dashed rgba(96,165,250,0.35)', borderRadius: 28,
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12, color: '#60a5fa',
          }}>
            <div style={{ fontSize: 42 }}>➕</div>
            <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 16, direction: 'rtl' }}>הוסף שחקן</div>
          </button>
        ) : (
          <div style={{
            width: 175, background: 'rgba(255,255,255,0.07)',
            border: '2px solid rgba(96,165,250,0.4)', borderRadius: 28,
            padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
          }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="שם השחקן"
              maxLength={10}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(96,165,250,0.4)',
                background: 'rgba(255,255,255,0.06)', color: '#f0e6ff', fontSize: 16,
                fontFamily: "'Noto Serif Hebrew', serif", textAlign: 'right', direction: 'rtl', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {AVATAR_OPTIONS.map(av => {
                const AV = AVATAR_MAP[av.key];
                return (
                  <div key={av.key} onClick={() => setNewAvatar(av.key)} style={{
                    width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer',
                    border: `3px solid ${newAvatar === av.key ? av.color : 'transparent'}`,
                    boxShadow: newAvatar === av.key ? `0 0 12px ${av.glow}` : 'none',
                  }}>
                    <AV size={44} uid={`new-${av.key}`}/>
                  </div>
                );
              })}
            </div>
            <button onClick={handleAdd} disabled={!newName.trim()} style={{
              width: '100%', padding: '9px', borderRadius: 12, border: 'none',
              background: newName.trim() ? 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' : 'rgba(255,255,255,0.1)',
              color: 'white', fontWeight: 700, cursor: newName.trim() ? 'pointer' : 'default',
              fontFamily: "'Noto Serif Hebrew', serif", fontSize: 15,
            }}>צור שחקן ✓</button>
            <button onClick={() => { setAdding(false); setNewName(''); }} style={{
              background: 'none', border: 'none', color: '#6d6b8a', cursor: 'pointer',
              fontFamily: "'Noto Serif Hebrew', serif", fontSize: 13,
            }}>ביטול</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SPELLING GAME ──────────────────────────────────────────────
function SpellingGame({ onXP, profile }) {
  const [queue, setQueue] = useState(() => shuffle(WORD_CODEX));
  const [qPos, setQPos] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [slotIdx, setSlotIdx] = useState(0);
  const [slots, setSlots] = useState([null, null, null]);
  const [slotStatus, setSlotStatus] = useState([null, null, null]); // 'correct'|'wrong'|null
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState('playing'); // 'playing'|'won'|'failed'
  const [lastScore, setLastScore] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const speakTRef = useRef(null);
  const hintTimerRef = useRef(null);
  // Stable ref to handleChoice so keyboard listener never goes stale
  const handleChoiceRef = useRef(null);

  const W = queue[qPos];

  // Reset state and speak word whenever the word changes (ref-guarded to avoid double-speech in StrictMode)
  useEffect(() => {
    setSlots([null, null, null]);
    setSlotStatus([null, null, null]);
    setSlotIdx(0);
    setMistakes(0);
    setPhase('playing');
    setLastScore(null);
    clearTimeout(speakTRef.current);
    speakTRef.current = setTimeout(() => speakHebrew(W.word), 400);
    return () => { clearTimeout(speakTRef.current); };
  }, [qPos, queue]);

  const handleChoice = (letter) => {
    if (phase !== 'playing') return;

    // Always speak the tapped letter's Hebrew name first
    const tappedEntry = ALEPH_BET.find(l => l.hebrew === letter);
    if (tappedEntry) speakLetter(tappedEntry);

    const correct = letter === W.letters[slotIdx];
    if (correct) {
      const ns = [...slots]; ns[slotIdx] = letter;
      const nst = [...slotStatus]; nst[slotIdx] = 'correct';
      setSlots(ns); setSlotStatus(nst);
      const nextIdx = slotIdx + 1;
      if (nextIdx >= 3) {
        // Word complete — queue "נכון" right after the letter name
        const score = mistakes === 0 ? 100 : mistakes === 1 ? 75 : 50;
        setLastScore(score); setPhase('won'); onXP(score);
        speakHebrew('נכון');
      } else {
        setSlotIdx(nextIdx);
      }
    } else {
      // Wrong letter — queue "עוד לא" + "בחר את האות [correct]"
      const nm = mistakes + 1; setMistakes(nm);
      const nh = hearts - 1; setHearts(nh);
      const ns = [...slots]; ns[slotIdx] = letter;
      const nst = [...slotStatus]; nst[slotIdx] = 'wrong';
      setSlots(ns); setSlotStatus(nst);

      const correctEntry = ALEPH_BET.find(l => l.hebrew === W.letters[slotIdx]);
      speakHebrew('עוד לא').then(() =>
        speakHebrew(`בחר את האות ${stripNikud(correctEntry?.nameHebrew || '')}`)
      );

      if (nh <= 0) { setPhase('failed'); onXP(0); return; }
      // Flash red then clear the slot
      const capturedIdx = slotIdx;
      setTimeout(() => {
        setSlots(s => { const n = [...s]; n[capturedIdx] = null; return n; });
        setSlotStatus(s => { const n = [...s]; n[capturedIdx] = null; return n; });
      }, 600);
    }
  };

  // Delayed hint: light up correct key 3 s after the target letter changes
  useEffect(() => {
    setHintVisible(false);
    clearTimeout(hintTimerRef.current);
    if (phase === 'playing') {
      hintTimerRef.current = setTimeout(() => setHintVisible(true), 3000);
    }
    return () => clearTimeout(hintTimerRef.current);
  }, [qPos, slotIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ref current so keyboard handler never captures stale closure
  handleChoiceRef.current = handleChoice;

  // Physical Hebrew keyboard input
  useEffect(() => {
    const onKey = (e) => {
      const heb = KEY_MAP[e.key] || KEY_MAP[e.key.toLowerCase()];
      if (heb) handleChoiceRef.current(heb);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextWord = () => {
    setHearts(3);
    const np = qPos + 1;
    if (np >= queue.length) { setQueue(shuffle(WORD_CODEX)); setQPos(0); }
    else { setQPos(np); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>

      {/* Hearts */}
      <div style={{ display:'flex', gap:10 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ fontSize:32, filter: i < hearts ? 'none' : 'grayscale(1) opacity(0.18)', transition:'filter 0.3s' }}>❤️</span>
        ))}
      </div>

      {/* Character + speech bubble */}
      <div style={{ display:'flex', alignItems:'center', gap:14, width:'100%' }}>
        <div style={{ width:76, height:76, borderRadius:'50%', overflow:'hidden', flexShrink:0,
          border:`3px solid ${profile.color}`, boxShadow:`0 0 18px ${profile.color}55` }}>
          <profile.Avatar size={76} uid="spell"/>
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.07)', borderRadius:20, padding:'12px 16px',
          border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:48 }}>{W.emoji}</span>
              <div style={{ color:'#60a5fa', fontSize:15, fontWeight:700 }}>{W.meaning}</div>
            </div>
            <SpeakButton onClick={() => speakHebrew(W.word)}/>
          </div>
        </div>
      </div>

      {/* RTL letter slots — slot 0 is rightmost (first Hebrew letter) */}
      <div style={{ display:'flex', gap:12, direction:'rtl' }}>
        {[0,1,2].map(i => {
          const st = slotStatus[i];
          const isActive = i === slotIdx && phase === 'playing';
          return (
            <div key={i} style={{
              width:66, height:74, borderRadius:18,
              background: st==='correct' ? 'rgba(16,185,129,0.25)'
                        : st==='wrong'   ? 'rgba(239,68,68,0.25)'
                        : isActive       ? 'rgba(29,78,216,0.25)'
                        :                  'rgba(255,255,255,0.05)',
              border:`3px solid ${st==='correct'?'#10b981':st==='wrong'?'#ef4444':isActive?'#1d4ed8':'rgba(255,255,255,0.12)'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Noto Serif Hebrew', serif", fontSize:38, color:'#f0e6ff',
              boxShadow: isActive      ? '0 0 22px rgba(29,78,216,0.55)'
                       : st==='correct'? '0 0 12px rgba(16,185,129,0.35)'
                       :                 'none',
              transition:'all 0.2s',
            }}>
              {slots[i] ?? ''}
            </div>
          );
        })}
      </div>

      {/* Full Hebrew QWERTY keyboard */}
      <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%', maxWidth:480, padding:'0 8px' }}>
        {HEB_KEYBOARD.map((row, ri) => (
          <div key={ri} style={{ display:'flex', gap:6, justifyContent:'center' }}>
            {row.map(letter => {
              const isCorrectLetter = phase === 'playing' && hintVisible && letter === W.letters[slotIdx];
              return (
                <button key={letter} onClick={() => handleChoice(letter)}
                  disabled={phase !== 'playing'}
                  style={{
                    width:48, height:52, borderRadius:10,
                    background: phase !== 'playing' ? 'rgba(255,255,255,0.04)'
                              : isCorrectLetter    ? 'rgba(29,78,216,0.38)'
                              :                      'rgba(29,78,216,0.14)',
                    border:`2px solid ${phase !== 'playing' ? 'rgba(255,255,255,0.08)' : isCorrectLetter ? 'rgba(96,165,250,0.9)' : 'rgba(96,165,250,0.35)'}`,
                    color: phase !== 'playing' ? 'rgba(255,255,255,0.3)' : '#f0e6ff',
                    fontFamily:"'Noto Serif Hebrew', serif", fontSize:24,
                    cursor: phase === 'playing' ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.3s',
                    animation: isCorrectLetter ? 'hint-glow 0.7s ease-out forwards' : 'none',
                  }}>{letter}</button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Result panel */}
      {(phase === 'won' || phase === 'failed') && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:54, animation:'float 3s ease-in-out infinite' }}>
            {phase === 'won'
              ? (lastScore === 100 ? '🌟' : lastScore === 75 ? '⭐' : '👏')
              : '💔'}
          </div>
          <div style={{ fontFamily:"'Noto Serif Hebrew', serif", fontSize:26, fontWeight:900,
            color: phase === 'won' ? '#10b981' : '#ef4444', direction:'rtl' }}>
            {phase === 'won' ? '!נכון מאוד' : '!נגמרו הלבבות'}
          </div>
          {/* Show correct answer */}
          <div style={{ display:'flex', gap:10, direction:'rtl' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:60, height:66, borderRadius:14,
                background:'rgba(16,185,129,0.15)', border:'2px solid #10b981',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Noto Serif Hebrew', serif", fontSize:34, color:'#f0e6ff',
              }}>{W.letters[i]}</div>
            ))}
          </div>
          <button onClick={nextWord} style={{
            padding:'14px 36px', borderRadius:50, border:'none',
            background:'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color:'white',
            fontSize:16, fontWeight:900, cursor:'pointer',
            fontFamily:"'Noto Serif Hebrew', serif",
          }}>← מילה הבאה</button>
        </div>
      )}
    </div>
  );
}

// ── DRAWING GAME ──────────────────────────────────────────────
const DRAW_LEVELS = [
  { id: 'easy',      label: 'קל',       emoji: '😊', desc: 'צייר על התבנית',       color: '#22c55e' },
  { id: 'medium',    label: 'בינוני',   emoji: '😤', desc: 'ללא תבנית – מהזיכרון', color: '#f59e0b' },
  { id: 'handwrite', label: 'כתב יד',  emoji: '✍️', desc: 'צורת כתב עם תבנית',    color: '#60a5fa' },
];

function DrawingGame({ onXP }) {
  const CSIZE = 280;
  const canvasRef = useRef(null);
  const [queue] = useState(() => shuffle(ALEPH_BET));
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('ready'); // ready | drawing | result
  const [timeLeft, setTimeLeft] = useState(8);
  const [simScore, setSimScore] = useState(0);
  const timerRef = useRef(null);
  const drawingRef = useRef(false);
  const [drawLevel, setDrawLevel] = useState(null); // null = pick screen

  const L = queue[qIdx % queue.length];

  // Font & ghost visibility based on level
  const drawFont = drawLevel === 'handwrite'
    ? "'Playpen Sans Hebrew', cursive"
    : "'Noto Serif Hebrew', serif";
  // Ghost shows in easy+handwrite always; in medium only on result (to compare)
  const showGhost = drawLevel !== 'medium' || phase === 'result';

  // Preload handwriting font so canvas rendering is accurate
  useEffect(() => {
    if (drawLevel === 'handwrite') {
      document.fonts.load(`bold 200px 'Playpen Sans Hebrew'`).catch(() => {});
    }
  }, [drawLevel]);

  // Speak letter on each new round (only when a level is chosen)
  useEffect(() => {
    if (!drawLevel) return;
    const t = setTimeout(() => speakLetter(L), 400);
    return () => clearTimeout(t);
  }, [qIdx, drawLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, CSIZE, CSIZE);
  };

  // Pure: compute Jaccard similarity between drawn strokes and reference letter
  const computeScore = () => {
    if (!canvasRef.current) return 0;
    const uData = canvasRef.current.getContext('2d').getImageData(0, 0, CSIZE, CSIZE).data;
    const ref = document.createElement('canvas');
    ref.width = CSIZE; ref.height = CSIZE;
    const rCtx = ref.getContext('2d');
    rCtx.font = `bold ${Math.round(CSIZE * 0.72)}px ${drawFont}`;
    rCtx.textAlign = 'center'; rCtx.textBaseline = 'middle';
    rCtx.fillStyle = 'white';
    rCtx.fillText(L.hebrew, CSIZE / 2, CSIZE / 2 + CSIZE * 0.04);
    const rData = rCtx.getImageData(0, 0, CSIZE, CSIZE).data;
    const N = CSIZE * CSIZE;
    const uMask = new Uint8Array(N);
    const rMask = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      uMask[i] = uData[i * 4 + 3] > 40 ? 1 : 0;
      rMask[i] = rData[i * 4 + 3] > 40 ? 1 : 0;
    }
    const dilU = dilate(uMask, CSIZE, CSIZE, 22);
    let inter = 0, union = 0;
    for (let i = 0; i < N; i++) {
      if (dilU[i] || rMask[i]) union++;
      if (dilU[i] && rMask[i]) inter++;
    }
    return union > 0 ? Math.round((inter / union) * 100) : 0;
  };

  const startRound = () => {
    clearCanvas();
    drawingRef.current = false;
    setPhase('drawing');
    let t = 8;
    setTimeLeft(t);
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) { clearInterval(timerRef.current); evaluate(); }
    }, 1000);
  };

  const getPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (CSIZE / r.width),
      y: (src.clientY - r.top)  * (CSIZE / r.height),
    };
  };

  const onDown = (e) => {
    if (phase === 'result') return;
    if (phase === 'ready') startRound();   // auto-start on first press
    e.preventDefault();
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onMove = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const onUp = () => { drawingRef.current = false; };

  // O(N) separable dilation via prefix sums
  const dilate = (mask, w, h, r) => {
    const temp = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      const pre = new Int32Array(w + 1);
      for (let x = 0; x < w; x++) pre[x + 1] = pre[x] + mask[y * w + x];
      for (let x = 0; x < w; x++) {
        temp[y * w + x] = pre[Math.min(w, x + r + 1)] - pre[Math.max(0, x - r)] > 0 ? 1 : 0;
      }
    }
    const out = new Uint8Array(w * h);
    for (let x = 0; x < w; x++) {
      const pre = new Int32Array(h + 1);
      for (let y = 0; y < h; y++) pre[y + 1] = pre[y] + temp[y * w + x];
      for (let y = 0; y < h; y++) {
        out[y * w + x] = pre[Math.min(h, y + r + 1)] - pre[Math.max(0, y - r)] > 0 ? 1 : 0;
      }
    }
    return out;
  };

  const evaluate = () => {
    const score = computeScore();
    setSimScore(score);

    const xp = score >= 45 ? 100 : score >= 30 ? 70 : score >= 15 ? 40 : 10;
    onXP(xp);

    drawingRef.current = false;
    const fb = score >= 45 ? 'מצוין' : score >= 30 ? 'טוב מאוד' : score >= 15 ? 'כל הכבוד' : 'המשך לתרגל';
    speakHebrew(fb);

    setPhase('result');
  };

  const next = () => {
    clearInterval(timerRef.current);
    drawingRef.current = false;
    clearCanvas();
    setQIdx(i => (i + 1) % queue.length);
    setPhase('ready');
    setSimScore(0);
    setTimeLeft(8);
  };

  const feedbackLabel =
    simScore >= 45 ? '!מצוין 🌟' :
    simScore >= 30 ? '!טוב מאוד ⭐' :
    simScore >= 15 ? '!כל הכבוד 👏' : '!המשך לתרגל 💪';

  // Keyboard: 1-3 picks level; Enter/Space = start/submit/next; Esc = clear
  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (!drawLevel) {
        // Level picker: 1=easy 2=medium 3=handwrite
        if (e.key === '1') setDrawLevel('easy');
        else if (e.key === '2') setDrawLevel('medium');
        else if (e.key === '3') setDrawLevel('handwrite');
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (phase === 'ready') startRound();
        else if (phase === 'drawing') { clearInterval(timerRef.current); evaluate(); }
        else if (phase === 'result') next();
      } else if ((e.key === 'n' || e.key === 'N') && phase === 'result') {
        next();
      } else if (e.key === 'Escape' && phase === 'drawing') {
        clearCanvas();
      } else if (e.key === 'Escape' && phase === 'ready') {
        setDrawLevel(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, drawLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Level picker screen ───────────────────────────────────────
  if (!drawLevel) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{
          color: '#f0e6ff', fontSize: 22, fontWeight: 900,
          fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl',
        }}>?בחר רמה</div>
        {DRAW_LEVELS.map((lv, i) => (
          <button key={lv.id} onClick={() => setDrawLevel(lv.id)} style={{
            width: 280, padding: '18px 24px', borderRadius: 20,
            background: `linear-gradient(135deg,${lv.color}22,${lv.color}11)`,
            border: `2px solid ${lv.color}66`,
            color: '#f0e6ff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: `0 8px 24px ${lv.color}22`,
          }}>
            <span style={{ fontSize: 38 }}>{lv.emoji}</span>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22,
                fontWeight: 900, direction: 'rtl', color: '#f0e6ff',
              }}>{lv.label}</div>
              <div style={{ fontSize: 13, direction: 'rtl', color: lv.color, marginTop: 2 }}>
                {lv.desc}
              </div>
            </div>
            <div style={{ color: lv.color, fontSize: 13, opacity: 0.7 }}>{i + 1}</div>
          </button>
        ))}
      </div>
    );
  }

  // ── Current level badge ───────────────────────────────────────
  const curLevel = DRAW_LEVELS.find(l => l.id === drawLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>

      {/* Level badge — click to go back to picker */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={() => { clearInterval(timerRef.current); setPhase('ready'); setDrawLevel(null); }} style={{
          background: `${curLevel.color}18`,
          border: `1px solid ${curLevel.color}55`,
          color: curLevel.color, borderRadius: 20, padding: '4px 12px',
          cursor: 'pointer', fontSize: 12, fontFamily: "'Noto Serif Hebrew', serif",
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          {curLevel.emoji} {curLevel.label} ←
        </button>
      </div>

      {/* Letter info card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        background: 'rgba(255,255,255,0.05)', borderRadius: 20,
        padding: '14px 20px', border: '1px solid rgba(96,165,250,0.2)',
      }}>
        <SpeakButton onClick={() => speakLetter(L)} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 17, color: '#60a5fa', direction: 'rtl' }}>
            {L.nameHebrew}
          </div>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 13, color: '#6d6b8a', direction: 'rtl', marginTop: 2 }}>
            {L.emoji} {L.word}
          </div>
        </div>
        <div style={{ fontFamily: drawFont, fontSize: 80, lineHeight: 1, color: '#f0e6ff' }}>
          {L.hebrew}
        </div>
      </div>

      {/* Drawing canvas with ghost letter underneath */}
      <div style={{ position: 'relative', width: CSIZE, height: CSIZE }}>
        {/* Ghost guide letter — hidden in medium while drawing/ready */}
        {showGhost && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: drawFont,
            fontSize: Math.round(CSIZE * 0.72),
            lineHeight: 1,
            // In medium result: brighter so user can compare their strokes to the reference
            color: phase === 'result'
              ? (drawLevel === 'medium' ? 'rgba(96,165,250,0.55)' : 'rgba(96,165,250,0.4)')
              : 'rgba(96,165,250,0.1)',
            pointerEvents: 'none', userSelect: 'none',
            transition: 'color 0.6s',
            paddingTop: Math.round(CSIZE * 0.04),
          }}>{L.hebrew}</div>
        )}

        <canvas
          ref={canvasRef}
          width={CSIZE}
          height={CSIZE}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onTouchCancel={onUp}
          style={{
            display: 'block', borderRadius: 22,
            background: 'rgba(20,16,60,0.7)',
            border: `3px solid ${phase === 'drawing' ? 'rgba(29,78,216,0.9)' : 'rgba(96,165,250,0.25)'}`,
            cursor: phase === 'drawing' ? 'crosshair' : 'default',
            boxShadow: phase === 'drawing' ? '0 0 40px rgba(29,78,216,0.55)' : '0 8px 32px rgba(0,0,0,0.4)',
            touchAction: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        />
      </div>

      {/* Ready — draw hint */}
      {phase === 'ready' && (
        <div style={{
          color: '#60a5fa', fontSize: 15, fontFamily: "'Noto Serif Hebrew', serif",
          direction: 'rtl', opacity: 0.8, textAlign: 'center', lineHeight: 1.6,
        }}>
          {drawLevel === 'medium'
            ? <>צייר מהזיכרון! 🧠<br/><span style={{ fontSize: 12, opacity: 0.7 }}>התבנית תופיע רק אחרי הציור</span></>
            : drawLevel === 'handwrite'
              ? <>צייר בכתב יד! ✍️<br/><span style={{ fontSize: 12, opacity: 0.7 }}>לחץ וגרור על הלוח</span></>
              : 'לחץ וגרור על הלוח כדי לצייר'
          }
        </div>
      )}

      {/* Drawing — timer + clear */}
      {phase === 'drawing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{
            fontSize: 42, fontWeight: 900,
            color: timeLeft <= 2 ? '#ef4444' : '#60a5fa',
            transition: 'color 0.3s',
          }}>{timeLeft}</div>
          <div style={{ width: CSIZE, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              width: `${(timeLeft / 8) * 100}%`, height: '100%',
              background: timeLeft <= 2
                ? 'linear-gradient(90deg,#ef4444,#f87171)'
                : 'linear-gradient(90deg,#1d4ed8,#0ea5e9)',
              borderRadius: 99,
              transition: 'width 1s linear, background 0.3s',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={clearCanvas} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#60a5fa', borderRadius: 50, padding: '8px 22px',
              cursor: 'pointer', fontSize: 13, fontFamily: "'Noto Serif Hebrew', serif",
            }}>✕ מחק</button>
            <button onClick={() => { clearInterval(timerRef.current); evaluate(); }} style={{
              background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', border: 'none',
              color: 'white', borderRadius: 50, padding: '8px 22px',
              cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif",
            }}>✓ סיימתי</button>
          </div>
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontFamily: "'Noto Serif Hebrew', serif", fontSize: 26, fontWeight: 900,
            color: simScore >= 45 ? '#10b981' : simScore >= 30 ? '#f59e0b' : simScore >= 15 ? '#60a5fa' : '#6d6b8a',
            direction: 'rtl',
          }}>{feedbackLabel}</div>
          <div style={{ color: '#6d6b8a', fontSize: 13 }}>{simScore}% דמיון</div>
          <button onClick={next} style={{
            padding: '14px 44px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
            fontSize: 17, fontWeight: 900, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>← הבא</button>
        </div>
      )}
    </div>
  );
}

// ── TTS STATUS DOT ────────────────────────────────────────────
// Module-level: shared between speakHebrew and TtsStatusDot
let _ttsStatus = 'checking'; // 'checking' | 'hot' | 'cold'
const _setTtsStatus = (s) => {
  if (_ttsStatus === s) return;
  _ttsStatus = s;
  window.dispatchEvent(new CustomEvent('tts-status', { detail: s }));
};

/**
 * Small LED in the bottom-right corner.
 *   🔴 pulsing amber = TTS server warming up (first call may use Web Speech)
 *   🟢 solid green   = Phonikud is hot — all speech will use the good voice
 *   🔴 solid red     = server unavailable; using Web Speech as fallback
 *
 * On mount it fires a silent warmup request so the HF Space wakes up
 * before the first real TTS call.
 */
function TtsStatusDot() {
  const [status, setStatus] = useState(_ttsStatus);
  const [dim, setDim]       = useState(false);

  useEffect(() => {
    const onStatus = (e) => { setStatus(e.detail); };
    window.addEventListener('tts-status', onStatus);

    // Proactive warmup: wake up HF Space / confirm local server
    const ctrl = new AbortController();
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'שלום' }),
      signal: ctrl.signal,
    }).then(async (r) => {
      if (!r.ok) throw new Error('not ok');
      const url = URL.createObjectURL(await r.blob());
      _ttsCache.set('שלום', url);  // pre-cache
      _setTtsStatus('hot');
    }).catch(() => _setTtsStatus('cold'));

    // Give up after 90 s (long HF cold-starts)
    const giveUp = setTimeout(() => {
      if (_ttsStatus === 'checking') _setTtsStatus('cold');
    }, 90000);

    return () => {
      window.removeEventListener('tts-status', onStatus);
      ctrl.abort();
      clearTimeout(giveUp);
    };
  }, []);

  // Pulse the dot while checking
  useEffect(() => {
    if (status !== 'checking') { setDim(false); return; }
    const id = setInterval(() => setDim(d => !d), 650);
    return () => clearInterval(id);
  }, [status]);

  const colors = { hot: '#22c55e', cold: '#ef4444', checking: '#f59e0b' };
  const labels = {
    hot:      'קול פוניקוד מוכן ✓',
    cold:     'שרת TTS לא זמין — Web Speech',
    checking: 'מאתחל קול פוניקוד…',
  };

  const c = colors[status];
  return (
    <div
      title={labels[status]}
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        width: 13, height: 13, borderRadius: '50%',
        background: c,
        opacity: dim ? 0.2 : 1,
        transition: 'opacity 0.5s ease, background 0.4s ease',
        boxShadow: `0 0 ${status === 'hot' ? 10 : 5}px ${c}`,
        cursor: 'help',
      }}
    />
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("home");
  const [xps, setXps] = useState(loadXPs);
  const [activeProfile, setActiveProfile] = useState(null);
  const [matchKey, setMatchKey] = useState(0);
  const [players, setPlayers] = useState(loadPlayers);
  // Cache progress objects per profile (loaded on demand)
  const [progCache, setProgCache] = useState({});

  const profile = players.find(p => p.id === activeProfile);
  const profileWithAvatar = profile ? { ...profile, Avatar: AVATAR_MAP[profile.avatar] ?? AvatarNoah } : null;
  const xp = xps[activeProfile] ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  // Get (or lazily load) progress for a profile
  const getProgress = (id) => progCache[id] ?? loadProgress(id);

  const handleAddPlayer = (newPlayer) => {
    const updated = [...players, newPlayer];
    setPlayers(updated); savePlayers(updated);
    setXps(prev => { const n = { ...prev, [newPlayer.id]: 0 }; saveXPs(n); return n; });
  };
  const handleDeletePlayer = (id) => {
    const updated = players.filter(p => p.id !== id);
    setPlayers(updated); savePlayers(updated);
  };

  const addXP = (n) => {
    if (n <= 0) return;
    setXps(prev => {
      const next = { ...prev, [activeProfile]: Math.max(0, (prev[activeProfile] ?? 0) + n) };
      saveXPs(next);
      return next;
    });
    // Update cumulative progress
    setProgCache(prev => {
      const cur = prev[activeProfile] ?? loadProgress(activeProfile);
      const updated = {
        ...cur,
        totalXpEarned: (cur.totalXpEarned ?? 0) + n,
        lastPlayed: new Date().toISOString().slice(0, 10),
        gamesPlayed: { ...cur.gamesPlayed, [mode]: (cur.gamesPlayed?.[mode] ?? 0) + 1 },
      };
      saveProgress(activeProfile, updated);
      return { ...prev, [activeProfile]: updated };
    });
  };

  const modes = [
    { id: "flashcards", label: "כרטיסיות", emoji: "🃏", desc: "למד אותיות"    },
    { id: "matching",   label: "התאמה",    emoji: "🔗", desc: "מצא זוגות"     },
    { id: "quiz",       label: "חידון",    emoji: "🧠", desc: "בחן את עצמך"   },
    { id: "spelling",   label: "כתיב",     emoji: "✍️", desc: "בנה מילה"      },
    { id: "drawing",    label: "צייר",     emoji: "🎨", desc: "צייר את האות"  },
    { id: "sentence",   label: "משפט",     emoji: "💬", desc: "השלם את המשפט" },
  ];

  // Show profile picker if no active profile
  if (!activeProfile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #000f2b; min-height: 100vh; font-family: 'Nunito', sans-serif; }
          button { transition: all 0.15s; }
        `}</style>
        <ProfilePicker players={players} xps={xps} getProgress={getProgress} onSelect={(id) => { setActiveProfile(id); setMode('home'); }} onAddPlayer={handleAddPlayer} onDeletePlayer={handleDeletePlayer} />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000f2b; min-height: 100vh; font-family: 'Nunito', sans-serif; }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.4);opacity:0} }
        @keyframes hint-glow { 0%{transform:scale(1);box-shadow:0 0 0 rgba(96,165,250,0)} 40%{transform:scale(1.12);box-shadow:0 0 22px rgba(96,165,250,1)} 100%{transform:scale(1.05);box-shadow:0 0 14px rgba(96,165,250,0.6)} }
        button:hover { transform: scale(1.04); }
        button { transition: all 0.15s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 20%, #0a2d6e 0%, #000f2b 60%)", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 0", gap: 8 }}>
          {/* Left: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode !== "home" && (
              <button onClick={() => { setMode("home"); setMatchKey(k => k + 1); }} style={{
                background: "rgba(96,165,250,0.15)", border: "none", color: "#60a5fa",
                borderRadius: 50, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14,
                fontFamily: "'Noto Serif Hebrew', serif",
              }}>← חזרה</button>
            )}
            <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 18, color: "#f0e6ff", fontWeight: 700, direction: 'rtl' }}>
              סטודיו עברית
            </div>
          </div>

          {/* Right: profile mini + XP */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* XP bar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <div style={{ color: "#60a5fa", fontSize: 11, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>רמה {level} · {xp} נק'</div>
              <div style={{ width: 90, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${profile?.color ?? '#60a5fa'},${profile?.color ?? '#60a5fa'}99)`, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
            </div>
            {/* Mini avatar + name + switch */}
            <button
              onClick={() => { setActiveProfile(null); setMode('home'); }}
              title="Switch profile"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${profile?.color ?? '#60a5fa'}55`,
                borderRadius: 50, padding: '4px 10px 4px 4px', cursor: 'pointer',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${profile?.color ?? '#60a5fa'}` }}>
                {profileWithAvatar && <profileWithAvatar.Avatar size={34} uid="hdr"/>}
              </div>
              <span style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 16, color: '#f0e6ff', direction: 'rtl' }}>
                {activeProfile}
              </span>
            </button>
          </div>
        </div>

        {/* Home */}
        {mode === "home" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              {/* Israeli flag */}
              <div style={{ fontSize: 52, marginBottom: 4 }}>🇮🇱</div>
              <div style={{
                fontFamily: "'Noto Serif Hebrew', serif", fontSize: 72, lineHeight: 1,
                background: "linear-gradient(135deg,#1d6ae5,#0ea5e9,#60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "float 3s ease-in-out infinite",
              }}>
                סטודיו עברית
              </div>
              <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 28, color: "#e0f2ff", marginTop: 10, direction: 'rtl', fontWeight: 700 }}>
                למד את האלפבית העברי!
              </div>
              <div style={{ color: "#60a5fa", fontSize: 15, marginTop: 6, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>כרטיסיות · התאמה · חידון · כתיב · צייר · משפט</div>
            </div>

            {/* Game mode grid — 3+3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: '100%', maxWidth: 560, padding: '0 12px' }}>
              {[modes.slice(0, 3), modes.slice(3)].map((row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 12 }}>
                  {row.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)} style={{
                      flex: 1, height: 130, borderRadius: 22, border: "2px solid rgba(96,165,250,0.35)",
                      background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)",
                      color: "white", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}>
                      <div style={{ fontSize: 36 }}>{m.emoji}</div>
                      <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 17, color: "#e0f2ff", direction: 'rtl', fontWeight: 700 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#60a5fa", fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Interactive letter bar — single scrollable RTL row */}
            <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto", width: "100%", maxWidth: 520, direction: "rtl", padding: "4px 12px", scrollbarWidth: "none" }}>
              {ALEPH_BET.map(l => (
                <LetterButton key={l.name} letter={l} />
              ))}
            </div>
          </div>
        )}

        {/* Modes */}
        <div style={{ maxWidth: 520, margin: "32px auto 0", padding: "0 16px" }}>
          {mode === "flashcards" && <Flashcards onXP={addXP} />}
          {mode === "matching"   && <MatchingGame key={matchKey} onXP={addXP} />}
          {mode === "quiz"       && <Quiz key={matchKey} onXP={addXP} />}
          {mode === "spelling"   && <SpellingGame key={matchKey} onXP={addXP} profile={profileWithAvatar} />}
          {mode === "drawing"    && <DrawingGame key={matchKey} onXP={addXP} />}
          {mode === "sentence"   && <SentenceGame key={matchKey} onXP={addXP} />}
        </div>
      </div>

      {xp >= 1000 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(13,10,30,0.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 24, zIndex: 100,
        }}>
          <div style={{ fontSize: 100, animation: 'float 3s ease-in-out infinite' }}>🏆</div>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 52, color: '#f0e6ff', textAlign: 'center', direction: 'rtl' }}>
            !ניצחת
          </div>
          <div style={{ color: '#60a5fa', fontSize: 18, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>!הגעת ל-1000 נק'</div>
          <Stars count={3} />
          <button onClick={() => {
            setXps(prev => { const next = { ...prev, [activeProfile]: 0 }; saveXPs(next); return next; });
            setMode('home'); setMatchKey(k => k + 1);
          }} style={{
            marginTop: 8, padding: '16px 40px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white',
            fontWeight: 900, fontSize: 18, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>🎮 שחק שוב</button>
        </div>
      )}

      {/* TTS status LED — bottom-right corner */}
      <TtsStatusDot />
    </>
  );
}
