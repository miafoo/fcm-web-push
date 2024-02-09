import crypto from "crypto"

// https://developer.chrome.com/blog/web-push-encryption

interface DecryptParams {
  privateKey: Buffer
  publicKey: Buffer
  authSecret: Buffer
  serverPublicKey: Buffer
  salt: Buffer
}

export function decrypt(data: Buffer, params: DecryptParams) {
  const receiverCurve = crypto.createECDH("prime256v1")
  receiverCurve.setPrivateKey(params.privateKey)
  const sharedSecret = receiverCurve.computeSecret(params.serverPublicKey)

  const prk = hkdf(
    params.authSecret,
    sharedSecret,
    Buffer.from("Content-Encoding: auth\0", "utf8"),
    32,
  )

  const contentEncryptionKey = hkdf(
    params.salt,
    prk,
    createInfo("aesgcm", params.publicKey, params.serverPublicKey),
    16,
  )

  const nonce = hkdf(
    params.salt,
    prk,
    createInfo("nonce", params.publicKey, params.serverPublicKey),
    12,
  )

  const gcm = crypto.createDecipheriv(
    "aes-128-gcm",
    contentEncryptionKey,
    nonce,
  )
  gcm.setAuthTag(data.subarray(data.length - 16))
  let result = gcm.update(data.subarray(0, data.length - 16))
  result = Buffer.concat([result, gcm.final()])

  // Unpad the data
  while (result.length > 0 && result[0] === 0x00) {
    result = result.subarray(1)
  }

  return result
}

// Simplified HKDF, returning keys up to 32 bytes long
function hkdf(
  salt: string | Buffer,
  ikm: Buffer,
  info: Buffer,
  length: number,
) {
  if (length > 32) {
    throw new Error(
      "Cannot return keys of more than 32 bytes, ${length} requested",
    )
  }

  // Extract
  const keyHmac = crypto.createHmac("sha256", salt)
  keyHmac.update(ikm)
  const key = keyHmac.digest()

  // Expand
  const infoHmac = crypto.createHmac("sha256", key)
  infoHmac.update(info)
  // A one byte long buffer containing only 0x01
  const ONE_BUFFER = Buffer.alloc(1).fill(1)
  infoHmac.update(ONE_BUFFER)
  return infoHmac.digest().subarray(0, length)
}

function createInfo(
  type: string,
  clientPublicKey: Buffer,
  serverPublicKey: Buffer,
) {
  const len = type.length

  // The start index for each element within the buffer is:
  // value               | length | start    |
  // -----------------------------------------
  // 'Content-Encoding: '| 18     | 0        |
  // type                | len    | 18       |
  // nul byte            | 1      | 18 + len |
  // 'P-256'             | 5      | 19 + len |
  // nul byte            | 1      | 24 + len |
  // client key length   | 2      | 25 + len |
  // client key          | 65     | 27 + len |
  // server key length   | 2      | 92 + len |
  // server key          | 65     | 94 + len |
  // For the purposes of push encryption the length of the keys will
  // always be 65 bytes.
  const info = Buffer.alloc(18 + len + 1 + 5 + 1 + 2 + 65 + 2 + 65)

  // The string 'Content-Encoding: ', as utf-8
  info.write("Content-Encoding: ")
  // The 'type' of the record, a utf-8 string
  info.write(type, 18)
  // A single null-byte
  info.write("\0", 18 + len)
  // The string 'P-256', declaring the elliptic curve being used
  info.write("P-256", 19 + len)
  // A single null-byte
  info.write("\0", 24 + len)
  // The length of the client's public key as a 16-bit integer
  info.writeUInt16BE(clientPublicKey.length, 25 + len)
  // Now the actual client public key
  clientPublicKey.copy(info, 27 + len)
  // Length of our public key
  info.writeUInt16BE(serverPublicKey.length, 92 + len)
  // The key itself
  serverPublicKey.copy(info, 94 + len)

  return info
}
