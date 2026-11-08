/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately tiny: this project has no conflicting-utility problem to solve,
 * because variant styles are chosen with lookup maps rather than by appending
 * overrides. If two utilities ever do fight, fix the variant map, not the merge.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}
