import { bcrypt } from "../deps.ts";
import { DatabaseConnection } from "../DatabaseConnection.ts";
import {
  ElectionOrganizer,
  electionOrganizerValidator,
} from "../models/ElectionOrganizer.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

async function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  const electionOrganizer: ElectionOrganizer = await request.body().value;

  const [err, organizer] = electionOrganizerValidator({
    firstName: electionOrganizer.firstName,
    lastName: electionOrganizer.firstName,
    email: electionOrganizer.email,
    password: electionOrganizer.password,
  });

  if (err) {
    response.body = "Error in validatoisdonåigji";
  } else if (request.hasBody) {
    response.status = 201;
    response.body = {
      success: true,
      msg: "Election organizer created!",
    };
  } else if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
    return;
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
