import { KeyPair, createKeyPair } from "./utils"

interface FcmRegisterRequest {
  web: FcmRegisterWeb
}

interface FcmRegisterResponse {
  name: string
  token: string
  web: FcmRegisterWeb
}

interface FcmRegisterWeb {
  applicationPubKey: string
  auth: string
  endpoint: string
  p256dh: string
}

interface FcmRegisterResult {
  fcmToken: string
  keys: KeyPair
  endpoint: string
}

interface FcmRegisterOptions {
  projectId: string
  apiKey: string
  vapidKey: string
  firebaseInstallationToken: string
  gcmToken: string
  pushKeys?: KeyPair
}

export async function register({
  projectId,
  apiKey,
  vapidKey,
  firebaseInstallationToken,
  gcmToken,
  pushKeys = createKeyPair(),
}: FcmRegisterOptions): Promise<FcmRegisterResult> {
  const endpoint = `https://fcm.googleapis.com/fcm/send/${gcmToken}`

  const request: FcmRegisterRequest = {
    web: {
      endpoint,
      applicationPubKey: vapidKey,
      auth: pushKeys.authSecret.toString("base64url"),
      p256dh: pushKeys.publicKey.toString("base64url"),
    },
  }

  const url = `https://fcmregistrations.googleapis.com/v1/projects/${projectId}/registrations`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "x-goog-firebase-installations-auth": firebaseInstallationToken,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to register with FCM: ${response.status} ${response.statusText}`,
    )
  }

  const json: FcmRegisterResponse = await response.json()

  return {
    fcmToken: json.token,
    keys: pushKeys,
    endpoint,
  }
}
