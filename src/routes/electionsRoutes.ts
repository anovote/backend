import { Router } from "../deps.ts";

import ElectionController from "../controllers/electionController.ts";

/* Sets up the CRUD routes for elections */

const router = new Router();
const electionController = new ElectionController();

const ELECTIONS_STRING = "/elections";
const ELECTIONS_ID_STRING = `${ELECTIONS_STRING}/:id`;

router
  .get(ELECTIONS_STRING, electionController.getAllElections)
  .post(ELECTIONS_STRING, (ctx) => electionController.createElection(ctx))
  // .get(ELECTIONS_ID_STRING, electionController.getElectionById)
  .put(
    ELECTIONS_ID_STRING,
    (ctx) => electionController.updateElectionById(ctx),
  )
  .delete(
    ELECTIONS_ID_STRING,
    (ctx) => electionController.deleteElectionById(ctx),
  );

export default router;
