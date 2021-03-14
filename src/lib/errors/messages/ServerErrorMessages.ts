export const ServerErrorMessage = {
    unexpected: () => 'Unexpected server error',
    notFound: (entity: string) => `${entity} not found`,
    unauthorized: () => 'You are unauthorized, please login',
    noAuthorizationHeader: () => 'No authorization header provided',
    invalidTokenFormat: () => 'Token format is invalid',
    invalidToken: () => 'Invalid token, please login again',
    invalidData: () => 'Invalid data',
    forbidden: () => 'You are forbidden to access this resource',
    wrongContentType: (validType: string) => `Wrong content type. Acceptable content type is: ${validType}`,
    missingVerificationCode: () => 'Missing verification code',
    invalidVerificationCose: () => 'Verification code is invalid',
    alreadyVerified: () => 'You are already verified on another device',
    electionClosedEnded: () => 'Election is closed, or has ended'
}
