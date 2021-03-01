import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Request limit reached',
    headers: true
})
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Try again later',
    headers: true
})

export const rateLimits = {
    apiLimiter,
    loginLimiter
}
