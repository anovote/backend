import { AuthenticationService } from "../classes/AuthenticationService.ts";
import { Context } from "../deps.ts";

/**
 * Verifies if a token is passed along with the request.
 * Checks if the request have the rights to access the route.
 * @export
 * @param ctx access to the route information
 * @param next call next middleware/route
 */
export const verifyAuthentication = async (
  ctx: Context,
  next: () => Promise<void>,
) => {
  const bearerSchema = ctx.request.headers.get("Authorization");
  try {
    await new AuthenticationService().verifyToken(bearerSchema);
  } catch (e) {
    ctx.throw(403);
    // ! TODO throw more meaningful error
  }

  await next();
};
