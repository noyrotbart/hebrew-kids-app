// Vocal commentary for the kid — short Hebrew phrases the host says back when
// they get something right or need to try again, plus narration that fills the
// quiet beats so kids are always immersed in spoken Hebrew.
//
// Most go through Web Speech (instant, no network) via `say()`. Keep phrases
// short (<2 seconds spoken) so they don't break the flow.

import { say } from './audio.js';
import { pick } from './util.js';

// ---- Reactive feedback ---------------------------------------------------

const PRAISE = ['כל הכבוד!', 'מצוין!', 'נהדר!', 'יפה מאוד!', 'בדיוק!', 'איזה יופי!'];
const TRY_AGAIN = ['כמעט, נסו שוב', 'עוד פעם', 'קרוב, נסו עוד', 'ניסיון יפה, עוד פעם'];

export const sayPraise   = () => say(pick(PRAISE));
export const sayTryAgain = () => say(pick(TRY_AGAIN));

// ---- Conversational narration --------------------------------------------

// Home greeting — said when the kid opens home.
export const sayHello = (name) => say(name ? `שלום ${name}!` : 'שלום!');

// Spoken when a lesson is entered — "Lesson 1: Alef, Bet, Gimel".
export const sayLessonIntro = (lesson) => {
  if (lesson.level === 'intermediate') {
    return say('סיפור חדש');
  }
  const letterNames = lesson.letters.map(l => stripQuotes(l.nameHe)).join(', ');
  return say(`שיעור ${lesson.number}. ${letterNames}.`);
};

// Spoken when a fresh flashcard appears — "This is the letter Alef".
export const sayLetterIntro = (letter) =>
  say(`זאת האות ${stripQuotes(letter.nameHe)}.`);

// Lesson done celebration — personalized.
const LESSON_DONE = (name) => name
  ? [`כל הכבוד ${name}!`, `נהדר ${name}!`, `מצוין ${name}!`, `יופי ${name}, סיימת!`]
  : ['כל הכבוד!', 'נהדר!', 'מצוין!', 'סיימנו!'];

export const sayLessonDone = (name) => say(pick(LESSON_DONE(name)));

// Quotation marks in stored Hebrew names like בֵּי"ת throw TTS off; strip them
// for spoken output. On-screen rendering keeps them intact.
function stripQuotes(s) { return s.replace(/["'״׳]/g, ''); }
