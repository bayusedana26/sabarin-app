const INDONESIAN_SWEAR_WORDS = [
  'anjing', 'babi', 'ngentot', 'ngentod', 'pukimak', 'asu', 'bangsat', 'kontol', 
  'memek', 'jembut', 'tahi', 'tai', 'bajingan', 'goblok', 'tolol', 'monyet', 
  'kampret', 'kirik', 'kunyuk', 'perek', 'lonte', 'jablay', 'pantek', 'peler', 
  'itil', 'bego', 'dajjal', 'setan', 'iblis', 'keparat'
];

const ENGLISH_SWEAR_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 
  'bastard', 'motherfucker', 'faggot', 'nigger', 'retard'
];

const ALL_SWEAR_WORDS = [...INDONESIAN_SWEAR_WORDS, ...ENGLISH_SWEAR_WORDS];

export function filterProfanity(text: string): string {
  let filteredText = text;

  ALL_SWEAR_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, (match) => {
      if (match.length <= 2) return match;
      const firstChar = match[0];
      const lastChar = match[match.length - 1];
      const middle = '*'.repeat(match.length - 2);
      return `${firstChar}${middle}${lastChar}`;
    });
  });

  return filteredText;
}
