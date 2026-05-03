// Vocal commentary for the kid — short Hebrew phrases the host says back when
// they get something right or need to try again. Picked at random for variety.
//
// Keep these short (<2 seconds spoken) so they don't break the flow.

import { say } from './audio.js';
import { pick } from './util.js';

const PRAISE = ['כל הכבוד!', 'מצוין!', 'נהדר!', 'יפה מאוד!', 'בדיוק!', 'איזה יופי!'];
const TRY_AGAIN = ['כמעט, נסו שוב', 'עוד פעם', 'קרוב, נסו עוד', 'ניסיון יפה, עוד פעם'];
const LESSON_DONE = (name) => name
  ? [`כל הכבוד ${name}!`, `נהדר ${name}!`, `מצוין ${name}!`]
  : ['כל הכבוד!', 'נהדר!', 'מצוין!'];

export const sayPraise   = () => say(pick(PRAISE));
export const sayTryAgain = () => say(pick(TRY_AGAIN));
export const sayLessonDone = (name) => say(pick(LESSON_DONE(name)));
