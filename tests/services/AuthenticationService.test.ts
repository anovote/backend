import { AuthenticationService, AuthTokenOptions, DecodedTokenValue } from '../../src/services/AuthenticationService'

describe('authentication service', () => {
  let token: string, decoded: DecodedTokenValue, createBearerSchema: string, tokenData: AuthTokenOptions

  beforeAll(async () => {
    let authenticationService = new AuthenticationService()
    tokenData = { id: 1, organizer: true }
    token = await authenticationService.generateToken(tokenData)
    createBearerSchema = `Bearer ${token}`
    decoded = await authenticationService.verifyToken(createBearerSchema)
  })

  it('should return a defined token', () => {
    expect(token).toBeDefined()
  })

  it('should set token expires in 48 hours', () => {
    const diff = 48 * 60 * 60 // 48h
    expect(diff).toBeCloseTo(decoded.exp - decoded.iat, 1)
  })

  it('should be decoded to its original data', () => {
    const { id, organizer } = decoded
    expect({ id, organizer }).toEqual(tokenData)
  })
})
