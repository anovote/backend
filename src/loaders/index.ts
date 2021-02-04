/**
 * Entry loader
 *
 * Responsible for loading all modules which must be initialized
 * for application to work.
 */
import { Application } from 'express'

import expressLoader from '@/loaders/express'
import typeormLoader from '@/loaders/typeorm'

export const load = async ({ server }: { server: Application }) => {
  console.log('--- loading express 🧬')
  const loadedExpress = await expressLoader({ server })
  console.log('----- express loaded ✅')

  console.log('--- loading typeORM 🧬')
  const loadedTypeOrm = await typeormLoader()
  console.log('---- typeORM loaded ✅')
}
