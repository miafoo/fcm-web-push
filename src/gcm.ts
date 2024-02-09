import * as AndroidCheckin from "./proto/android-checkin"
import * as Checkin from "./proto/checkin"
import { CHROME_VERSION } from "./utils"

const SERVER_KEY =
  "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4"

interface RegisterOptions {
  appId: string
  androidId: bigint
  securityToken: bigint
  retry?: number
}

export async function register({
  appId,
  androidId,
  securityToken,
  retry = 10,
}: RegisterOptions): Promise<string> {
  const params = new URLSearchParams()
  params.set("app", "org.chromium.linux")
  params.set("X-subtype", appId)
  params.set("device", androidId.toString())
  params.set("sender", SERVER_KEY)

  const url = "https://android.clients.google.com/c2dm/register3"

  const result = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `AidLogin ${androidId}:${securityToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  })

  const response = await result.text()

  const [key, value] = response.split("=")
  if (!key || !value) {
    throw new Error("Invalid response")
  }
  if (key === "Error") {
    if (retry > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return register({ appId, androidId, securityToken, retry: retry - 1 })
    }
    throw new Error(value)
  }

  return value
}

interface CheckInOptions {
  androidId: bigint
  securityToken: bigint
}

export async function checkIn({
  androidId,
  securityToken,
}: CheckInOptions): Promise<Checkin.AndroidCheckinResponse> {
  const chromeBuild = AndroidCheckin.ChromeBuildProto.create({
    chrome_version: CHROME_VERSION,
    channel: AndroidCheckin.ChromeBuildProtoChannel.CHANNEL_STABLE,
    platform: AndroidCheckin.ChromeBuildProtoPlatform.PLATFORM_LINUX,
  })

  const checkinObject = AndroidCheckin.AndroidCheckinProto.create({
    type: AndroidCheckin.DeviceType.DEVICE_CHROME_BROWSER,
    chrome_build: chromeBuild,
  })

  const request = Checkin.AndroidCheckinRequest.create({
    user_serial_number: 0,
    checkin: checkinObject,
    version: 3,
    id: androidId,
    security_token: securityToken,
  })

  const buffer = Checkin.AndroidCheckinRequest.encode(request).finish()

  const result = await fetch("https://android.clients.google.com/checkin", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-protobuf",
      "Content-Length": buffer.byteLength.toString(),
    },
    body: buffer,
  })

  const responseBuffer = await result.arrayBuffer()

  const response = Checkin.AndroidCheckinResponse.decode(
    new Uint8Array(responseBuffer),
  )

  return response
}
