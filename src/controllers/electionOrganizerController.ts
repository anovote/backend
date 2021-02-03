import { bcrypt } from "../deps.ts";
import { DatabaseConnection } from "../DatabaseConnection.ts";
import {
  ElectionOrganizerModel,
  electionOrganizerValidator,
} from "../models/ElectionOrganizerModel.ts";
import { ElectionOrganizer } from "../entity/ElectionOrganizer.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

const dbConnection = new DatabaseConnection();
const dbManager = await dbConnection.getDatabaseManager();

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

    try {
      const eOrgEntity = new ElectionOrganizer();
      eOrgEntity.firstName = electionOrganizer.firstName;
      eOrgEntity.lastName = electionOrganizer.lastName;
      eOrgEntity.email = electionOrganizer.email;
      eOrgEntity.password = electionOrganizer.password;

      //await dbManager?.save(eOrgEntity);
    } catch (e) {
      console.log(e);
    }

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
