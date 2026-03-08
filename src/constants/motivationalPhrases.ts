const phrases = [
  "You're doing an amazing job!",
  "Every moment with your little one matters.",
  "Take a deep breath — you've got this.",
  "Small steps lead to big milestones.",
  "Your love is the best gift.",
  "Today is a new day full of possibilities.",
  "You're exactly the parent your baby needs.",
  "Remember to take care of yourself too.",
  "Every day you're learning and growing together.",
  "Trust your instincts — they're stronger than you think.",
  "The little moments are the big moments.",
  "You're making beautiful memories every day.",
  "One day at a time, one smile at a time.",
  "Your patience and love make all the difference.",
  "Celebrate the small wins today.",
  "You're not alone on this journey.",
  "Even on tough days, you're doing great.",
  "Your baby is so lucky to have you.",
  "Rest when you can — you deserve it.",
  "This phase won't last forever. Cherish it.",
];

export function getDailyPhrase(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
  return phrases[dayOfYear % phrases.length];
}
