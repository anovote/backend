import { deepCopy } from '@/helpers/object'
import { classToClass, plainToClass } from 'class-transformer'

// Type to be able to pass Class types as arguments
type ClassConstructor<T> = {
    new (...args: unknown[]): T
}
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
/**
 * Copies fields from data object to a new instance object of the type provided to instance.
 *
 * It will exclude all extra fields that are not part of the instance object type (requires that the instance
 * object is annotated with classTransform @expose on all fields that is to be visible).
 *
 * An option can be set to allow undefined/null values to be copied, this defaults to false> e.g.
 * undefined and null values wil no be available on the instance object as default.
 *
 * It uses plainToClass from classTransforms to perform the copying.
 * @param instance the instance type to create
 * @param data the date to be copied over to instance
 * @param options options for copy
 * @returns returns an instance of the provided instance type
 */
export function jsonToObject<T>(
    instance: ClassConstructor<T>,
    data: unknown,
    options: { keepEmpty?: boolean } = { keepEmpty: false }
) {
    return plainToClass(instance, data, {
        excludeExtraneousValues: true,
        exposeUnsetFields: options.keepEmpty
    })
}

/**
 * Copies fields from source object to a instance object provided.
 *
 * It will exclude all extra fields that are not part of the instance object type (requires that the instance
 * object is annotated with classTransform @expose on all fields that is to be visible).
 *
 * An option can be set to allow undefined/null values to be copied, this defaults to false> e.g.
 * undefined and null values wil no be available on the instance object as default.
 *
 * It uses classToClass from classTransforms to perform the copying.
 * @param instance the instance type to create
 * @param source the source object to be copied over to instance
 * @param options options for copy
 * @returns returns an instance of the provided instance type
 */
export function objectToObject<T>(target: T, source: unknown, options: { keepEmpty?: boolean } = { keepEmpty: false }) {
    return classToClass(Object.assign(target, source), {
        excludeExtraneousValues: true,
        exposeUnsetFields: options.keepEmpty
    })
}
