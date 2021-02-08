import dotenv from 'dotenv'

dotenv.config()

/* Node runtime enviroment state */
const environments = {
  development: 'development',
  test: 'test',
  production: 'production'
}
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : environments.development

// Verify the runtime environment for node
if (!Object.values(environments).find((val) => environment === val)) {
  throw new Error(
    `${environment} is not a valid runtime environment\nPlease set NODE_ENV to either ${[
      ...Object.values(environments)
    ]}`
  )
}

// The src folder where the project will be when in dev / prduction
const src = environment === environments.development || environment === environments.test ? 'src' : 'dist'

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
  secret: process.env.SECRET,
  environment,
  src
}
