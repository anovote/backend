/* eslint-disable no-console */
/**
 * ANOVOTE BACKEND APPLICATION
 * This is the main entry of the application!
 * This is where anonymous voting starts 💻
 *
 * Let the ballots fly 🦄 🌈 🍭
 *
 * Developed by
 * - Sander Hurlen,
 * - Steffen Holanger,
 * - Emil Elton Nilsen,
 * - Christoffer Andersen Træen
 */
import express from 'express'
import config from '@/config'
import { load } from '@/loaders'
import { logger } from './loaders/logger'

console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

/**
 * Initial boot function... this is where magic starts
 */
async function boot() {
    try {
        const server = express()

        const app = await load({ server })

        server.listen(config.http.port, () => {
            console.log(`
            LISTENING ON 
               ${config.http.port}
              
=========  SERVER STARTED  =========
\n\n`)
        })
    } catch (error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
        logger.error(error)
    }
}

void boot() // Anovote is starting here
