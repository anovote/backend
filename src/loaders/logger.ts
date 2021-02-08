import winston from 'winston'
/**
 * Setsup Winston
 *
 * https://github.com/winstonjs/winston
 */

// Date format used in messages
const dateFormat = 'DD-MM-YYYY - HH:mm:ss'

// Transports for where to log
const transports = []

// Creates new transports
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.cli(), winston.format.splat())
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }),
  new winston.transports.File({
    filename: 'logs/all.log'
  })
)

// Initialize the logger instance
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: dateFormat
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
})

export { logger }
