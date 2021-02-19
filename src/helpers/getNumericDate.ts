/**
 * Generates a numeric date from now -> the passed
 * in time the token should be valid
 * @param validTime time a token is valid
 * @return date in numeric format
 */
export function getNumericDate(validTime: number): number {
  return Math.floor(Date.now() / 1000) + validTime
}
