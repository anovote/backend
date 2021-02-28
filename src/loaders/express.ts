import { json, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routes from '@/api'

/**
 * Responsible for initializing Express
 */
export default ({ server }: { server: Application }) => {
  /**
   * Set various HTTP headers by enabling helmet. helmet() is
   * a wrapper around 11 smaller middlewares.
   * https://helmetjs.github.io/
   */
  server.use(helmet())
  /**
   * Enables cors on the server, so we can talk with
   * clients on different domains. Might be needing configuration later
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
   */
  server.use(cors())
  /**
   * Handles parsing of requests with type Application/JSON
   * so we can consume it on the request.
   */
  server.use(json())

  /**
   * Loads all application routes into express
   */
  server.use(routes)

  return server
}
