enum BallotType {
  SINGLE,
  MULTIPLE,
  RANKED,
}

enum BallotResultDisplay {
  NONE,
  SINGLE,
  RUNNER_UP,
  ALL,
}

enum BallotStatus {
  IN_QUEUE,
  IN_PROGRESS,
  IN_RESULT,
  IN_ARCHIVE,
}

export { BallotResultDisplay, BallotStatus, BallotType };
