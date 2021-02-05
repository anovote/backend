import { config } from 'dotenv'
import { sign, verify } from 'jsonwebtoken'
config()

/**
 * Required properties to pass along to generate a token
 */
export interface AuthTokenOptions {
  id: number
  organizer: boolean
}

/**
 * Time/date properties provided together with the decoded value
 */
export interface DecodedTokenValue extends AuthTokenOptions {
  iat: number
  exp: number
}

/**
 * Handles the generation and verification of tokens.
 */
export class AuthenticationService {
  private readonly defaultExpirationTime = '48h'

  /**
   * Generates a token based on a payload and secret key.
   * @param options Authentication token options to generate a token from.
   */
  async generateToken(options: AuthTokenOptions): Promise<string> {
    const payload = {
      ...options
    }

    return sign(
      {
        ...options
      },
      process.env.SECRET!,
      { expiresIn: this.defaultExpirationTime }
    )
  }

  /**
   * Verifies the token to authenticate user.
   * @param authorizationSchema the authorization header provided along with request. Default schema is 'Bearer <token>'
   * @returns the payload object or string from the request
   */
  async verifyToken(authorizationSchema: string | null): Promise<DecodedTokenValue> {
    if (!authorizationSchema) {
      throw new Error('No authorization header provided')
    }
    const token = this.getBearerToken(authorizationSchema)

    if (!token) throw new Error('No token found on given schema')

    const decoded = verify(token, process.env.SECRET!) as DecodedTokenValue

    if (!decoded) throw new Error('Token is invalid. The source can not be trusted')

    return decoded
  }

  /**
   * Generates a numeric date from now -> the passed
   * in time the token should be valid
   * @param validtime time a token is valid
   */
  getNumericDate(validTime: number): number {
    return Math.floor(Date.now() / 1000) + validTime
  }

  /**
   * Extracts the token from the bearer schema.
   * Schema:
   * Bearer <token>
   * @param bearerSchema the string from header containing the token
   * @returns token with bearer prefix
   */
  getBearerToken(bearerSchema: string): string {
    return bearerSchema.split(' ')[1]
  }
}
