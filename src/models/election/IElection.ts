import { ElectionOrganizer } from '../entity/ElectionOrganizer'
import { ElectionStatus } from './ElectionStatus'

export interface IElection {
  id: number
  electionOrganizer: ElectionOrganizer
  title: string
  description: string
  image?: string
  openDate?: Date
  closeDate?: Date
  password: string
  status: ElectionStatus
  isLocked: boolean
  isAutomatic: boolean
}
