/**
 * Deep copies an object
 * @param ob object to copy
 */
export const deepCopy = <T>(ob: T) => {
    return JSON.parse(JSON.stringify(ob)) as T
}
