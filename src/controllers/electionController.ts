import { Election, ElectionSchema } from "../models/Election.ts";
import elections from "../studs/elections.ts";

export default {
  /**
   * TODO: add comment
   */
  getAllElections: getAllElections,
  createElection: createElection,
  getElectionById: () => {},
  updateElectionById: () => {},
  deleteElectionById: () => {},
};

const validator = ElectionSchema.destruct();
console.log(ElectionSchema);

console.log(validator);

function getAllElections(
  { response }: { response: any },
) {
  response.status = 200;
  response.body = {
    success: true,
    data: elections,
  };
}

async function createElection(
  { request, response }: { request: any; response: any },
) {
  console.log("Create user");

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
    return;
  }

  const electionData = await request.body().value as Election;
  console.log(electionData);

  const [error, election] = validator(electionData);
  console.log(election);

  console.log(error?.message);

  // validateElectionData(electionData);
}

function getElectionById({ response }: { response: any }) {
}

// /**
//  * Validates election data
//  * @param data the data to be validated
//  * @returns true if election data is valid, else false
//  */
// function validateElectionData(data: Election): boolean {
//   const { title, description, password, openDate, closeDate } = data;
//   if (!title || !description) {
//     throw new Error("Title or description missing");
//   }
//   if (password) {
//     validatePassword(password);
//   }

//   validateOpenCloseDate(openDate, closeDate);

//   return true;
// }

// function validatePassword(password: string): void {
//   if (password.length < 6) {
//     throw new Error("password is to short");
//   }
// }

// function validateOpenCloseDate(open: Date, close: Date) {
//   if (open > close) {
//     throw new Error("Open date is after close date");
//   }
//   return true;
// }
