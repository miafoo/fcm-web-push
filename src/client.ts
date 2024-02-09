import { EventEmitter } from "stream"
import { TLSSocket, connect } from "tls"
import { decrypt } from "./decrypt"
import * as gcm from "./gcm"
import * as Mcs from "./proto/mcs"
import { FcmRegistration } from "./register"
import { CHROME_VERSION } from "./utils"

interface FcmClientEvent {
  (event: "connect", listener: () => void): void
  (event: "connected", listener: () => void): void
  (event: "disconnected", listener: () => void): void
  <T extends Record<string, unknown>>(
    event: "message",
    listener: (message: FcmMessage<T>) => void,
  ): void
}

interface FcmMessage<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  persistentId: string
  fcmMessageId: string
  from: string
  notification?: {
    title?: string
    body?: string
    icon?: string
    image?: string
    click_action?: string
  }
  priority: "normal" | "high"
  data?: T
}

const MCS_VERSION = 41

enum McsTag {
  HEARTBEAT_PING = 0,
  HEARTBEAT_ACK = 1,
  LOGIN_REQUEST = 2,
  LOGIN_RESPONSE = 3,
  CLOSE = 4,
  MESSAGE_STANZA = 5,
  PRESENCE_STANZA = 6,
  IQ_STANZA = 7,
  DATA_MESSAGE_STANZA = 8,
  BATCH_PRESENCE_STANZA = 9,
  STREAM_ERROR_STANZA = 10,
  HTTP_REQUEST = 11,
  HTTP_RESPONSE = 12,
  BIND_ACCOUNT_REQUEST = 13,
  BIND_ACCOUNT_RESPONSE = 14,
  TALK_METADATA = 15,
  NUM_PROTO_TYPES = 16,
}

interface FcmClientOptions {
  registration: FcmRegistration
}

export class FcmClient {
  private socket: TLSSocket | null = null

  private persistentIds: string[] = []

  private listeners: EventEmitter

  private loginVersion: Uint8Array | null = null
  private loginResponse: Mcs.HeartbeatPing | null = null

  constructor(private options: FcmClientOptions) {
    this.listeners = new EventEmitter()
  }

  // biome-ignore lint/suspicious/noExplicitAny: The underlying type understands this.
  public on: FcmClientEvent = (event: string, listener: any) => {
    this.listeners.on(event, listener)
  }

  // biome-ignore lint/suspicious/noExplicitAny: The underlying type understands this.
  public off: FcmClientEvent = (event: string, listener: any) => {
    this.listeners.removeListener(event, listener)
  }

  // biome-ignore lint/suspicious/noExplicitAny: The underlying type understands this.
  public once: FcmClientEvent = (event: string, listener: any) => {
    this.listeners.once(event, listener)
  }

  public async connect(persistentIds: string[] = []) {
    this.persistentIds = persistentIds.slice()
    this.loginVersion = null
    this.loginResponse = null

    // First check in to let GCM know the device is still functioning
    await gcm.checkIn(this.options.registration.gcm)

    // return new Promise((resolve) => {
    this.listeners.emit("connect")
    this.socket = connect({
      host: "mtalk.google.com",
      port: 5228,
      rejectUnauthorized: false,
    })

    this.socket.on("ready", this.onReady)
    this.socket.on("readable", this.onReadable)

    // Return a promise that resolves when the socket is closed
    return new Promise((resolve) => {
      this.socket?.on("close", () => {
        this.listeners.emit("disconnected")
        resolve(void 0)
      })
    })
  }

  public disconnect() {
    this.socket?.destroy()
  }

  private onReady = () => {
    this.listeners.emit("connected")
    this.login()
  }

  private onReadable = () => {
    if (!this.socket || !this.socket.readable) {
      return
    }
    // The first data received after sending a login request is always the version.
    if (!this.loginVersion) {
      this.loginVersion = this.socket.read(1)
      return
    }

    // Read the first byte to determine the tag.
    const read = this.socket.read(1) as Buffer | null
    const tag = read ? read[0] : null
    if (tag == null) {
      return
    }
    // Close if the server tells us to...
    if (tag === McsTag.CLOSE) {
      this.socket.destroy()
      return
    }

    // https://protobuf.dev/programming-guides/encoding/#varints
    let size = 0
    for (let shift = 0; ; shift += 7) {
      const [b] = this.socket.read(1)
      size |= (b & 0x7f) << shift
      if ((b & 0x80) === 0) {
        break
      }
    }

    const payload = this.socket.read(size)

    switch (tag) {
      case McsTag.LOGIN_RESPONSE: {
        const response = Mcs.LoginResponse.decode(payload)

        this.loginResponse = Mcs.HeartbeatPing.create({
          last_stream_id_received: response.last_stream_id_received,
          stream_id: response.stream_id,
          status: 0n,
        })

        this.persistentIds = []
        this.heartbeat()
        break
      }

      case McsTag.HEARTBEAT_ACK: {
        break
      }

      case McsTag.HEARTBEAT_PING: {
        const heartbeat = Mcs.HeartbeatAck.encode(Mcs.HeartbeatAck.create())
          .ldelim()
          .finish()

        this.socket.write(new Uint8Array([McsTag.HEARTBEAT_ACK]))
        this.socket.write(heartbeat)
        break
      }

      case McsTag.DATA_MESSAGE_STANZA: {
        const decoded = Mcs.DataMessageStanza.decode(payload)

        const message = this.decrypt(decoded)
        message.persistentId = decoded.persistent_id

        this.listeners.emit("message", message)
        break
      }

      case McsTag.IQ_STANZA: {
        break
      }

      default:
        console.error("Unhandled tag:", tag, payload)
    }
  }

  private login() {
    if (!this.socket) {
      throw new Error("Socket is not connected")
    }

    // When we start a new connection make sure to unset the version.
    this.loginVersion = null

    this.socket.write(new Uint8Array([MCS_VERSION, McsTag.LOGIN_REQUEST]))

    const androidId = this.options.registration.gcm.androidId
    const deviceId = `android-${androidId.toString(16)}`

    const request = Mcs.LoginRequest.create({
      adaptive_heartbeat: false,
      auth_service: Mcs.LoginRequestAuthService.ANDROID_ID, // This is required to function
      auth_token: this.options.registration.gcm.securityToken.toString(),
      id: `chrome-${CHROME_VERSION}`,
      domain: "mcs.android.com",
      device_id: deviceId,
      network_type: 1,
      resource: androidId.toString(),
      user: androidId.toString(),
      use_rmq2: true,
      setting: [{ name: "new_vc", value: "1" }],
      client_event: [],
      received_persistent_id: this.persistentIds,
    })

    const buffer = Mcs.LoginRequest.encode(request).ldelim().finish()

    this.socket.write(buffer)
  }

  private heartbeat() {
    if (!this.socket || !this.loginResponse) {
      return
    }

    const buffer = Mcs.HeartbeatPing.encode(this.loginResponse)
      .ldelim()
      .finish()

    this.socket.write(new Uint8Array([McsTag.HEARTBEAT_PING]))
    this.socket.write(buffer)
  }

  private decrypt(message: Mcs.DataMessageStanza) {
    const cryptoKey = message.app_data
      .find((v) => v.key === "crypto-key")
      ?.value.slice(3)
    if (!cryptoKey) {
      throw new Error("Missing crypto-key")
    }

    const encryption = message.app_data
      .find((v) => v.key === "encryption")
      ?.value.slice(5)
    if (!encryption) {
      throw new Error("Missing encryption")
    }

    const { publicKey, privateKey, authSecret } = this.options.registration.keys

    const result = decrypt(Buffer.from(message.raw_data), {
      publicKey,
      privateKey,
      authSecret,
      serverPublicKey: Buffer.from(cryptoKey, "base64"),
      salt: Buffer.from(encryption, "base64"),
    })

    return JSON.parse(result.toString("utf8"))
  }
}
