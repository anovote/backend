import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsEarlierThan(property: string, validationOptions?: ValidationOptions) {
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
          if (!value && !relatedValue) return true
          return value <= relatedValue // you can return a Promise<boolean> here as well, if you want to make async validation
        }
      }
    })
  }
}
