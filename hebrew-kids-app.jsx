import { useState, useEffect, useRef } from "react";

const ALEPH_BET = [
  { hebrew: "א", name: "Aleph", nameHebrew: "אָלֶף", sound: "silent", word: "Aryeh", wordHebrew: "אַרְיֵה", emoji: "🦁", wordMeaning: "Lion" },
  { hebrew: "ב", name: "Bet", nameHebrew: "בֵּית", sound: "B", word: "Bayit", wordHebrew: "בַּיִת", emoji: "🏠", wordMeaning: "House" },
  { hebrew: "ג", name: "Gimel", nameHebrew: "גִּימֶל", sound: "G", word: "Gamal", wordHebrew: "גָּמָל", emoji: "🐪", wordMeaning: "Camel" },
  { hebrew: "ד", name: "Dalet", nameHebrew: "דָּלֶת", sound: "D", word: "Dag", wordHebrew: "דָּג", emoji: "🐟", wordMeaning: "Fish" },
  { hebrew: "ה", name: "Hey", nameHebrew: "הֵא", sound: "H", word: "Har", wordHebrew: "הַר", emoji: "⛰️", wordMeaning: "Mountain" },
  { hebrew: "ו", name: "Vav", nameHebrew: "וָו", sound: "V", word: "Vered", wordHebrew: "וֶרֶד", emoji: "🌹", wordMeaning: "Rose" },
  { hebrew: "ז", name: "Zayin", nameHebrew: "זַיִן", sound: "Z", word: "Zahav", wordHebrew: "זָהָב", emoji: "⭐", wordMeaning: "Gold" },
  { hebrew: "ח", name: "Chet", nameHebrew: "חֵית", sound: "Ch", word: "Chatul", wordHebrew: "חָתוּל", emoji: "🐱", wordMeaning: "Cat" },
  { hebrew: "ט", name: "Tet", nameHebrew: "טֵית", sound: "T", word: "Taus", wordHebrew: "טַוָּס", emoji: "🦚", wordMeaning: "Peacock" },
  { hebrew: "י", name: "Yod", nameHebrew: "יוֹד", sound: "Y", word: "Yam", wordHebrew: "יָם", emoji: "🌊", wordMeaning: "Sea" },
  { hebrew: "כ", name: "Kaf", nameHebrew: "כַּף", sound: "K", word: "Kelev", wordHebrew: "כֶּלֶב", emoji: "🐶", wordMeaning: "Dog" },
  { hebrew: "ל", name: "Lamed", nameHebrew: "לָמֶד", sound: "L", word: "Lev", wordHebrew: "לֵב", emoji: "❤️", wordMeaning: "Heart" },
  { hebrew: "מ", name: "Mem", nameHebrew: "מֵם", sound: "M", word: "Mayim", wordHebrew: "מַיִם", emoji: "💧", wordMeaning: "Water" },
  { hebrew: "נ", name: "Nun", nameHebrew: "נוּן", sound: "N", word: "Namer", wordHebrew: "נָמֵר", emoji: "🐆", wordMeaning: "Leopard" },
  { hebrew: "ס", name: "Samech", nameHebrew: "סָמֶךְ", sound: "S", word: "Soos", wordHebrew: "סוּס", emoji: "🐴", wordMeaning: "Horse" },
  { hebrew: "ע", name: "Ayin", nameHebrew: "עַיִן", sound: "silent", word: "Etz", wordHebrew: "עֵץ", emoji: "🌳", wordMeaning: "Tree" },
  { hebrew: "פ", name: "Pey", nameHebrew: "פֵּא", sound: "P", word: "Pil", wordHebrew: "פִּיל", emoji: "🐘", wordMeaning: "Elephant" },
  { hebrew: "צ", name: "Tzadi", nameHebrew: "צָדִי", sound: "Tz", word: "Tzipor", wordHebrew: "צִפּוֹר", emoji: "🐦", wordMeaning: "Bird" },
  { hebrew: "ק", name: "Kuf", nameHebrew: "קוֹף", sound: "K", word: "Kof", wordHebrew: "קוֹף", emoji: "🐒", wordMeaning: "Monkey" },
  { hebrew: "ר", name: "Resh", nameHebrew: "רֵישׁ", sound: "R", word: "Rachev", wordHebrew: "רֶכֶב", emoji: "🚗", wordMeaning: "Car" },
  { hebrew: "ש", name: "Shin", nameHebrew: "שִׁין", sound: "Sh", word: "Shemesh", wordHebrew: "שֶׁמֶשׁ", emoji: "☀️", wordMeaning: "Sun" },
  { hebrew: "ת", name: "Tav", nameHebrew: "תָּו", sound: "T", word: "Tapuz", wordHebrew: "תַּפּוּז", emoji: "🍊", wordMeaning: "Orange" },
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
const speakHebrew = (text) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'he-IL';
  utt.rate = 0.8;
  window.speechSynthesis.speak(utt);
};

const speakLetter = (letter) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  // Say English name first so kids know what to pronounce, then Hebrew name
  const utt0 = new SpeechSynthesisUtterance(letter.name);
  utt0.lang = 'en-US'; utt0.rate = 0.8;
  const utt1 = new SpeechSynthesisUtterance(stripNikud(letter.nameHebrew));
  utt1.lang = 'he-IL'; utt1.rate = 0.75;
  const utt2 = new SpeechSynthesisUtterance(stripNikud(letter.wordHebrew));
  utt2.lang = 'he-IL'; utt2.rate = 0.75;
  window.speechSynthesis.speak(utt0);
  window.speechSynthesis.speak(utt1);
  window.speechSynthesis.speak(utt2);
};

function SpeakButton({ onClick, style = {} }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
        borderRadius: 50, width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 18, color: '#a78bfa',
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

  // Auto-start mic when phase becomes 'ready'
  useEffect(() => {
    autoStartRef.current = setTimeout(() => {
      doListen(L);
    }, 900);
    return () => clearTimeout(autoStartRef.current);
  }, [qPos, queue]); // re-runs whenever we advance to a new letter

  const finishRound = (heard, correct, letter) => {
    if (resultDoneRef.current) return;
    resultDoneRef.current = true;
    clearInterval(timerRef.current);
    setResult({ heard, correct });
    setPhase('result');
    window.speechSynthesis.cancel();
    if (correct) {
      const utt = new SpeechSynthesisUtterance('נכון');
      utt.lang = 'he-IL'; utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    } else {
      // Say English name clearly (so they know what to say), then Hebrew
      const uEng = new SpeechSynthesisUtterance(letter.name);
      uEng.lang = 'en-US'; uEng.rate = 0.8;
      const uHeb = new SpeechSynthesisUtterance(stripNikud(letter.nameHebrew));
      uHeb.lang = 'he-IL'; uHeb.rate = 0.75;
      window.speechSynthesis.speak(uEng);
      window.speechSynthesis.speak(uHeb);
    }
    onXP(correct ? 100 : -50);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ color: '#a78bfa', fontSize: 14, fontWeight: 700, letterSpacing: 2, fontFamily:"'Noto Serif Hebrew',serif", direction:'rtl' }}>
        #{totalSeen + 1} · !אמרו את שם האות
      </div>

      <div style={{
        width: 300, height: 320, borderRadius: 28,
        background: phase === 'result'
          ? result?.correct ? 'linear-gradient(135deg,#065f46,#047857)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)'
          : phase === 'listening' ? 'linear-gradient(135deg,#1e40af,#5b21b6)'
          : 'linear-gradient(135deg,#1e1b4b,#312e81)',
        border: '3px solid rgba(167,139,250,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: 24,
        boxShadow: phase === 'listening' ? '0 0 50px rgba(124,58,237,0.8)' : '0 20px 60px rgba(124,58,237,0.4)',
        transition: 'all 0.4s',
      }}>
        <div style={{ fontSize: 120, lineHeight: 1, fontFamily: "'Noto Serif Hebrew', serif", color: '#f0e6ff' }}>
          {L.hebrew}
        </div>
        {phase === 'result' && result && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              {result.correct ? '✅ !נכון +100' : '❌ לא נכון −50'}
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
        <div style={{ color: '#a78bfa', fontSize: 15, opacity: 0.7, fontFamily:"'Noto Serif Hebrew',serif" }}>…מתחיל</div>
      )}

      {phase === 'listening' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#db2777)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: '0 0 30px rgba(219,39,119,0.7)',
            animation: 'pulse-ring 1s ease-in-out infinite',
          }}>🎤</div>
          <div style={{ color: '#f0abfc', fontSize: 22, fontWeight: 900, fontFamily:"'Noto Serif Hebrew',serif", direction:'rtl' }}>
            שנ{timeLeft}… מאזין
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <SpeakButton onClick={() => speakLetter(L)} />
          <button onClick={next} style={{
            padding: '14px 36px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: 'white',
            fontSize: 16, fontWeight: 900, cursor: 'pointer',
          }}>← הבא</button>
        </div>
      )}
    </div>
  );
}

// ── MATCHING GAME ──────────────────────────────────────────────
function MatchingGame({ onXP }) {
  const SIZE = 6;
  const [pool] = useState(() => shuffle(ALEPH_BET).slice(0, SIZE));
  const [cards, setCards] = useState(() => {
    const pairs = pool.flatMap(l => [
      { id: l.name + "-heb", type: "hebrew", value: l.hebrew, name: l.name },
      { id: l.name + "-eng", type: "english", value: l.name, name: l.name, emoji: l.emoji },
    ]);
    return shuffle(pairs).map((c, i) => ({ ...c, pos: i, matched: false, selected: false }));
  });
  const [selected, setSelected] = useState([]);
  const [matches, setMatches] = useState(0);
  const [shake, setShake] = useState(null);

  const select = (pos) => {
    const card = cards[pos];
    if (card.matched || selected.length === 2) return;
    if (selected.length === 1 && selected[0].pos === pos) return;

    const newSel = [...selected, { pos, name: card.name }];
    setCards(prev => prev.map(c => c.pos === pos ? { ...c, selected: true } : c));
    setSelected(newSel);

    if (newSel.length === 2) {
      if (newSel[0].name === newSel[1].name) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.name === newSel[0].name ? { ...c, matched: true, selected: false } : c
          ));
          setSelected([]);
          setMatches(m => m + 1);
          onXP(15);
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

  const done = matches === SIZE;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ color: "#a78bfa", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
        Match Hebrew letters to their names! · {matches}/{SIZE} matched
      </div>
      {done && (
        <div style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", borderRadius: 16, padding: "14px 32px", color: "white", fontWeight: 900, fontSize: 20, textAlign: "center" }}>
          🎉 Amazing! All matched!
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxWidth: 440 }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => {
              select(card.pos);
              if (card.type === 'hebrew') {
                const l = ALEPH_BET.find(a => a.name === card.name);
                if (l) speakHebrew(l.wordHebrew);
              }
            }}
            style={{
              width: 90, height: 90, borderRadius: 16, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", cursor: card.matched ? "default" : "pointer",
              background: card.matched
                ? "linear-gradient(135deg,#065f46,#047857)"
                : card.selected
                  ? "linear-gradient(135deg,#7c3aed,#db2777)"
                  : "rgba(255,255,255,0.07)",
              border: card.matched ? "2px solid #34d399" : card.selected ? "2px solid #f0abfc" : "2px solid rgba(255,255,255,0.12)",
              transition: "all 0.3s",
              animation: shake === card.pos ? "shake 0.5s" : "none",
              opacity: card.matched ? 0.7 : 1,
              boxShadow: card.selected ? "0 0 20px rgba(240,171,252,0.5)" : "none",
            }}
          >
            {card.type === "hebrew" ? (
              <div style={{ fontSize: 38, fontFamily: "'Noto Serif Hebrew', serif", color: card.matched ? "#6ee7b7" : "#f0e6ff" }}>{card.value}</div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{card.emoji}</div>
                <div style={{ fontSize: 13, color: card.matched ? "#6ee7b7" : "#e9d5ff", fontWeight: 700 }}>{card.value}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── QUIZ MODE ─────────────────────────────────────────────────
function Quiz({ onXP }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);
  const [questions] = useState(() => {
    return shuffle(ALEPH_BET).slice(0, 8).map(letter => {
      const wrongs = shuffle(ALEPH_BET.filter(l => l.name !== letter.name)).slice(0, 3);
      return {
        letter,
        options: shuffle([letter, ...wrongs]),
      };
    });
  });

  const answer = (opt) => {
    if (chosen) return;
    setChosen(opt.name);
    if (opt.name === questions[qIdx].letter.name) {
      setScore(s => s + 1);
      onXP(20);
    }
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setDone(true);
      else { setQIdx(i => i + 1); setChosen(null); }
    }, 900);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 60 }}>{pct >= 90 ? "🏆" : pct >= 60 ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#f0e6ff" }}>Quiz Complete!</div>
        <div style={{ fontSize: 20, color: "#c4b5fd" }}>{score} / {questions.length} correct</div>
        <Stars count={stars} />
        <button onClick={() => { setQIdx(0); setScore(0); setChosen(null); setDone(false); }} style={{
          marginTop: 8, padding: "12px 32px", borderRadius: 50, border: "none",
          background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white",
          fontWeight: 900, fontSize: 16, cursor: "pointer",
        }}>Play Again</button>
      </div>
    );
  }

  const Q = questions[qIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ color: "#a78bfa", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
        Question {qIdx + 1} / {questions.length} · Score: {score}
      </div>
      <div style={{
        width: 200, height: 200, borderRadius: 28,
        background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
        border: "3px solid rgba(167,139,250,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 20px 50px rgba(124,58,237,0.4)",
      }}>
        <div style={{ fontSize: 100, lineHeight: 1, fontFamily: "'Noto Serif Hebrew', serif", color: "#f0e6ff" }}>
          {Q.letter.hebrew}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ color: "#e9d5ff", fontSize: 16 }}>What letter is this?</div>
        <SpeakButton onClick={() => speakHebrew(Q.letter.wordHebrew)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: 300 }}>
        {Q.options.map(opt => {
          const isCorrect = opt.name === Q.letter.name;
          const isChosen = chosen === opt.name;
          let bg = "rgba(255,255,255,0.08)";
          if (chosen) {
            if (isCorrect) bg = "linear-gradient(135deg,#065f46,#047857)";
            else if (isChosen) bg = "linear-gradient(135deg,#7f1d1d,#dc2626)";
          }
          return (
            <button key={opt.name} onClick={() => answer(opt)} style={{
              padding: "16px 12px", borderRadius: 16, border: chosen
                ? isCorrect ? "2px solid #34d399" : isChosen ? "2px solid #f87171" : "2px solid transparent"
                : "2px solid rgba(255,255,255,0.12)",
              background: bg,
              color: "#f0e6ff", fontWeight: 700, fontSize: 16, cursor: chosen ? "default" : "pointer",
              transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 28 }}>{opt.hebrew}</span>
              <span style={{ fontSize: 13, opacity: 0.8 }}>{opt.name}</span>
            </button>
          );
        })}
      </div>
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
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9"/>
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
          <stop offset="0%" stopColor="#db2777" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9"/>
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
      <circle cx="30" cy="43" r="2" fill="#db2777"/>
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
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9"/>
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
const PROFILES = [
  { id: 'נח',   Avatar: AvatarNoah, color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
  { id: 'עלמה', Avatar: AvatarAlma, color: '#ec4899', glow: 'rgba(236,72,153,0.5)'  },
  { id: 'מקס',  Avatar: AvatarMax,  color: '#10b981', glow: 'rgba(16,185,129,0.5)'  },
];

const loadXPs = () => {
  try { const s = localStorage.getItem('hebrewApp_xps'); if (s) return JSON.parse(s); } catch(e) {}
  return { נח: 0, עלמה: 0, מקס: 0 };
};
const saveXPs = (xps) => {
  try { localStorage.setItem('hebrewApp_xps', JSON.stringify(xps)); } catch(e) {}
};

// ── PROFILE PICKER ───────────────────────────────────────────
function ProfilePicker({ xps, onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 20%, #2d1b69 0%, #0d0a1e 60%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 40, padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Fredoka One', cursive", fontSize: 36, color: '#f0e6ff',
          textShadow: '0 0 30px rgba(167,139,250,0.6)',
        }}>Who's playing? 🎮</div>
        <div style={{
          fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22,
          color: '#a78bfa', marginTop: 6,
        }}>מי משחק?</div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PROFILES.map(p => {
          const xp = xps[p.id] ?? 0;
          const level = Math.floor(xp / 100) + 1;
          const progress = xp % 100;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                width: 180, background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${p.color}55`,
                borderRadius: 28, padding: '20px 16px 18px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 12,
                boxShadow: `0 8px 40px ${p.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                backdropFilter: 'blur(10px)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06) translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
            >
              {/* Avatar circle */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: `3px solid ${p.color}`,
                boxShadow: `0 0 24px ${p.glow}`,
                overflow: 'hidden', flexShrink: 0,
              }}>
                <p.Avatar size={120} uid={`pick-${p.id}`}/>
              </div>

              {/* Name */}
              <div style={{
                fontFamily: "'Noto Serif Hebrew', serif",
                fontSize: 28, fontWeight: 700, color: '#f0e6ff',
                direction: 'rtl',
              }}>{p.id}</div>

              {/* Level */}
              <div style={{ color: p.color, fontSize: 13, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>
                רמה {level} · {xp} נ.נ
              </div>

              {/* XP bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                  borderRadius: 99, transition: 'width 0.4s',
                }}/>
              </div>
            </button>
          );
        })}
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
  const speakTRef = useRef(null);
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
    window.speechSynthesis.cancel();
    clearTimeout(speakTRef.current);
    speakTRef.current = setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(W.word);
      utt.lang = 'he-IL'; utt.rate = 0.7;
      window.speechSynthesis.speak(utt);
    }, 400);
    return () => { clearTimeout(speakTRef.current); };
  }, [qPos, queue]);

  const handleChoice = (letter) => {
    if (phase !== 'playing') return;

    // Always speak the tapped letter's Hebrew name first
    window.speechSynthesis.cancel();
    const tappedEntry = ALEPH_BET.find(l => l.hebrew === letter);
    if (tappedEntry) {
      const uName = new SpeechSynthesisUtterance(stripNikud(tappedEntry.nameHebrew));
      uName.lang = 'he-IL'; uName.rate = 0.85;
      window.speechSynthesis.speak(uName);
    }

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
        const uWin = new SpeechSynthesisUtterance('נכון');
        uWin.lang = 'he-IL'; uWin.rate = 0.9;
        window.speechSynthesis.speak(uWin);
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
      const uNo = new SpeechSynthesisUtterance('עוד לא');
      uNo.lang = 'he-IL'; uNo.rate = 0.9;
      const uHint = new SpeechSynthesisUtterance(
        `בחר את האות ${stripNikud(correctEntry?.nameHebrew || '')}`
      );
      uHint.lang = 'he-IL'; uHint.rate = 0.8;
      window.speechSynthesis.speak(uNo);
      window.speechSynthesis.speak(uHint);

      if (nh <= 0) { setPhase('failed'); onXP(0); return; }
      // Flash red then clear the slot
      const capturedIdx = slotIdx;
      setTimeout(() => {
        setSlots(s => { const n = [...s]; n[capturedIdx] = null; return n; });
        setSlotStatus(s => { const n = [...s]; n[capturedIdx] = null; return n; });
      }, 600);
    }
  };

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
              <div style={{ color:'#a78bfa', fontSize:15, fontWeight:700 }}>{W.meaning}</div>
            </div>
            <SpeakButton onClick={() => {
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(W.word);
              u.lang = 'he-IL'; u.rate = 0.7;
              window.speechSynthesis.speak(u);
            }}/>
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
                        : isActive       ? 'rgba(124,58,237,0.25)'
                        :                  'rgba(255,255,255,0.05)',
              border:`3px solid ${st==='correct'?'#10b981':st==='wrong'?'#ef4444':isActive?'#7c3aed':'rgba(255,255,255,0.12)'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Noto Serif Hebrew', serif", fontSize:38, color:'#f0e6ff',
              boxShadow: isActive      ? '0 0 22px rgba(124,58,237,0.55)'
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
              const isCorrectLetter = phase === 'playing' && letter === W.letters[slotIdx];
              return (
                <button key={letter} onClick={() => handleChoice(letter)}
                  disabled={phase !== 'playing'}
                  style={{
                    width:48, height:52, borderRadius:10,
                    background: phase !== 'playing' ? 'rgba(255,255,255,0.04)'
                              : isCorrectLetter    ? 'rgba(124,58,237,0.30)'
                              :                      'rgba(124,58,237,0.14)',
                    border:`2px solid ${phase !== 'playing' ? 'rgba(255,255,255,0.08)' : isCorrectLetter ? 'rgba(167,139,250,0.7)' : 'rgba(167,139,250,0.35)'}`,
                    color: phase !== 'playing' ? 'rgba(255,255,255,0.3)' : '#f0e6ff',
                    fontFamily:"'Noto Serif Hebrew', serif", fontSize:24,
                    cursor: phase === 'playing' ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.15s',
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
            {phase === 'won' ? `!נ.נ ${lastScore}+` : '!נגמרו הלבבות'}
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
            background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'white',
            fontSize:16, fontWeight:900, cursor:'pointer',
            fontFamily:"'Noto Serif Hebrew', serif",
          }}>← מילה הבאה</button>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("home");
  const [xps, setXps] = useState(loadXPs);
  const [activeProfile, setActiveProfile] = useState(null);
  const [matchKey, setMatchKey] = useState(0);

  const profile = PROFILES.find(p => p.id === activeProfile);
  const xp = xps[activeProfile] ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  const addXP = (n) => {
    setXps(prev => {
      const next = { ...prev, [activeProfile]: Math.max(0, (prev[activeProfile] ?? 0) + n) };
      saveXPs(next);
      return next;
    });
  };

  const modes = [
    { id: "flashcards", label: "כרטיסיות", emoji: "🃏", desc: "למד אותיות" },
    { id: "matching",   label: "התאמה",    emoji: "🔗", desc: "מצא זוגות"  },
    { id: "quiz",       label: "חידון",    emoji: "🧠", desc: "בחן את עצמך" },
    { id: "spelling",   label: "כתיב",    emoji: "✍️", desc: "בנה מילה"    },
  ];

  // Show profile picker if no active profile
  if (!activeProfile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0d0a1e; min-height: 100vh; font-family: 'Nunito', sans-serif; }
          button { transition: all 0.15s; }
        `}</style>
        <ProfilePicker xps={xps} onSelect={(id) => { setActiveProfile(id); setMode('home'); }} />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0a1e; min-height: 100vh; font-family: 'Nunito', sans-serif; }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.4);opacity:0} }
        button:hover { transform: scale(1.04); }
        button { transition: all 0.15s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 20%, #2d1b69 0%, #0d0a1e 60%)", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 0", gap: 8 }}>
          {/* Left: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode !== "home" && (
              <button onClick={() => { setMode("home"); setMatchKey(k => k + 1); }} style={{
                background: "rgba(167,139,250,0.15)", border: "none", color: "#a78bfa",
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
              <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>רמה {level} · {xp} נ.נ</div>
              <div style={{ width: 90, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${profile.color},${profile.color}99)`, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
            </div>
            {/* Mini avatar + name + switch */}
            <button
              onClick={() => { setActiveProfile(null); setMode('home'); }}
              title="Switch profile"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${profile.color}55`,
                borderRadius: 50, padding: '4px 10px 4px 4px', cursor: 'pointer',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${profile.color}` }}>
                <profile.Avatar size={34} uid="hdr"/>
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
              <div style={{
                fontFamily: "'Noto Serif Hebrew', serif", fontSize: 80, lineHeight: 1,
                background: "linear-gradient(135deg,#a78bfa,#f0abfc,#fb7185)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "float 3s ease-in-out infinite",
              }}>
                סטודיו עברית
              </div>
              <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, color: "#f0e6ff", marginTop: 8, direction: 'rtl' }}>
                !למד את האלפבית העברי
              </div>
              <div style={{ color: "#a78bfa", fontSize: 14, marginTop: 6, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>כרטיסיות · התאמה · חידון · כתיב</div>
            </div>

            {/* 4×1 game mode row */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", width: '100%', maxWidth: 520, padding: '0 12px' }}>
              {modes.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  flex: 1, height: 115, borderRadius: 20, border: "2px solid rgba(167,139,250,0.3)",
                  background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
                  color: "white", cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ fontSize: 32 }}>{m.emoji}</div>
                  <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 15, color: "#f0e6ff", direction: 'rtl' }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: "#a78bfa", fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Interactive letter bar — RTL so Aleph is rightmost */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 440, direction: "rtl" }}>
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
          {mode === "spelling"   && <SpellingGame key={matchKey} onXP={addXP} profile={profile} />}
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
          <div style={{ color: '#a78bfa', fontSize: 18, fontFamily: "'Noto Serif Hebrew', serif", direction: 'rtl' }}>!הגעת ל-1000 נ.נ</div>
          <Stars count={3} />
          <button onClick={() => {
            setXps(prev => { const next = { ...prev, [activeProfile]: 0 }; saveXPs(next); return next; });
            setMode('home'); setMatchKey(k => k + 1);
          }} style={{
            marginTop: 8, padding: '16px 40px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: 'white',
            fontWeight: 900, fontSize: 18, cursor: 'pointer',
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>🎮 שחק שוב</button>
        </div>
      )}
    </>
  );
}
