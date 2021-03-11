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
        join: 'join',
        verify: {
            voterIntegrity: 'verify_voter_integrity'
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
            submit: 'vote_submitted'
        }
    },
    server: {
        join: {
            received: 'confirm_received_join'
        },
        verified: {
            voterIntegrity: 'voter_integrity_verified'
        },
        election: {
            started: 'election_started',
            closed: 'election_closed'
        },
        ballot: {
            pushed: 'ballot_pushed',
            ended: 'ballot_ended'
        },
        vote: {
            confirmed: 'confirm_vote_submitted',
            error: 'vote_error'
        }
    }
}
