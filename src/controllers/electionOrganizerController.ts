export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  if (request.hasBody) {
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
