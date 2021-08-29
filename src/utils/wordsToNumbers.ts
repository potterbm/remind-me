export const Small = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

export const Magnitude = {
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
  quadrillion: 1000000000000000,
  quintillion: 1000000000000000000,
  sextillion: 1000000000000000000000,
  septillion: 1000000000000000000000000,
  octillion: 1000000000000000000000000000,
  nonillion: 1000000000000000000000000000000,
  decillion: 1000000000000000000000000000000000,
};

export default function wordsToNumbers(input: string): number {
  if (/\d+/.test(input.trim())) {
    return parseInt(input.trim());
  }

  const allWords = input.split(/[\s-]+/);
  let numberSoFar = 0;
  let numberWithoutMagnitude = 0;

  allWords.forEach((word) => {
    const small = Small[word as keyof typeof Small] as number | undefined;
    if (small) {
      numberWithoutMagnitude += small;
    } else if (word === 'hundred' && numberWithoutMagnitude !== 0) {
      numberWithoutMagnitude *= 100;
    } else {
      const magnitude = Magnitude[word as keyof typeof Magnitude] as number | undefined;

      if (magnitude) {
        numberSoFar += numberWithoutMagnitude * magnitude;
      } else {
        console.error('uknown number: ', magnitude);
      }
    }
  });

  return numberSoFar + numberWithoutMagnitude;
}
