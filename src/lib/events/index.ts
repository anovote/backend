/**
 * Event definitions for socket.io used in this application
 * We are using a structuring our events in a client/server format. With ea
 */

export const Events = {
    standard: {
        message: 'message',
        socket: {
            connect: 'connect',
            disconnect: 'disconnect',
            connectError: 'connect_error'
        },
        manager: {
            reconnect: {
                e: 'reconnect',
                attempt: 'reconnect_attempt',
                error: 'reconnect_error',
                failed: 'reconnect_failed'
            },
            error: 'error',
            ping: 'ping'
        }
    },
    client: {
        auth: {
            join: 'join',
            withToken: 'authenticate_with_token',
            verify: {
                voterIntegrity: 'verify_voter_integrity'
            }
        },
        election: {
            start: 'start_election',
            close: 'close_election'
        },
        ballot: {
            push: 'push_ballot',
            end: 'end_ballot'
        },
        vote: {
            submit: 'submit_vote'
        }
    },
    server: {
        auth: {
            action: {
                mail: 'awaiting_mail_action'
            }
        },
        vote: {
            error: 'vote_error'
        }
    }
}
