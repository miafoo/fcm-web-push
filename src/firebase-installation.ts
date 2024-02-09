import { randomBytes } from "crypto"

interface FirebaseInstallationResponse {
  name: string
  fid: string
  refreshToken: string
  authToken: FirebaseInstallationAuthToken
}

interface FirebaseInstallationAuthToken {
  token: string
  expiresIn: string
}

interface GetInstallationOptions {
  appId: string
  projectId: string
  apiKey: string
}

export async function getInstallation({
  appId,
  projectId,
  apiKey,
}: GetInstallationOptions): Promise<FirebaseInstallationResponse> {
  const request = {
    appId,
    authVersion: "FIS_v2",
    fid: generateFirebaseFid(),
    sdkVersion: "w:0.6.4",
  }

  const heartbeat = {
    heartbeats: [],
    version: 2,
  }

  const url = `https://firebaseinstallations.googleapis.com/v1/projects/${projectId}/installations`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "x-firebase-client": Buffer.from(JSON.stringify(heartbeat)).toString(
        "base64url",
      ),
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to get installation: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

function generateFirebaseFid() {
  const fid: Uint8Array = randomBytes(17)
  fid[0] = 0b01110000 + (fid[0] % 0b00010000)
  return Buffer.from(fid).toString("base64url")
}
