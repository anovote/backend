import dotenv from 'dotenv'

dotenv.config()

/* Node runtime enviroment state */
const development = 'development'
const production = 'production'
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : development

// Verify the runtime environment for node
if (environment != development && environment != production) {
  throw new Error(
    `${environment} is not a valid runtime environment\nPlease set NODE_ENV to either ${development}/${production}`
  )
}

export default {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },
  http: {
    port: process.env.HTTP_PORT
  },
  environment,
  src: environment === 'development' ? 'src' : 'dist'
}
