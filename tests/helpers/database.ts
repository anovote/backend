import typeorm from '@/loaders/typeorm'

/**
 * Provides an instance of a typeORM connection
 */
export const getTestDatabase = async () => {
  return await typeorm()
}
