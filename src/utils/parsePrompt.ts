import parseTime, { TimeMatch } from './parseTime';

const PROMPT_PHRASES = ['remind me to', 'I need to', 'I have to'];
const promptRE = new RegExp(`^(${PROMPT_PHRASES.join('|')})\\s+`, 'i');

export interface PromptMatch {
  prompt: string | null;
  rest: string;
  time: TimeMatch | null;
}

// Gets all the polite bullshit out of the way
// Makes this seem more human
export default function matchPrompt(input: string): PromptMatch {
  let rest = input;

  const promptMatch = input.match(promptRE);
  if (promptMatch !== null) {
    rest = rest.replace(promptMatch[0], '');
  }

  const time = parseTime(rest);
  if (time !== null) {
    rest = rest.replace(new RegExp(`${time.matched}$`), '');
  }

  return { rest, prompt: promptMatch ? promptMatch[0] : null, time };
}
