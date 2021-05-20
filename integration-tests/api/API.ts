import supertest from 'supertest'
import config from '../../src/config'

export const request = supertest(`http://${config.http.host}:${config.http.port}`)
