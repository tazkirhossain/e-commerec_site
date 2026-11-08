/**
 * Formatting for Bangladeshi retail (DS-CNT-04, NFR-I18N-01).
 *
 * Money is held everywhere as a whole number of taka — never a float, never a
 * pre-formatted string (Software SRS §4.2). Format at the edge, in the view.
 */

const TAKA = "৳";

/**
 * Groups digits the South Asian way: last three, then twos.
 * 164999 -> "1,64,999"   ·   2749999 -> "27,49,999"   ·   999 -> "999"
 */
export function groupLakh(value: number): string {
  const negative = value < 0;
  const digits = Math.round(Math.abs(value)).toString();

  let grouped: string;
  if (digits.length <= 3) {
    grouped = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    // Walk the leading digits in pairs, from the right.
    const pairs: string[] = [];
    for (let i = rest.length; i > 0; i -= 2) {
      pairs.unshift(rest.slice(Math.max(0, i - 2), i));
    }
    grouped = `${pairs.join(",")},${last3}`;
  }

  return negative ? `-${grouped}` : grouped;
}

/** 164999 -> "৳ 1,64,999". Whole taka, no decimals (FR-PAY-06). */
export function formatTaka(value: number): string {
  return `${TAKA} ${groupLakh(value)}`;
}

/** A deduction, shown with a true minus sign: "− ৳ 10,000". */
export function formatDeduction(value: number): string {
  return `− ${formatTaka(Math.abs(value))}`;
}

/** "Save ৳ 10,000" — the savings line on a sale price (DS-CMP-PRICE). */
export function formatSaving(regular: number, sale: number): string {
  return `Save ${formatTaka(regular - sale)}`;
}

/** Discount as a whole percent, floored so we never overstate it. */
export function discountPercent(regular: number, sale: number): number {
  if (regular <= 0 || sale >= regular) return 0;
  return Math.floor(((regular - sale) / regular) * 100);
}

/** Per-month EMI instalment, rounded up to the whole taka. */
export function monthlyInstalment(
  total: number,
  months: number,
  annualRatePercent = 0,
): number {
  if (months <= 0) return total;
  if (annualRatePercent === 0) return Math.ceil(total / months);

  const monthlyRate = annualRatePercent / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.ceil((total * monthlyRate * factor) / (factor - 1));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "04 Nov 2026" — the one date format on the site (DS-CNT-04). */
export function formatDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");
  return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Bangladesh national format: "01712-345678". */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").replace(/^88/, "");
  if (digits.length !== 11) return input;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** "4.9" — one decimal, so ratings never render as "4.900000001". */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

/** "212 reviews" / "1 review" — never "1 reviews". */
export function formatReviewCount(count: number): string {
  return `${groupLakh(count)} ${count === 1 ? "review" : "reviews"}`;
}

/** Compact review count for cards: "(212)". */
export function formatReviewCountShort(count: number): string {
  return `(${groupLakh(count)})`;
}

/** "3 items" / "1 item". */
export function formatItemCount(count: number): string {
  return `${groupLakh(count)} ${count === 1 ? "item" : "items"}`;
}

/** Reward points: "1,250 points". */
export function formatPoints(points: number): string {
  return `${groupLakh(points)} ${points === 1 ? "point" : "points"}`;
}
