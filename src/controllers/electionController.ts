export default {
  /**
   * TODO: add comment
   */
  getAllElections: getAllElections,
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
