import { ValidationError } from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/schema/errors.ts";
import { assertEquals } from "../src/deps.ts";
import {
  ElectionOrganizerModel,
  electionOrganizerValidator,
} from "../src/models/ElectionOrganizerModel.ts";

const correctElectionOrganizer = {
  firstName: "Sanderullan",
  lastName: "Hufsa",
  email: "Sander@hufsa.no",
  password: "SteffenErSot",
};

const incorrectElectionOrganizer = {
  firstName: "Sa",
  lastName: "Hufsa",
  email: "Sander@hufsa.no",
  password: "St",
};

Deno.test({
  name: "Test fields of election organization model",
  fn: () => {
    const electionOrganizerModel: ElectionOrganizerModel =
      correctElectionOrganizer;

    assertEquals(
      electionOrganizerModel.firstName,
      correctElectionOrganizer.firstName,
    );
    assertEquals(
      electionOrganizerModel.lastName,
      correctElectionOrganizer.lastName,
    );
    assertEquals(electionOrganizerModel.email, correctElectionOrganizer.email);
    assertEquals(
      electionOrganizerModel.password,
      correctElectionOrganizer.password,
    );
  },
});

Deno.test({
  name: "Test the constraints of the election orgnaization model",
  fn: () => {
    let validationError = false;

    const [err] = electionOrganizerValidator({
      firstName: incorrectElectionOrganizer.firstName,
      lastName: incorrectElectionOrganizer.lastName,
      email: incorrectElectionOrganizer.email,
      password: incorrectElectionOrganizer.password,
    });

    if (err) {
      validationError = true;
    }

    assertEquals(validationError, true);
  },
});
