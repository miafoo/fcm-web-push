import { createECDH, randomBytes } from "crypto"
import { FcmRegistration } from "./register"

export const CHROME_VERSION = "121.0.6167.160/161"

export function createPrime256v1ECDH() {
  const ecdh = createECDH("prime256v1")
  ecdh.generateKeys()
  return ecdh
}

export function createAuthSecret() {
  return randomBytes(16)
}

export interface KeyPair {
  publicKey: Buffer
  privateKey: Buffer
  authSecret: Buffer
}

export function createKeyPair() {
  const ecdh = createPrime256v1ECDH()
  return {
    publicKey: ecdh.getPublicKey(),
    privateKey: ecdh.getPrivateKey(),
    authSecret: createAuthSecret(),
  }
}

export function encodeRegistration(registration: FcmRegistration) {
  return JSON.stringify(
    {
      gcm: {
        androidId: registration.gcm.androidId.toString(),
        securityToken: registration.gcm.securityToken.toString(),
      },
      fcmToken: registration.fcmToken,
      keys: {
        publicKey: registration.keys.publicKey.toString("base64url"),
        privateKey: registration.keys.privateKey.toString("base64url"),
        authSecret: registration.keys.authSecret.toString("base64url"),
      },
    },
    null,
    2,
  )
}

export function decodeRegistration(data: string): FcmRegistration {
  const registration = JSON.parse(data)
  return {
    gcm: {
      androidId: BigInt(registration.gcm.androidId),
      securityToken: BigInt(registration.gcm.securityToken),
    },
    fcmToken: registration.fcmToken,
    keys: {
      publicKey: Buffer.from(registration.keys.publicKey, "base64url"),
      privateKey: Buffer.from(registration.keys.privateKey, "base64url"),
      authSecret: Buffer.from(registration.keys.authSecret, "base64url"),
    },
  }
}
