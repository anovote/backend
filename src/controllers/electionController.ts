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

function getAllElections(
  { response }: { response: any },
) {
  response.status = 200;
  response.body = {
    success: true,
    data: elections,
  };
}

function createElection(
  { request, response }: { request: any; response: any },
) {
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
    return;
  }

function validatePassword(password: string): boolean {
  if (password.length < 6) {
    throw new Error("password is to short");
  }
  return true;
}
