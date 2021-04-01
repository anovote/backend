import { ElectionStatus } from './ElectionStatus'

/**
 * Represents the basis for an election, this representation
 * is minimum requirements for displaying information of an election and contains no
 * sensitive information
 */
export interface IElectionBase {
    title: string
    description: string
    openDate?: Date
    closeDate?: Date
    isLocked: boolean
    status: ElectionStatus
    isAutomatic: boolean
}
