import {
  config,
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "../deps.ts";

/**
 * the required properties to pass along to generate a token
 */
export interface AuthTokenOptions {
  id: number;
  organizer: boolean;
}

/**
 * Handles the generation and verification of tokens. 
 */
export class AuthenticationService {
  private readonly header: Header = { alg: "HS512", typ: "JWT" };
  private readonly defaultExpirationTime = 2 * 60 * 60;

  constructor() {
  }

  /**
   * Generates a token based on a payload and secret key.
   * @param options Authentication token options to generate a token from. 
   */
  async generateToken(
    options: AuthTokenOptions,
  ): Promise<string> {
    const payload = {
      ...options,
      exp: getNumericDate(this.defaultExpirationTime),
    };

    return await create(
      this.header,
      payload,
      config.get("SECRET")!,
    );
  }

  /**
   * Verifies the token to authenticate user.
   * @param authorizationSchema the authorization header provided along with request. Default schema is 'Bearer <token>'
   */
  async verifyToken(authorizationSchema: string | null): Promise<Payload> {
    if (!authorizationSchema) {
      throw new Error("No authorization header provided");
    }
    const token = authorizationSchema?.split(" ")[1];

    if (!token) throw new Error("No token found on given schema");

    return await verify(token, config.get("SECRET")!, this.header.alg);
  }
}
