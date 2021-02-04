import {
  bcrypt,
  config,
  ConnectionOptions,
  createConnection,
} from "../deps.ts";
import {
  ElectionOrganizerModel,
  electionOrganizerValidator,
} from "../models/ElectionOrganizerModel.ts";
import { ElectionOrganizer } from "../entity/ElectionOrganizer.ts";
import { Election } from "../entity/Election.ts";
import { connection } from "../main.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

async function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  const electionOrganizer: ElectionOrganizerModel = await request.body().value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else if (!validateElectionOrganizerRegistration(electionOrganizer)) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "Election organizer registrations contains non-valid values",
    };
  } else {
    electionOrganizer.password =
      (await hashPassword(electionOrganizer.password)).toString();

    const eOrg = new ElectionOrganizer();
    eOrg.firstName = electionOrganizer.firstName;
    eOrg.lastName = electionOrganizer.lastName;
    eOrg.email = electionOrganizer.email;
    eOrg.password = electionOrganizer.password;

    const election = new Election();
    election.title = "My first election";
    election.description = "THIS IS MY FIRST ELECTION";
    election.status = 0;
    election.electionOrganizer = eOrg;

    await connection.manager.save(election);
    await connection.manager.save(eOrg);
    response.status = 201;
    response.body = {
      success: true,
      msg: "Election organizer created!",
    };
  }
}

async function hashPassword(passwordToHash: string): Promise<string> {
  return await bcrypt.hash(passwordToHash);
}

async function compareHashWithPassword(
  password: string,
  hash: Promise<string>,
): Promise<boolean> {
  const stringHash = (await hash).toString();
  return await bcrypt.compare(password, stringHash);
}

function validateElectionOrganizerRegistration(
  electionOrganizer: ElectionOrganizerModel,
): boolean {
  const [err] = electionOrganizerValidator({
    firstName: electionOrganizer.firstName,
    lastName: electionOrganizer.firstName,
    email: electionOrganizer.email,
    password: electionOrganizer.password,
  });

  if (err) {
    return false;
  } else {
    return true;
  }
}
