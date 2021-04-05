import { ElectionStatus } from './ElectionStatus'
import { IElectionBase } from './IElectionBase'

/**
 * Class implementation of IElectionBase.
 * Acting as a DTO class and is not to be instantiated manually (private constructor)
 */
export class ElectionBaseDTO implements IElectionBase {
    title!: string
    description!: string
    image?: string | undefined
    openDate?: Date | undefined
    closeDate?: Date | undefined
    isLocked!: boolean
    status!: ElectionStatus
    isAutomatic!: boolean

    private constructor() {
        // Private constructor
    }
}
