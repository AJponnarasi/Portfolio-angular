import { CAREER_START, yearsOfExperience } from './career';

describe('career', () => {
  it('should start in September 2019', () => {
    expect(CAREER_START.getFullYear()).toBe(2019);
    expect(CAREER_START.getMonth()).toBe(8);
  });

  it('should count whole years only', () => {
    expect(yearsOfExperience(new Date(2026, 7, 31))).toBe(6);
    expect(yearsOfExperience(new Date(2026, 8, 2))).toBe(7);
    expect(yearsOfExperience(new Date(2026, 10, 23))).toBe(7);
  });
});
