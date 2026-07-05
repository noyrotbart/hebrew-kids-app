// אֶרֶץ הַדְּרָקוֹן — a tale node. Phase 1: the story unfolds sentence by
// sentence like a storybook (each sentence plays as it appears; tap any line
// to hear it again). Phase 2: Draki asks free-form comprehension questions
// (TaleQuestion). Score = mean of the question scores; listening is free.

import { useEffect, useRef, useState } from 'react';
import { sentenceClipId } from '../data/tales.js';
import { playClip, stopAudio } from '../lib/audio.js';
import ProgressDots from '../components/ProgressDots.jsx';
import TaleQuestion from './TaleQuestion.jsx';

export default function TaleTime({ tale, onDone }) {
  const [phase, setPhase] = useState('listen'); // listen | qa
  const [sentIdx, setSentIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const scoresRef = useRef([]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (phase !== 'listen') return;
    playClip('tales', sentenceClipId(tale, sentIdx), tale.sentences[sentIdx]);
    return stopAudio;
  }, [sentIdx, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const answered = (score) => {
    scoresRef.current.push(score);
    if (qIdx + 1 >= tale.questions.length) {
      const s = scoresRef.current;
      onDoneRef.current?.(s.reduce((a, b) => a + b, 0) / s.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  if (phase === 'qa') {
    return (
      <div className="tale">
        <ProgressDots total={tale.questions.length} done={qIdx} />
        <div className="tale__banner tale__banner--small">{tale.emoji}</div>
        <TaleQuestion
          key={tale.questions[qIdx].id}
          tale={tale}
          question={tale.questions[qIdx]}
          onAnswered={answered}
        />
      </div>
    );
  }

  const lastSentence = sentIdx >= tale.sentences.length - 1;
  return (
    <div className="tale">
      <ProgressDots total={tale.sentences.length} done={sentIdx} />
      <div className="tale__banner">{tale.emoji}</div>
      <h2 className="tale__title">{tale.title}</h2>

      <div className="tale__book">
        {tale.sentences.slice(0, sentIdx + 1).map((s, i) => (
          <button
            key={i}
            type="button"
            className={`tale__sentence ${i === sentIdx ? 'tale__sentence--current' : ''}`}
            onClick={() => playClip('tales', sentenceClipId(tale, i), s)}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="big-btn big-btn--primary"
        onClick={() => (lastSentence ? setPhase('qa') : setSentIdx(sentIdx + 1))}
      >
        {lastSentence ? 'לַשְּׁאֵלוֹת! 🐉' : 'מָה קָרָה אָז? ←'}
      </button>
    </div>
  );
}
