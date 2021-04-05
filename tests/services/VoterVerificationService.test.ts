import mailTransporter from '@/loaders/nodemailer'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import Mail from 'nodemailer/lib/mailer'
import { getTestDatabase } from '../helpers/database'

let verificationService: VoterVerificationService
jest.mock('@/loaders/nodemailer')
jest.mock('@/services/MailService')
jest.mock('@/services/EncryptionService')
jest.mock('@/services/EligibleVoterService')

let mailServiceMock: jest.Mocked<MailService>
let mailMock: jest.Mocked<Mail>
let encryptionServiceMock: jest.Mocked<EncryptionService>
let eligibleVoterServiceMock: jest.Mocked<EligibleVoterService>

const identifier = 'voter'
const voterId = 100
const electionId = 200
const socketId = 'socketid'
const delimiter = '_'
const decodedCode = `${identifier}${delimiter}${voterId}${delimiter}${electionId}${delimiter}${socketId}`

beforeAll(async () => {
    mailMock = (await mailTransporter()) as jest.Mocked<Mail>
    mailServiceMock = new MailService('localhost', await mailTransporter()) as jest.Mocked<MailService>
    encryptionServiceMock = new EncryptionService() as jest.Mocked<EncryptionService>
    eligibleVoterServiceMock = new EligibleVoterService(await getTestDatabase()) as jest.Mocked<EligibleVoterService>
    verificationService = new VoterVerificationService(mailServiceMock, encryptionServiceMock, eligibleVoterServiceMock)
})

it('should decode verification code into object with each key', () => {
    encryptionServiceMock.decrypt.mockImplementationOnce(() => decodedCode)
    // Random string is passed here as the decrypted code is provided by encryption service decrypt
    const decoded = verificationService.decodeVerificationCode('')
    expect(decoded?.voterId).toBe(voterId)
    expect(decoded?.electionCode).toBe(electionId)
    expect(decoded?.joinSocketId).toBe(socketId)
})
