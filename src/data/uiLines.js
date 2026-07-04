// Every scripted host line in the app, with a stable id. All of these are
// pre-baked to public/audio/ui/{id}.mp3 by scripts/fetch-audio-edge.mjs using
// the he-IL-AvriNeural MALE voice — the app never falls back to a female
// device voice (see audio.js sayLine).

import { pick } from '../lib/util.js';

export const UI_LINES = [
  // Praise — after correct answers / node completion
  { id: 'praise-1', text: 'כָּל הַכָּבוֹד!' },
  { id: 'praise-2', text: 'מְעוּלֶה!' },
  { id: 'praise-3', text: 'אֵיזֶה יֹפִי!' },
  { id: 'praise-4', text: 'נָכוֹן מְאוֹד!' },
  { id: 'praise-5', text: 'וָואוּ, מַדְהִים!' },
  { id: 'praise-6', text: 'אַלּוּפִים!' },

  // Cheer — end-of-node celebration
  { id: 'cheer-1', text: 'סִיַּמְתֶּם! אֵיזֶה כֵּיף!' },
  { id: 'cheer-2', text: 'אֵיזֶה אַלּוּפִים אַתֶּם!' },
  { id: 'cheer-3', text: 'מְדַלְיַת זָהָב!' },

  // Retry — gentle nudge
  { id: 'retry-1', text: 'כִּמְעַט! עוֹד נִסָּיוֹן' },
  { id: 'retry-2', text: 'נַסּוּ שׁוּב, אַתֶּם יְכוֹלִים' },

  // Profile greetings
  { id: 'greeting-alma', text: 'שָׁלוֹם עַלְמָה! בּוֹאוּ נְשַׂחֵק' },
  { id: 'greeting-max',  text: 'שָׁלוֹם מַקְס! בּוֹאוּ נְשַׂחֵק' },
  { id: 'greeting-noah', text: 'שָׁלוֹם נֹחַ! בּוֹאוּ נְשַׂחֵק' },

  // Dragon boop
  { id: 'hello', text: 'שָׁלוֹם! אֲנִי דְּרָקִי!' },

  // Final-form letter names (Story Mountain)
  { id: 'final-kaf',   text: 'כַף סוֹפִית' },
  { id: 'final-mem',   text: 'מֵם סוֹפִית' },
  { id: 'final-nun',   text: 'נוּן סוֹפִית' },
  { id: 'final-pe',    text: 'פֵא סוֹפִית' },
  { id: 'final-tsadi', text: 'צָדִי סוֹפִית' },
];

export const LINE_BY_ID = Object.fromEntries(UI_LINES.map(l => [l.id, l]));

const byPrefix = (p) => UI_LINES.filter(l => l.id.startsWith(p));

export const praiseLine = () => pick(byPrefix('praise-'));
export const cheerLine = () => pick(byPrefix('cheer-'));
export const retryLine = () => pick(byPrefix('retry-'));
export const finalLine = (baseId) => LINE_BY_ID[`final-${baseId}`];
export const greetingLine = (profileId) => LINE_BY_ID[`greeting-${profileId}`];
