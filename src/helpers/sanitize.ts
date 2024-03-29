import { deepCopy } from '@/helpers/object'

/**
 * Strip the target object for keys provided in array.
 * It does not alter the original object and returns a new
 * altered object. If the target is not a valid Object type,
 * returns undefined. Not valid Object may be string, number, array etc...
 *
 * @param target target object to strip key values from
 * @param keysToStrip array of keys to strip from target
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const strip = <T extends object>(target: T, keysToStrip: Array<string>): T | undefined => {
    if (target instanceof Object && !Array.isArray(target)) {
        const newTarget = deepCopy(target) as { [key: string]: unknown }
        for (const key of keysToStrip) {
            delete newTarget[key]
        }
        return newTarget as T
    }
}
