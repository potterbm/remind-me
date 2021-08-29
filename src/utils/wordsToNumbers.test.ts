import wordsToNumbers, { Small } from './wordsToNumbers';

describe('wordsToNumbers', () => {
  it('should translate individual numbers', () => {
    Object.keys(Small).forEach((word) => {
      expect(wordsToNumbers(word)).toBe(Small[word as keyof typeof Small]);
    });
  });
});
