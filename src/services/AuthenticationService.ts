import config from '@/config'
import { UnauthorizedError } from '@/lib/errors/http/UnauthorizedError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { sign, verify } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { EncryptionService } from './EncryptionService'

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
   * Generates a token from a given id and returns the token
   * @param id, the id to create a token from
   */
  async generateTokenFromId(id: number): Promise<string> {
    return await this.generateToken({
      id: id,
      organizer: true
    })
  }

  /**
   * Tries to login a user with provided payload, before returning the token if it was successful
   * @param ctx the context passed from a router, typically
   * @return token, the token for the logged in user
   */
  async login(payload: LoginPayload): Promise<string | undefined> {
    const electionOrg = await getRepository(ElectionOrganizer).findOne({
      email: payload.email
    })

    if (!electionOrg) return
    const passwordMatches = await this.encryptionService.compareAgainstHash(payload.password, electionOrg.password)
    if (!passwordMatches) return
    return await this.generateTokenFromId(electionOrg.id)
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
      throw new UnauthorizedError({ message: ServerErrorMessage.noAuthorizationHeader() })
    }
    const token = this.getBearerToken(authorizationSchema)

    if (!token) throw new UnauthorizedError({ message: ServerErrorMessage.invalidTokenFormat() })

    const decoded = verify(token, config.secret!) as DecodedTokenValue

    if (!decoded) throw new UnauthorizedError({ message: ServerErrorMessage.invalidToken() })

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
