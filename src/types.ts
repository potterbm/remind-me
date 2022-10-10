type ISO8601String = string;

export interface Reminder {
  input: string;
  prompt: string | null;
  reminder: string;
  time: ISO8601String;
}
