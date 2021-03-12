import config from '@/config'
import * as CryptoJs from 'crypto-js'

/**
 * Encrypts or decrypts a plaintext string.
 * The returned format for the encryption can be uri.
 */
export class EncryptionService {
    private _service
    private _uriEncoded

    /**
     * Constructs an encryption service that can encrypt/decrypt strings with/without uri encoding
     * @param formatToURI if true, the encrypted string will be uri formatted
     */
    constructor(formatToURI = false) {
        this._service = CryptoJs.AES
        this._uriEncoded = formatToURI
    }

    /**
     * Encrypts a string with AES encryption. When encrypted, the string is returned as a string directly
     * @param plaintext the plaintext string to encrypt
     * @returns the encrypted string
     */
    encrypt(plaintext: string) {
        let code = this._service.encrypt(plaintext, config.secret!).toString()

        if (this._uriEncoded) {
            code = encodeURIComponent(code)
        }
        return code
    }

    /**
     * Decrypts a encrypted AES string.
     * @param encrypted string to decrypt
     * @returns plaintext UTF8 encoded string
     */
    decrypt(encrypted: string) {
        let code = encrypted
        if (this._uriEncoded) {
            code = decodeURIComponent(code)
        }

        return this._service.decrypt(code, config.secret!).toString(CryptoJs.enc.Utf8)
    }
}
