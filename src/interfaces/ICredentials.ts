// Provides optional credentials
export interface IOptionalCredentials {
    email?: string
    password?: string
}

// Enforces credentials to be present
export interface ICredentials extends IOptionalCredentials {
    email: string
    password: string
}
