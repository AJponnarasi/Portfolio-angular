/** Career start date — the single source for every "years of experience" figure on the site. */
export const CAREER_START = new Date(2019, 8, 1); // Sep 2019

/** Whole years of experience as of `now`. */
export function yearsOfExperience(now: Date = new Date()): number {
  return Math.floor((now.getTime() - CAREER_START.getTime()) / (365.25 * 24 * 3600 * 1000));
}
