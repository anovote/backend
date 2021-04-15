/**
 * More specific error codes for returning to the client
 */
export type ErrorCode =
    | 'UNEXPECTED'
    | 'VOTER_IDENTIFICATION_MISSING'
    | 'VERIFICATION_CODE_MISSING'
    | 'VERIFICATION_CODE_INVALID'
    | 'ALREADY_VERIFIED'
    | 'VOTER_NOT_EXIST'
    | 'ELECTION_FINISHED'
    | 'ELECTION_NOT_EXIST'
    | 'ELECTION_CODE_MISSING'
    | 'ELECTION_DUPLICATE'
