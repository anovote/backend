const BASE = 'api'
const PUBLIC_PATH = (extra: string | number = '') => `/${BASE}/public/${extra}`
const ADMIN_PATH = (extra: string | number = '') => `/${BASE}/admin/${extra}`
const VOTER_PATH = (extra: string | number = '') => `/${BASE}/voter/${extra}`
//
// PUBLIC
const AUTH_PATH = (extra: string | number = '') => PUBLIC_PATH(`auth/${extra}`)
const PUBLIC = {
    REGISTER: AUTH_PATH('register'),
    LOGIN: AUTH_PATH('login'),
    AUTHENTICATED: AUTH_PATH('authenticated')
}
//
// VOTER
const VOTER = {}
// export const VOTER_PATH = (extra: string | number = '') => PUBLIC_PATH(`auth/${extra}`)

// ADMIN
const ADMIN = {
    ORGANIZER: (extra: string | number = '') => ADMIN_PATH(`electionorganizer/${extra}`)
}

export const PATHS = {
    PUBLIC,
    VOTER,
    ADMIN
}
