/**
 * More specific error codes for returning to the client
 */
export const ErrorCode = {
    UNEXPECTED: 'UNEXPECTED',
    VOTER_IDENTIFICATION_MISSING: 'VOTER_IDENTIFICATION_MISSING',
    VERIFICATION_CODE_MISSING: 'VERIFICATION_CODE_MISSING',
    VERIFICATION_CODE_INVALID: 'VERIFICATION_CODE_INVALID',
    ALREADY_VERIFIED: 'ALREADY_VERIFIED',
    VOTER_NOT_EXIST: 'VOTER_NOT_EXIST',
    ELECTION_FINISHED: 'ELECTION_FINISHED',
    ELECTION_NOT_EXIST: 'ELECTION_NOT_EXIST',
    ELECTION_CODE_MISSING: 'ELECTION_CODE_MISSING',
    ELECTION_DUPLICATE: 'ELECTION_DUPLICATE'
}
