/**
 * Deep copies an object
 * @param ob object to copy
 */
export const deepCopy = <T>(ob: object) => {
  return JSON.parse(JSON.stringify(ob)) as T
}
