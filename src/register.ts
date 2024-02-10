import { randomUUID } from "crypto"
import * as fcm from "./fcm"
import * as firebaseInstallation from "./firebase-installation"
import * as gcm from "./gcm"
import { KeyPair } from "./utils"

export interface FcmRegistration {
  gcm: {
    androidId: bigint
    securityToken: bigint
  }
  fcm: {
    token: string
    endpoint: string
  }
  keys: KeyPair
}

export interface FcmRegistrationOptions {
  appId: string
  projectId: string
  apiKey: string
  vapidKey: string
}

export async function register({
  appId,
  projectId,
  apiKey,
  vapidKey,
}: FcmRegistrationOptions): Promise<FcmRegistration> {
  const checkinResult = await gcm.checkIn({
    androidId: 0n,
    securityToken: 0n,
  })

  const id = randomUUID()
  const gcmAppId = `wp:receiver.push.com#${id}`

  const gcmToken = await gcm.register({
    appId: gcmAppId,
    androidId: checkinResult.android_id,
    securityToken: checkinResult.security_token,
  })

  const firebaseInstallationToken = await firebaseInstallation.getInstallation({
    appId,
    apiKey,
    projectId,
  })

  const fcmRegisterResult = await fcm.register({
    projectId,
    apiKey,
    vapidKey,
    firebaseInstallationToken: firebaseInstallationToken.authToken.token,
    gcmToken,
  })

  return {
    gcm: {
      androidId: checkinResult.android_id,
      securityToken: checkinResult.security_token,
    },
    fcm: {
      token: fcmRegisterResult.fcm.token,
      endpoint: fcmRegisterResult.fcm.endpoint,
    },
    keys: fcmRegisterResult.keys,
  }
}
