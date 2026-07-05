// One free-form comprehension question: Draki asks (audio + speech bubble),
// the kid ANSWERS BY TALKING. Keyword matching means natural answers pass —
// "איך קוראים לילדה?" accepts "קרן", "קוראים לה קרן", "השם שלה קרן"…
// Nobody gets stuck: after 2 misses (or 3 tries, or mic trouble) a help
// button reveals and plays the answer. Without speech recognition at all,
// the question degrades to multiple-choice chips.

import { useEffect, useMemo, useRef, useState } from 'react';
import { playClip, stopAudio } from '../lib/audio.js';
import { questionClipId, answerClipId } from '../data/tales.js';
import { useMic } from '../lib/useMic.js';
import { shuffle } from '../lib/util.js';
import { sfxMicOpen, sfxMicMatch, sfxCorrect, sfxWrong } from '../lib/sfx.js';
import { celebrate } from '../lib/celebrate.js';
import Mascot from '../components/Mascot.jsx';

export default function TaleQuestion({ tale, question, onAnswered }) {
  const [matched, setMatched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [misses, setMisses] = useState(0);
  const [opens, setOpens] = useState(0);
  const [wrongChoices, setWrongChoices] = useState([]);
  const onAnsweredRef = useRef(onAnswered);
  onAnsweredRef.current = onAnswered;

  const playQuestion = () => playClip('tales', questionClipId(tale, question), question.text);
  const playAnswer = () => playClip('tales', answerClipId(tale, question), question.answer);

  const mic = useMic({
    targets: question.keywords,
    onMatch: () => {
      sfxMicMatch();
      celebrate('small');
      setMatched(true);
    },
  });

  useEffect(() => {
    playQuestion();
    return stopAudio;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mic.state === 'wrong') setMisses(m => m + 1);
  }, [mic.state]);

  // Correct (spoken or tapped): play the confirmation line, then advance.
  useEffect(() => {
    if (!matched) return;
    mic.stop();
    playAnswer();
    const t = setTimeout(() => onAnsweredRef.current?.(wrongChoices.length ? 0.7 : 1), 2400);
    return () => clearTimeout(t);
  }, [matched]); // eslint-disable-line react-hooks/exhaustive-deps

  const reveal = () => {
    mic.stop();
    setRevealed(true);
    playAnswer();
  };

  const choices = useMemo(
    () => shuffle([{ text: question.keywords[0], correct: true }, ...question.decoys.map(d => ({ text: d, correct: false }))]),
    [question],
  );

  const tapChoice = (c) => {
    if (matched || revealed) return;
    if (c.correct) {
      sfxCorrect();
      celebrate('small');
      setMatched(true);
    } else {
      sfxWrong();
      setWrongChoices(w => [...w, c.text]);
    }
  };

  const showHelp = !matched && !revealed && (misses >= 2 || opens >= 3 || mic.state === 'error');
  const bubble = (matched || revealed) ? question.answer : question.text;

  return (
    <div className="tale-q">
      <Mascot mood={matched ? 'cheer' : 'think'} size={110} bubble={bubble} onBoop={playQuestion} />
      <button type="button" className="speaker-btn" onClick={matched || revealed ? playAnswer : playQuestion} aria-label="השמיעו שוב">🔊</button>

      {!matched && !revealed && (
        mic.supported ? (
          <>
            <button
              type="button"
              className={`mic-btn mic-btn--${mic.state}`}
              onClick={() => {
                if (mic.state !== 'listening') { sfxMicOpen(); setOpens(o => o + 1); }
                stopAudio();
                mic.toggle();
              }}
              aria-label="ענו בקול"
            >
              🎤
            </button>
            <div className="echo__status">
              {mic.state === 'listening' && 'מַקְשִׁיבִים... עֲנוּ בְּקוֹל!'}
              {mic.state === 'wrong' && 'הְממ... נַסּוּ לַעֲנוֹת שׁוּב 💪'}
              {mic.state === 'idle' && 'לַחֲצוּ עַל הַמִּיקְרוֹפוֹן וַעֲנוּ עַל הַשְּׁאֵלָה'}
              {mic.state === 'error' && 'הַמִּיקְרוֹפוֹן לֹא מַצְלִיחַ לְהַקְשִׁיב'}
            </div>
          </>
        ) : (
          <div className="tale-q__choices">
            {choices.map(c => (
              <button
                key={c.text}
                type="button"
                className={`text-opt ${wrongChoices.includes(c.text) ? 'text-opt--dim' : ''}`}
                onClick={() => tapChoice(c)}
              >
                {c.text}
              </button>
            ))}
          </div>
        )
      )}

      {showHelp && (
        <button type="button" className="big-btn big-btn--ghost" onClick={reveal}>
          🛟 עִזְרוּ לִי
        </button>
      )}

      {revealed && (
        <button type="button" className="big-btn big-btn--primary" onClick={() => onAnsweredRef.current?.(0.6)}>
          הָלְאָה ←
        </button>
      )}
    </div>
  );
}
