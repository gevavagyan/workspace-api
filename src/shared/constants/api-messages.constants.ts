export const ERROR_MESSAGES = {
    userNotFound: 'User not found',
    tokenMissing : 'No authentication token provided !',
    tokenExpired : 'Invalid or expired authentication token !',
    refreshTokenExpired: 'Invalid or expired refresh token',
    wrongPassword: 'Invalid credentials, password does not match !',
    emailAlreadyInUse: 'User with this email address is already exists !',
    invalidCredentials: 'Invalid credentials, user with this email address does not exist !',
    unVerifiedEmailAddress: 'Your email address has not been verified yet !',
    accessDenied: 'You do not have permission to access this resource!',
}

export enum ERROR_TYPES {
    CLIENT_ERROR ='CLIENT_ERROR'
}

export const DB_DRIVER_ERROR_CODES = {
    conflictsWithServerState : 23505
}
