import { Router } from "../deps.ts";

import electionOrganizerController from "../controllers/electionOrganizerController.ts";

const router = new Router();

const REGISTER_ELECTION_ORGANIZER_STRING = "/register_elecion_organizer";

router
  .post(
    REGISTER_ELECTION_ORGANIZER_STRING,
    electionOrganizerController.createElectionOrganizer,
  );

export default router;
