import { AuthenticationService } from "../services/AuthenticationService.ts";
import { ElectionOrganizer } from "../entity/barrel.ts";
import { EncryptionService } from "../services/EncryptionService.ts";
import { bcrypt, Context, getRepository } from "../deps.ts";

export { login };

interface LoginPayload {
  email: string;
  password: string;
}

const jwt = new AuthenticationService();

/**
 * Checks to see if user is stored in database before generating a token.
 * @param ctx the context passed from a router, typically
 * ! TODO throw more meaningful errors
 */
async function login(ctx: Context): Promise<void> {
  const admin: LoginPayload = await ctx.request.body().value;
  const encryption = new EncryptionService();

  const electionOrg = await getRepository(ElectionOrganizer).findOne({
    email: admin.email,
  });

  if (!electionOrg) ctx.throw(404);

  const passwordMatches = await encryption.comparePasswords(
    admin.password,
    electionOrg!.password,
  );
  if (!passwordMatches) ctx.throw(400);

  const token = await jwt.generateToken({
    id: electionOrg.id,
    organizer: true,
  });

  ctx.response.status = 200;
  ctx.response.body = {
    token,
  };
}
