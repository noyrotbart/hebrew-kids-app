import confetti from 'canvas-confetti';

export const celebrate = (level = 'small') => {
  if (level === 'small') {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFB930', '#FF7A59', '#3DB7B0', '#7C5CFF'],
    });
  } else if (level === 'big') {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#FFB930', '#FF7A59', '#3DB7B0', '#7C5CFF', '#3FB87E'],
    });
    setTimeout(() => confetti({
      particleCount: 80,
      spread: 100,
      angle: 60,
      origin: { x: 0.1, y: 0.6 },
    }), 200);
    setTimeout(() => confetti({
      particleCount: 80,
      spread: 100,
      angle: 120,
      origin: { x: 0.9, y: 0.6 },
    }), 400);
  }
};
