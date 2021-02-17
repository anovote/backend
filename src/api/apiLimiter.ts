import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Request limit reached',
  headers: true
})
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again later',
  headers: true
})
