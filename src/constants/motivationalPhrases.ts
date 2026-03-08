const phrases = [
  "{name}, you're doing an amazing job!",
  "Every moment with your little one matters, {name}.",
  "Take a deep breath, {name} — you've got this.",
  "Small steps lead to big milestones.",
  "{name}, your love is the best gift.",
  "Today is a new day full of possibilities, {name}.",
  "You're exactly the parent your baby needs, {name}.",
  "Remember to take care of yourself too, {name}.",
  "Every day you're learning and growing together.",
  "Trust your instincts, {name} — they're stronger than you think.",
  "The little moments are the big moments.",
  "You're making beautiful memories every day, {name}.",
  "One day at a time, one smile at a time.",
  "{name}, your patience and love make all the difference.",
  "Celebrate the small wins today, {name}.",
  "You're not alone on this journey, {name}.",
  "Even on tough days, you're doing great, {name}.",
  "Your baby is so lucky to have you, {name}.",
  "Rest when you can, {name} — you deserve it.",
  "This phase won't last forever. Cherish it.",
];

export function getDailyPhrase(userName?: string): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
  const phrase = phrases[dayOfYear % phrases.length];
  return userName ? phrase.replace(/\{name\}/g, userName) : phrase.replace(/,?\s*\{name\},?/g, '');
}
