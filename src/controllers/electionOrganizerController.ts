import { ElectionOrganizer } from "../models/electionOrganizer.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

async function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  if (request.hasBody) {
    const registerElectionOrganizer: ElectionOrganizer = await request.body()
      .value;
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

function validateElectionOrganizer(electionOrganizer: ElectionOrganizer) {
}
