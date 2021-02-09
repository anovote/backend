import * as bodyParser from 'body-parser'
import { NextFunction } from 'connect'

export function enforceContentType(next: NextFunction) {
  bodyParser.json({ type: 'application/json' })
  next()
}
