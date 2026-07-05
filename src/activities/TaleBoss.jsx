// Dragon-land boss: six questions drawn from ALL the tales, answered by
// voice from memory. Each question shows which story it's from, with a
// replay button that retells that story sentence by sentence.

import { useEffect, useMemo, useRef, useState } from 'react';
import { TALES, sentenceClipId } from '../data/tales.js';
import { playClip, stopAudio } from '../lib/audio.js';
import { shuffle } from '../lib/util.js';
import ProgressDots from '../components/ProgressDots.jsx';
import TaleQuestion from './TaleQuestion.jsx';

const QUESTION_COUNT = 6;

export default function TaleBoss({ onDone }) {
  const questions = useMemo(
    () => shuffle(TALES.flatMap(tale => tale.questions.map(q => ({ tale, q })))).slice(0, QUESTION_COUNT),
    [],
  );
  const [qIdx, setQIdx] = useState(0);
  const scoresRef = useRef([]);
  const replayTokenRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => () => { replayTokenRef.current++; stopAudio(); }, []);

  const { tale, q } = questions[qIdx];

  const replayStory = async () => {
    const token = ++replayTokenRef.current;
    for (let i = 0; i < tale.sentences.length; i++) {
      if (replayTokenRef.current !== token) return;
      await playClip('tales', sentenceClipId(tale, i), tale.sentences[i]);
    }
  };

  const answered = (score) => {
    replayTokenRef.current++;
    scoresRef.current.push(score);
    if (qIdx + 1 >= questions.length) {
      const s = scoresRef.current;
      onDoneRef.current?.(s.reduce((a, b) => a + b, 0) / s.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  return (
    <div className="tale">
      <ProgressDots total={questions.length} done={qIdx} />
      <button type="button" className="tale__context" onClick={replayStory}>
        <span className="tale__context-emoji">{tale.emoji}</span>
        <span>
          <span className="tale__context-title">{tale.title}</span>
          <span className="tale__context-hint">🔊 לְהַשְׁמָעַת הַסִּפּוּר שׁוּב</span>
        </span>
      </button>
      <TaleQuestion key={`${tale.id}-${q.id}`} tale={tale} question={q} onAnswered={answered} />
    </div>
  );
}
