import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'

export interface IHasOwner<T> {
    owner: ElectionOrganizer
    /**
     * Verifies the that the owner owns the entity
     * @param entity the entity to check owner of
     * @returns nothing if verified, throws error if not
     */
    verifyOwner(entity: T): void
}
