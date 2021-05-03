import { ValidationErrorMessage } from '@/lib/errors/messages/ValidationErrorMessages'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'
import { getRepository } from 'typeorm'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'

@ValidatorConstraint({ async: true })
export class IsElectionOrganizerUniqueConstraint implements ValidatorConstraintInterface {
    async validate(email: string, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints
        const ownerId: number = (args.object as any)[relatedPropertyName]

        const electionOrganizer = await getRepository(ElectionOrganizer).findOne({ email: email })

        // if an election organizer was found, and the owner is not this organizer, return false
        if (electionOrganizer && electionOrganizer.id != ownerId) return false
        return true
    }

    defaultMessage() {
        return ValidationErrorMessage.alreadyExists('Email')
    }
}

export function IsElectionOrganizerUnique(property: string, validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: object, propertyName: string) {
        registerDecorator({
            async: true,
            name: 'IsElectionOrganizerAlreadyExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsElectionOrganizerUniqueConstraint
        })
    }
}
