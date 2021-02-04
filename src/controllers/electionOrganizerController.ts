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
import { dbConnection } from "../main.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

/**
 * Function responsible for creating an election organizer on a
 * create election organizer request. If an empty request is received,
 * it will responde that no data was received. If the election organizer
 * data in the request is not valid, it will respond by saying that 
 * it is not valid. If the election organizer data is valid it will 
 * hash the password of the election organizer and add the 
 * election organizer to the database.
 */
async function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  const electionOrganizer: ElectionOrganizerModel = await request.body().value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "Cannot create a election organizer from no data",
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

    addElectionOrganizerToDatabase(electionOrganizer);

    response.status = 201;
    response.body = {
      success: true,
      msg: "Election organizer created!",
    };
  }
}

/**
 * Hashes a specified password.
 * @param passwordToHash The password which we want to hash.
 * @returns Returns Promise<string> since the function is async.
 */
async function hashPassword(passwordToHash: string): Promise<string> {
  return await bcrypt.hash(passwordToHash);
}

/**
 * Compares a hash and password to see if the match
 * @param password the password to compare
 * @param hash the hash to compare
 * @returns returns true if they match, or false if they dont match
 */
async function doHashAndPasswordmatch(
  password: string,
  hash: Promise<string>,
): Promise<boolean> {
  const stringHash = (await hash).toString();
  return await bcrypt.compare(password, stringHash);
}

/**
 * Validates a specified election organizer model. Uses the election organizer
 * schema validator, which is provided by the election organizer model.
 * @param electionOrganizer The election organizer which we want to validate
 * @returns returns true if no errors, returns false for any number of erros.
 */
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

/**
 * Adds a specified election organizer to the database.
 * @param electionOrganizer The eleciton organizer which we want
 * to add to the database
 */
async function addElectionOrganizerToDatabase(
  electionOrganizer: ElectionOrganizerModel,
) {
  const eOrg = new ElectionOrganizer();
  eOrg.firstName = electionOrganizer.firstName;
  eOrg.lastName = electionOrganizer.lastName;
  eOrg.email = electionOrganizer.email;
  eOrg.password = electionOrganizer.password;
  eOrg.elections = [];

  await dbConnection.manager.save(eOrg);
}
