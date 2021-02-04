import { Router } from "../deps.ts";

import { login } from "../controllers/authController.ts";

/* Sets up the routes for auths */

const router = new Router();

const AUTH_STRING = "/auth";
const AUTH_LOGIN_ENDPOINT = `${AUTH_STRING}/login`;

router
  .post(AUTH_LOGIN_ENDPOINT, async (ctx) => await login(ctx));

export default router;
