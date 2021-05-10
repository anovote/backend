import supertest from 'supertest'
import config from '../../src/config'

// TODO: Fix URL
export const request = supertest('http://127.0.0.1:' + config.http.port)
