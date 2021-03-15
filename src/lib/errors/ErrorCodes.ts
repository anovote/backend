/**
 * More specific error codes for returning to the client
 */
export const ErrorCode = {
    unexpected: 'UNEXPECTED',
    voterIdentificationMissing: 'VOTER_IDENTIFICATION_MISSING',
    verificationCodeMissing: 'VERIFICATION_CODE_MISSING',
    verificationCodeInvalid: 'VERIFICATION_CODE_INVALID',
    alreadyVerified: 'ALREADY_VERIFIED',
    voterNotExist: 'VOTER_NOT_EXIST',
    electionFinished: 'ELECTION_FINISHED',
    electionNotExist: 'ELECTION_NOT_EXIST'
}
