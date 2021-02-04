import dotenv from 'dotenv'

dotenv.config()

export default {
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        db: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    },
    http:{
        port: process.env.HTTP_PORT
    }
}