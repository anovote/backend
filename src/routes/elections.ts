import { Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";

import electionController from "../controllers/electionController.ts";
import { verifyAuthentication } from "../middleware/authentication.ts";

/* Sets up the CRUD routes for elections */

const router = new Router();

/** Use authentication middleware to check if user have the rights to enter this route */
router.use((ctx, next) => verifyAuthentication(ctx, next));

const ELECTIONS_STRING = "/elections";
const ELECTIONS_ID_STRING = `"${ELECTIONS_STRING}/:id"`;
router
  .get(ELECTIONS_STRING, electionController.getAllElections)
  .post(ELECTIONS_STRING, electionController.createElection)
  .get(ELECTIONS_ID_STRING, electionController.getElectionById)
  .post(ELECTIONS_ID_STRING, electionController.updateElectionById)
  .delete(ELECTIONS_ID_STRING, electionController.deleteElectionById);

export default router;
