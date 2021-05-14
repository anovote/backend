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

const code = {
    voterId: 100,
    electionCode: 200,
    joinSocketId: 'socketId'
}
const delimiter = '<@>'
const decodedCode = (identifier: string) =>
    `${identifier}${delimiter}${code.voterId}${delimiter}${code.electionCode}${delimiter}${code.joinSocketId}`

beforeAll(async () => {
    mailMock = (await mailTransporter()) as jest.Mocked<Mail>
    mailServiceMock = new MailService('localhost', await mailTransporter()) as jest.Mocked<MailService>
    encryptionServiceMock = new EncryptionService() as jest.Mocked<EncryptionService>
    eligibleVoterServiceMock = new EligibleVoterService(await getTestDatabase()) as jest.Mocked<EligibleVoterService>
    verificationService = new VoterVerificationService(mailServiceMock, encryptionServiceMock, eligibleVoterServiceMock)
})

it('should decode verification code into object with each key', () => {
    const decoded = []
    encryptionServiceMock.decrypt.mockImplementationOnce(() => decodedCode('some_randomStringHere'))
    decoded.push(verificationService.decodeVerificationCode(''))

    encryptionServiceMock.decrypt.mockImplementationOnce(() => decodedCode('hackedOrWhat-!2##54$%$%^!\\|/*`~`""{}]['))
    decoded.push(verificationService.decodeVerificationCode(''))

    encryptionServiceMock.decrypt.mockImplementationOnce(() =>
        decodedCode('@#$^&*(*&^%!@#!@$RDFvvDeReeRWQ{PDFmTRk23UIO^*^7567$%^$%^*&()*(_$%!{}"|}{<>./')
    )
    decoded.push(verificationService.decodeVerificationCode(''))

    for (const decode of decoded) {
        expect(decode).toContainAllEntries(Object.entries(code))
    }
})

it('should return undefined if unable to decode the code', () => {
    const decoded = []
    encryptionServiceMock.decrypt.mockImplementationOnce(() => 'randomString')
    decoded.push(verificationService.decodeVerificationCode(''))

    encryptionServiceMock.decrypt.mockImplementationOnce(() => '123_#$BVN_VBN_S+_+D)F _)&^_* +O<%R&E^}MRA"#$|')
    decoded.push(verificationService.decodeVerificationCode(''))

    for (const decode of decoded) {
        expect(decode).toBeUndefined()
    }
})
