/**
 * https://www.w3resource.com/javascript/form/email-validation.php
 *
 * Checks if a given email is valid or not.
 * @param email the email we want to validate
 * @returns true if valid, false if not valid
 */
export function isEmailValid(email: string): boolean {
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (email.match(emailFormat)) {
        return true
    } else {
        return false
    }
}
