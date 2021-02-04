/**
 * Entry loader
 *
 * Responsible for loading all modules which must be initialized
 * for application to work.
 */
import { Application } from 'express'

import expressLoader from '@/loaders/express'

export const load = async ({ server }: { server: Application }) => {
  const loadedExpress = await expressLoader({ server })
}
