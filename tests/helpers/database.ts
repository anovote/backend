import typeorm from '@/loaders/typeorm'
import { Connection } from 'typeorm'

/**
 * Provides an instance of a typeORM connection
 */
export const getTestDatabase = async (): Promise<Connection> => {
  return await typeorm()
}
