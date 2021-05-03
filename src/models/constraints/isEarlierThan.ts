import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import { compareDesc, parseISO } from 'date-fns'

export function IsEarlierThan(property: string, validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEarlierThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = (args.object as any)[relatedPropertyName]

                    if (!value || !relatedValue) return true

                    // Compare the two dates and return -1 if the first date is after the second
                    const compared = compareDesc(parseISO(value), parseISO(relatedValue))

                    return compared !== -1 // you can return a Promise<boolean> here as well, if you want to make async validation
                }
            }
        })
    }
}
