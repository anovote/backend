import { ElectionStatus } from './ElectionStatus'

export interface Election {
  id: number
  electionOrganizer: string
  title: string
  description: string
  image?: string
  openDate?: Date
  closeDate?: Date
  password: string
  status: ElectionStatus
  isLocked: boolean
  isAutomatic: boolean
  created?: Date
  updated?: Date
}
