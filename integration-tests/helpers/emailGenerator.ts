/**
 * Creates and returns a random generated email
 * @returns a random email
 */
export function createEmail() {
    return `email${(Date.now() + Math.random() * 10000).toFixed()}@mail${(Math.random() * 10000).toFixed()}.com`
}
