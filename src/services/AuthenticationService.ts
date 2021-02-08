import { ElectionOrganizer } from '@/models/entity/ElectionOrganizer'
import { sign, verify } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { EncryptionService } from './EncryptionService'
import config from '@/config'

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
 * Required properties for login payload
 */
interface LoginPayload {
  email: string
  password: string
}

/**
 * Handles the generation and verification of tokens.
 */
export class AuthenticationService {
  private readonly defaultExpirationTime = '48h'
  private encryptionService: EncryptionService

  constructor() {
    this.encryptionService = new EncryptionService()
  }

  /**
   * Tries to login a user with provided payload, before returing the token if it was successful
   * @param ctx the context passed from a router, typically
   * @return token, the token for the logged in user
   * ! TODO throw more meaningful errors
   */
  async login(payload: LoginPayload): Promise<string> {
    let electionOrg: ElectionOrganizer | undefined

    electionOrg = await getRepository(ElectionOrganizer).findOne({
      email: payload.email
    })

    if (!electionOrg) throw new Error('No election organizer found')

    const passwordMatches = await this.encryptionService.comparePasswords(payload.password, electionOrg.password)

    if (!passwordMatches) throw new Error('Password is not matching')

    return await this.generateToken({
      id: electionOrg.id,
      organizer: true
    })
  }

  /**
   * Generates a token based on a payload and secret key.
   * @param options Authentication token options to generate a token from.
   */
  async generateToken(options: AuthTokenOptions): Promise<string> {
    return sign(
      {
        ...options
      },
      config.secret!,
      { expiresIn: this.defaultExpirationTime }
    )
  }

  /**
   * Verifies the token to authenticate user.
   * @param authorizationSchema the authorization header provided along with request. Default schema is 'Bearer <token>'
   * @returns the payload object or string from the request
   */
  async verifyToken(authorizationSchema: string | undefined): Promise<DecodedTokenValue> {
    if (!authorizationSchema) {
      throw new Error('No authorization header provided')
    }
    const token = this.getBearerToken(authorizationSchema)

    if (!token) throw new Error('No token found on given schema')

    const decoded = verify(token, config.secret!) as DecodedTokenValue

    if (!decoded) throw new Error('Token is invalid. The source can not be trusted')

    return decoded
  }

  /**
   * Extracts the token from the bearer schema.
   * Schema:
   * Bearer <token>
   * @param bearerSchema the string from header containing the token
   * @returns token with bearer prefix
   */
  private getBearerToken(bearerSchema: string): string {
    return bearerSchema.split(' ')[1]
  }
}
