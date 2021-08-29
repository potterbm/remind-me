import moment, { DurationInputArg2 } from 'moment';
import wordsToNumbers, { Small as basicNumbers } from '../wordsToNumbers';

const UNITS = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

const DAY_OF_WEEK = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
} as const;

type DayOfWeek = keyof typeof DAY_OF_WEEK;

/*
 * Usage: 'something {unit}'
 */
function buildRegex(pattern: string): RegExp {
  let reString = pattern;
  reString = reString.replace('{unit}', `(?<unit>${UNITS.join('|')})s?`);
  reString = reString.replace(
    '{number}',
    `(?<number>\\d+|(?:(?:${Object.keys(basicNumbers).join('|')})\\s*)+)`
  );

  return new RegExp(reString, 'i');
}

type ISO8601String = string;

export interface TimeMatch {
  date: ISO8601String;
  unit: string;
  matched: string;
}

function matchSpecialRelativeTime(input: string): TimeMatch | null {
  const nextUnitRE = buildRegex('next {unit}\\s*$');
  const nextUnitMatch = input.match(nextUnitRE);
  if (nextUnitMatch !== null) {
    const { unit } = nextUnitMatch.groups as unknown as { unit: DurationInputArg2 };
    return {
      date: moment().add(1, unit).toISOString(),
      unit,
      matched: nextUnitMatch[0],
    };
  }

  const inUnitsRE = buildRegex('in {number} {unit}');
  const inUnitsMatch = input.match(inUnitsRE);
  if (inUnitsMatch !== null) {
    const { unit, number } = inUnitsMatch.groups as unknown as {
      number: string;
      unit: DurationInputArg2;
    };

    return {
      date: moment().add(wordsToNumbers(number), unit).toISOString(),
      unit,
      matched: inUnitsMatch[0],
    };
  }

  const tomorrowMatch = input.match(/tomorrow\s*$/i);
  if (tomorrowMatch !== null) {
    return {
      date: moment().add(1, 'day').toISOString(),
      unit: 'day',
      matched: tomorrowMatch[0],
    };
  }

  return null;
}

function matchWeekday(input: string): TimeMatch | null {
  const dayOfWeekRE = new RegExp(
    `(?:on\\s+|next\\s+)?(?<day>${Object.keys(DAY_OF_WEEK).join('|')})`
  );
  const dayOfWeekMatch = input.match(dayOfWeekRE);
  if (dayOfWeekMatch === null) return null;

  const { day } = dayOfWeekMatch.groups as unknown as { day: DayOfWeek };
  const currentWeekday = moment().isoWeekday();
  const desiredWeekday = DAY_OF_WEEK[day];
  const daysFromNow = (desiredWeekday - currentWeekday + 7) % 7;

  let date = moment().add(daysFromNow).toISOString();
  if (daysFromNow === 0) date = moment().add(1, 'week').toISOString();

  return {
    date,
    unit: 'day',
    matched: dayOfWeekMatch[0],
  };
}

function matchRelativeTime(input: string): TimeMatch | null {
  const relativeTimeRE = buildRegex('in (?<number>\\d) {unit}\\s*$');
  const match = input.match(relativeTimeRE);

  if (match === null) return null;

  const { number, unit } = match.groups as unknown as { number: string; unit: DurationInputArg2 };

  return {
    date: moment().add(wordsToNumbers(number), unit).toISOString(),
    unit,
    matched: match[0],
  };
}

export default function parseTime(input: string): TimeMatch | null {
  const specialRelativeTimeMatch = matchSpecialRelativeTime(input);
  if (specialRelativeTimeMatch !== null) return specialRelativeTimeMatch;

  const weekdayMatch = matchWeekday(input);
  if (weekdayMatch !== null) return weekdayMatch;

  const relativeTimeMatch = matchRelativeTime(input);
  if (relativeTimeMatch !== null) return relativeTimeMatch;

  return null;
}
