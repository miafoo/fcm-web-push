/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import Long = require("long");

export const protobufPackage = "mcs_proto";

/** TAG: 0 */
export interface HeartbeatPing {
  stream_id: number;
  last_stream_id_received: number;
  status: bigint;
}

/** TAG: 1 */
export interface HeartbeatAck {
  stream_id: number;
  last_stream_id_received: number;
  status: bigint;
}

export interface ErrorInfo {
  code: number;
  message: string;
  type: string;
  extension: Extension | undefined;
}

export interface Setting {
  name: string;
  value: string;
}

export interface HeartbeatStat {
  ip: string;
  timeout: boolean;
  interval_ms: number;
}

export interface HeartbeatConfig {
  upload_stat: boolean;
  ip: string;
  interval_ms: number;
}

/**
 * ClientEvents are used to inform the server of failed and successful
 * connections.
 */
export interface ClientEvent {
  /** Common fields [1-99] */
  type: ClientEventType;
  /** Fields for DISCARDED_EVENTS messages [100-199] */
  number_discarded_events: number;
  /**
   * Fields for FAILED_CONNECTION and SUCCESSFUL_CONNECTION messages [200-299]
   * Network type is a value in net::NetworkChangeNotifier::ConnectionType.
   */
  network_type: number;
  time_connection_started_ms: bigint;
  time_connection_ended_ms: bigint;
  /** Error code should be a net::Error value. */
  error_code: number;
  /** Fields for SUCCESSFUL_CONNECTION messages [300-399] */
  time_connection_established_ms: bigint;
}

export enum ClientEventType {
  UNKNOWN = 0,
  /** DISCARDED_EVENTS - Count of discarded events if the buffer filled up and was trimmed. */
  DISCARDED_EVENTS = 1,
  /**
   * FAILED_CONNECTION - Failed connection event: the connection failed to be established or we
   * had a login error.
   */
  FAILED_CONNECTION = 2,
  /**
   * SUCCESSFUL_CONNECTION - Successful connection event: information about the last successful
   * connection, including the time at which it was established.
   */
  SUCCESSFUL_CONNECTION = 3,
  UNRECOGNIZED = -1,
}

export function clientEventTypeFromJSON(object: any): ClientEventType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return ClientEventType.UNKNOWN;
    case 1:
    case "DISCARDED_EVENTS":
      return ClientEventType.DISCARDED_EVENTS;
    case 2:
    case "FAILED_CONNECTION":
      return ClientEventType.FAILED_CONNECTION;
    case 3:
    case "SUCCESSFUL_CONNECTION":
      return ClientEventType.SUCCESSFUL_CONNECTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ClientEventType.UNRECOGNIZED;
  }
}

export function clientEventTypeToJSON(object: ClientEventType): string {
  switch (object) {
    case ClientEventType.UNKNOWN:
      return "UNKNOWN";
    case ClientEventType.DISCARDED_EVENTS:
      return "DISCARDED_EVENTS";
    case ClientEventType.FAILED_CONNECTION:
      return "FAILED_CONNECTION";
    case ClientEventType.SUCCESSFUL_CONNECTION:
      return "SUCCESSFUL_CONNECTION";
    case ClientEventType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** TAG: 2 */
export interface LoginRequest {
  /** Must be present ( proto required ), may be empty */
  id: string;
  /**
   * string.
   * mcs.android.com.
   */
  domain: string;
  /** Decimal android ID */
  user: string;
  resource: string;
  /** Secret */
  auth_token: string;
  /**
   * Format is: android-HEX_DEVICE_ID
   * The user is the decimal value.
   */
  device_id: string;
  /** RMQ1 - no longer used */
  last_rmq_id: bigint;
  setting: Setting[];
  /** optional int32 compress = 9; */
  received_persistent_id: string[];
  adaptive_heartbeat: boolean;
  heartbeat_stat:
    | HeartbeatStat
    | undefined;
  /** Must be true. */
  use_rmq2: boolean;
  account_id: bigint;
  /** ANDROID_ID = 2 */
  auth_service: LoginRequestAuthService;
  network_type: number;
  status: bigint;
  /** Events recorded on the client after the last successful connection. */
  client_event: ClientEvent[];
}

export enum LoginRequestAuthService {
  /**
   * UNKNOWN - @miafoo: `ts-proto` doesn't include empty or default values when encoding.
   * So we add an `UNKNOWN` value so that becomes the default value, which
   * allows us to send ANDROID_ID as mtalk expects it. Without it, we never
   * get IQ_STANZA, DATA_MESSAGE_STANZA, or any other useful event from the server.
   */
  UNKNOWN = -1,
  ANDROID_ID = 2,
}

export function loginRequestAuthServiceFromJSON(object: any): LoginRequestAuthService {
  switch (object) {
    case -1:
    case "UNKNOWN":
      return LoginRequestAuthService.UNKNOWN;
    case 2:
    case "ANDROID_ID":
      return LoginRequestAuthService.ANDROID_ID;
    default:
      return LoginRequestAuthService.UNKNOWN;
  }
}

export function loginRequestAuthServiceToJSON(object: LoginRequestAuthService): string {
  switch (object) {
    case LoginRequestAuthService.UNKNOWN:
      return "UNKNOWN";
    case LoginRequestAuthService.ANDROID_ID:
      return "ANDROID_ID";
    default:
      return "UNKNOWN";
  }
}

/** TAG: 3 */
export interface LoginResponse {
  id: string;
  /** Not used. */
  jid: string;
  /** Null if login was ok. */
  error: ErrorInfo | undefined;
  setting: Setting[];
  stream_id: number;
  /** Should be "1" */
  last_stream_id_received: number;
  heartbeat_config:
    | HeartbeatConfig
    | undefined;
  /** used by the client to synchronize with the server timestamp. */
  server_timestamp: bigint;
}

export interface StreamErrorStanza {
  type: string;
  text: string;
}

/** TAG: 4 */
export interface Close {
}

export interface Extension {
  /**
   * 12: SelectiveAck
   * 13: StreamAck
   */
  id: number;
  data: Uint8Array;
}

/**
 * TAG: 7
 * IqRequest must contain a single extension.  IqResponse may contain 0 or 1
 * extensions.
 */
export interface IqStanza {
  rmq_id: bigint;
  type: IqStanzaIqType;
  id: string;
  from: string;
  to: string;
  error:
    | ErrorInfo
    | undefined;
  /** Only field used in the 38+ protocol (besides common last_stream_id_received, status, rmq_id) */
  extension: Extension | undefined;
  persistent_id: string;
  stream_id: number;
  last_stream_id_received: number;
  account_id: bigint;
  status: bigint;
}

export enum IqStanzaIqType {
  GET = 0,
  SET = 1,
  RESULT = 2,
  IQ_ERROR = 3,
  UNRECOGNIZED = -1,
}

export function iqStanzaIqTypeFromJSON(object: any): IqStanzaIqType {
  switch (object) {
    case 0:
    case "GET":
      return IqStanzaIqType.GET;
    case 1:
    case "SET":
      return IqStanzaIqType.SET;
    case 2:
    case "RESULT":
      return IqStanzaIqType.RESULT;
    case 3:
    case "IQ_ERROR":
      return IqStanzaIqType.IQ_ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IqStanzaIqType.UNRECOGNIZED;
  }
}

export function iqStanzaIqTypeToJSON(object: IqStanzaIqType): string {
  switch (object) {
    case IqStanzaIqType.GET:
      return "GET";
    case IqStanzaIqType.SET:
      return "SET";
    case IqStanzaIqType.RESULT:
      return "RESULT";
    case IqStanzaIqType.IQ_ERROR:
      return "IQ_ERROR";
    case IqStanzaIqType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface AppData {
  key: string;
  value: string;
}

/** TAG: 8 */
export interface DataMessageStanza {
  /** This is the message ID, set by client, DMP.9 (message_id) */
  id: string;
  /** Project ID of the sender, DMP.1 */
  from: string;
  /** Part of DMRequest - also the key in DataMessageProto. */
  to: string;
  /** Package name. DMP.2 */
  category: string;
  /** The collapsed key, DMP.3 */
  token: string;
  /** User data + GOOGLE. prefixed special entries, DMP.4 */
  app_data: AppData[];
  /** Not used. */
  from_trusted_server: boolean;
  /**
   * Part of the ACK protocol, returned in DataMessageResponse on server side.
   * It's part of the key of DMP.
   */
  persistent_id: string;
  /**
   * In-stream ack. Increments on each message sent - a bit redundant
   * Not used in DMP/DMR.
   */
  stream_id: number;
  last_stream_id_received: number;
  /** Sent by the device shortly after registration. */
  reg_id: string;
  /**
   * serial number of the target user, DMP.8
   * It is the 'serial number' according to user manager.
   */
  device_user_id: bigint;
  /** Time to live, in seconds. */
  ttl: number;
  /** Timestamp ( according to client ) when message was sent by app, in seconds */
  sent: bigint;
  /**
   * How long has the message been queued before the flush, in seconds.
   * This is needed to account for the time difference between server and
   * client: server should adjust 'sent' based on its 'receive' time.
   */
  queued: number;
  status: bigint;
  /** Optional field containing the binary payload of the message. */
  raw_data: Uint8Array;
  /**
   * If set the server requests immediate ack. Used for important messages and
   * for testing.
   */
  immediate_ack: boolean;
}

/**
 * Included in IQ with ID 13, sent from client or server after 10 unconfirmed
 * messages.
 */
export interface StreamAck {
}

/** Included in IQ sent after LoginResponse from server with ID 12. */
export interface SelectiveAck {
  id: string[];
}

function createBaseHeartbeatPing(): HeartbeatPing {
  return { stream_id: 0, last_stream_id_received: 0, status: BigInt("0") };
}

export const HeartbeatPing = {
  encode(message: HeartbeatPing, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stream_id !== 0) {
      writer.uint32(8).int32(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      writer.uint32(16).int32(message.last_stream_id_received);
    }
    if (message.status !== BigInt("0")) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new globalThis.Error("value provided for field message.status of type int64 too large");
      }
      writer.uint32(24).int64(message.status.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatPing {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeatPing();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stream_id = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.last_stream_id_received = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.status = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HeartbeatPing {
    return {
      stream_id: isSet(object.stream_id) ? globalThis.Number(object.stream_id) : 0,
      last_stream_id_received: isSet(object.last_stream_id_received)
        ? globalThis.Number(object.last_stream_id_received)
        : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt("0"),
    };
  },

  toJSON(message: HeartbeatPing): unknown {
    const obj: any = {};
    if (message.stream_id !== 0) {
      obj.stream_id = Math.round(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      obj.last_stream_id_received = Math.round(message.last_stream_id_received);
    }
    if (message.status !== BigInt("0")) {
      obj.status = message.status.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartbeatPing>, I>>(base?: I): HeartbeatPing {
    return HeartbeatPing.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatPing>, I>>(object: I): HeartbeatPing {
    const message = createBaseHeartbeatPing();
    message.stream_id = object.stream_id ?? 0;
    message.last_stream_id_received = object.last_stream_id_received ?? 0;
    message.status = object.status ?? BigInt("0");
    return message;
  },
};

function createBaseHeartbeatAck(): HeartbeatAck {
  return { stream_id: 0, last_stream_id_received: 0, status: BigInt("0") };
}

export const HeartbeatAck = {
  encode(message: HeartbeatAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stream_id !== 0) {
      writer.uint32(8).int32(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      writer.uint32(16).int32(message.last_stream_id_received);
    }
    if (message.status !== BigInt("0")) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new globalThis.Error("value provided for field message.status of type int64 too large");
      }
      writer.uint32(24).int64(message.status.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeatAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stream_id = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.last_stream_id_received = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.status = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HeartbeatAck {
    return {
      stream_id: isSet(object.stream_id) ? globalThis.Number(object.stream_id) : 0,
      last_stream_id_received: isSet(object.last_stream_id_received)
        ? globalThis.Number(object.last_stream_id_received)
        : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt("0"),
    };
  },

  toJSON(message: HeartbeatAck): unknown {
    const obj: any = {};
    if (message.stream_id !== 0) {
      obj.stream_id = Math.round(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      obj.last_stream_id_received = Math.round(message.last_stream_id_received);
    }
    if (message.status !== BigInt("0")) {
      obj.status = message.status.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartbeatAck>, I>>(base?: I): HeartbeatAck {
    return HeartbeatAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatAck>, I>>(object: I): HeartbeatAck {
    const message = createBaseHeartbeatAck();
    message.stream_id = object.stream_id ?? 0;
    message.last_stream_id_received = object.last_stream_id_received ?? 0;
    message.status = object.status ?? BigInt("0");
    return message;
  },
};

function createBaseErrorInfo(): ErrorInfo {
  return { code: 0, message: "", type: "", extension: undefined };
}

export const ErrorInfo = {
  encode(message: ErrorInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.extension !== undefined) {
      Extension.encode(message.extension, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ErrorInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseErrorInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.type = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.extension = Extension.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ErrorInfo {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      extension: isSet(object.extension) ? Extension.fromJSON(object.extension) : undefined,
    };
  },

  toJSON(message: ErrorInfo): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.type !== "") {
      obj.type = message.type;
    }
    if (message.extension !== undefined) {
      obj.extension = Extension.toJSON(message.extension);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ErrorInfo>, I>>(base?: I): ErrorInfo {
    return ErrorInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ErrorInfo>, I>>(object: I): ErrorInfo {
    const message = createBaseErrorInfo();
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.type = object.type ?? "";
    message.extension = (object.extension !== undefined && object.extension !== null)
      ? Extension.fromPartial(object.extension)
      : undefined;
    return message;
  },
};

function createBaseSetting(): Setting {
  return { name: "", value: "" };
}

export const Setting = {
  encode(message: Setting, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Setting {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetting();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Setting {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Setting): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Setting>, I>>(base?: I): Setting {
    return Setting.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Setting>, I>>(object: I): Setting {
    const message = createBaseSetting();
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseHeartbeatStat(): HeartbeatStat {
  return { ip: "", timeout: false, interval_ms: 0 };
}

export const HeartbeatStat = {
  encode(message: HeartbeatStat, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ip !== "") {
      writer.uint32(10).string(message.ip);
    }
    if (message.timeout === true) {
      writer.uint32(16).bool(message.timeout);
    }
    if (message.interval_ms !== 0) {
      writer.uint32(24).int32(message.interval_ms);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatStat {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeatStat();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ip = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.timeout = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.interval_ms = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HeartbeatStat {
    return {
      ip: isSet(object.ip) ? globalThis.String(object.ip) : "",
      timeout: isSet(object.timeout) ? globalThis.Boolean(object.timeout) : false,
      interval_ms: isSet(object.interval_ms) ? globalThis.Number(object.interval_ms) : 0,
    };
  },

  toJSON(message: HeartbeatStat): unknown {
    const obj: any = {};
    if (message.ip !== "") {
      obj.ip = message.ip;
    }
    if (message.timeout === true) {
      obj.timeout = message.timeout;
    }
    if (message.interval_ms !== 0) {
      obj.interval_ms = Math.round(message.interval_ms);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartbeatStat>, I>>(base?: I): HeartbeatStat {
    return HeartbeatStat.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatStat>, I>>(object: I): HeartbeatStat {
    const message = createBaseHeartbeatStat();
    message.ip = object.ip ?? "";
    message.timeout = object.timeout ?? false;
    message.interval_ms = object.interval_ms ?? 0;
    return message;
  },
};

function createBaseHeartbeatConfig(): HeartbeatConfig {
  return { upload_stat: false, ip: "", interval_ms: 0 };
}

export const HeartbeatConfig = {
  encode(message: HeartbeatConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.upload_stat === true) {
      writer.uint32(8).bool(message.upload_stat);
    }
    if (message.ip !== "") {
      writer.uint32(18).string(message.ip);
    }
    if (message.interval_ms !== 0) {
      writer.uint32(24).int32(message.interval_ms);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeatConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.upload_stat = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ip = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.interval_ms = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HeartbeatConfig {
    return {
      upload_stat: isSet(object.upload_stat) ? globalThis.Boolean(object.upload_stat) : false,
      ip: isSet(object.ip) ? globalThis.String(object.ip) : "",
      interval_ms: isSet(object.interval_ms) ? globalThis.Number(object.interval_ms) : 0,
    };
  },

  toJSON(message: HeartbeatConfig): unknown {
    const obj: any = {};
    if (message.upload_stat === true) {
      obj.upload_stat = message.upload_stat;
    }
    if (message.ip !== "") {
      obj.ip = message.ip;
    }
    if (message.interval_ms !== 0) {
      obj.interval_ms = Math.round(message.interval_ms);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartbeatConfig>, I>>(base?: I): HeartbeatConfig {
    return HeartbeatConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatConfig>, I>>(object: I): HeartbeatConfig {
    const message = createBaseHeartbeatConfig();
    message.upload_stat = object.upload_stat ?? false;
    message.ip = object.ip ?? "";
    message.interval_ms = object.interval_ms ?? 0;
    return message;
  },
};

function createBaseClientEvent(): ClientEvent {
  return {
    type: 0,
    number_discarded_events: 0,
    network_type: 0,
    time_connection_started_ms: BigInt("0"),
    time_connection_ended_ms: BigInt("0"),
    error_code: 0,
    time_connection_established_ms: BigInt("0"),
  };
}

export const ClientEvent = {
  encode(message: ClientEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.number_discarded_events !== 0) {
      writer.uint32(800).uint32(message.number_discarded_events);
    }
    if (message.network_type !== 0) {
      writer.uint32(1600).int32(message.network_type);
    }
    if (message.time_connection_started_ms !== BigInt("0")) {
      if (BigInt.asUintN(64, message.time_connection_started_ms) !== message.time_connection_started_ms) {
        throw new globalThis.Error(
          "value provided for field message.time_connection_started_ms of type uint64 too large",
        );
      }
      writer.uint32(1616).uint64(message.time_connection_started_ms.toString());
    }
    if (message.time_connection_ended_ms !== BigInt("0")) {
      if (BigInt.asUintN(64, message.time_connection_ended_ms) !== message.time_connection_ended_ms) {
        throw new globalThis.Error(
          "value provided for field message.time_connection_ended_ms of type uint64 too large",
        );
      }
      writer.uint32(1624).uint64(message.time_connection_ended_ms.toString());
    }
    if (message.error_code !== 0) {
      writer.uint32(1632).int32(message.error_code);
    }
    if (message.time_connection_established_ms !== BigInt("0")) {
      if (BigInt.asUintN(64, message.time_connection_established_ms) !== message.time_connection_established_ms) {
        throw new globalThis.Error(
          "value provided for field message.time_connection_established_ms of type uint64 too large",
        );
      }
      writer.uint32(2400).uint64(message.time_connection_established_ms.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.number_discarded_events = reader.uint32();
          continue;
        case 200:
          if (tag !== 1600) {
            break;
          }

          message.network_type = reader.int32();
          continue;
        case 202:
          if (tag !== 1616) {
            break;
          }

          message.time_connection_started_ms = longToBigint(reader.uint64() as Long);
          continue;
        case 203:
          if (tag !== 1624) {
            break;
          }

          message.time_connection_ended_ms = longToBigint(reader.uint64() as Long);
          continue;
        case 204:
          if (tag !== 1632) {
            break;
          }

          message.error_code = reader.int32();
          continue;
        case 300:
          if (tag !== 2400) {
            break;
          }

          message.time_connection_established_ms = longToBigint(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ClientEvent {
    return {
      type: isSet(object.type) ? clientEventTypeFromJSON(object.type) : 0,
      number_discarded_events: isSet(object.number_discarded_events)
        ? globalThis.Number(object.number_discarded_events)
        : 0,
      network_type: isSet(object.network_type) ? globalThis.Number(object.network_type) : 0,
      time_connection_started_ms: isSet(object.time_connection_started_ms)
        ? BigInt(object.time_connection_started_ms)
        : BigInt("0"),
      time_connection_ended_ms: isSet(object.time_connection_ended_ms)
        ? BigInt(object.time_connection_ended_ms)
        : BigInt("0"),
      error_code: isSet(object.error_code) ? globalThis.Number(object.error_code) : 0,
      time_connection_established_ms: isSet(object.time_connection_established_ms)
        ? BigInt(object.time_connection_established_ms)
        : BigInt("0"),
    };
  },

  toJSON(message: ClientEvent): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = clientEventTypeToJSON(message.type);
    }
    if (message.number_discarded_events !== 0) {
      obj.number_discarded_events = Math.round(message.number_discarded_events);
    }
    if (message.network_type !== 0) {
      obj.network_type = Math.round(message.network_type);
    }
    if (message.time_connection_started_ms !== BigInt("0")) {
      obj.time_connection_started_ms = message.time_connection_started_ms.toString();
    }
    if (message.time_connection_ended_ms !== BigInt("0")) {
      obj.time_connection_ended_ms = message.time_connection_ended_ms.toString();
    }
    if (message.error_code !== 0) {
      obj.error_code = Math.round(message.error_code);
    }
    if (message.time_connection_established_ms !== BigInt("0")) {
      obj.time_connection_established_ms = message.time_connection_established_ms.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClientEvent>, I>>(base?: I): ClientEvent {
    return ClientEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClientEvent>, I>>(object: I): ClientEvent {
    const message = createBaseClientEvent();
    message.type = object.type ?? 0;
    message.number_discarded_events = object.number_discarded_events ?? 0;
    message.network_type = object.network_type ?? 0;
    message.time_connection_started_ms = object.time_connection_started_ms ?? BigInt("0");
    message.time_connection_ended_ms = object.time_connection_ended_ms ?? BigInt("0");
    message.error_code = object.error_code ?? 0;
    message.time_connection_established_ms = object.time_connection_established_ms ?? BigInt("0");
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return {
    id: "",
    domain: "",
    user: "",
    resource: "",
    auth_token: "",
    device_id: "",
    last_rmq_id: BigInt("0"),
    setting: [],
    received_persistent_id: [],
    adaptive_heartbeat: false,
    heartbeat_stat: undefined,
    use_rmq2: false,
    account_id: BigInt("0"),
    auth_service: -1,
    network_type: 0,
    status: BigInt("0"),
    client_event: [],
  };
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.domain !== "") {
      writer.uint32(18).string(message.domain);
    }
    if (message.user !== "") {
      writer.uint32(26).string(message.user);
    }
    if (message.resource !== "") {
      writer.uint32(34).string(message.resource);
    }
    if (message.auth_token !== "") {
      writer.uint32(42).string(message.auth_token);
    }
    if (message.device_id !== "") {
      writer.uint32(50).string(message.device_id);
    }
    if (message.last_rmq_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.last_rmq_id) !== message.last_rmq_id) {
        throw new globalThis.Error("value provided for field message.last_rmq_id of type int64 too large");
      }
      writer.uint32(56).int64(message.last_rmq_id.toString());
    }
    for (const v of message.setting) {
      Setting.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.received_persistent_id) {
      writer.uint32(82).string(v!);
    }
    if (message.adaptive_heartbeat === true) {
      writer.uint32(96).bool(message.adaptive_heartbeat);
    }
    if (message.heartbeat_stat !== undefined) {
      HeartbeatStat.encode(message.heartbeat_stat, writer.uint32(106).fork()).ldelim();
    }
    if (message.use_rmq2 === true) {
      writer.uint32(112).bool(message.use_rmq2);
    }
    if (message.account_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.account_id) !== message.account_id) {
        throw new globalThis.Error("value provided for field message.account_id of type int64 too large");
      }
      writer.uint32(120).int64(message.account_id.toString());
    }
    if (message.auth_service !== -1) {
      writer.uint32(128).int32(message.auth_service);
    }
    if (message.network_type !== 0) {
      writer.uint32(136).int32(message.network_type);
    }
    if (message.status !== BigInt("0")) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new globalThis.Error("value provided for field message.status of type int64 too large");
      }
      writer.uint32(144).int64(message.status.toString());
    }
    for (const v of message.client_event) {
      ClientEvent.encode(v!, writer.uint32(178).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.domain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.user = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.resource = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.auth_token = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.device_id = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.last_rmq_id = longToBigint(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.setting.push(Setting.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.received_persistent_id.push(reader.string());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.adaptive_heartbeat = reader.bool();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.heartbeat_stat = HeartbeatStat.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.use_rmq2 = reader.bool();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.account_id = longToBigint(reader.int64() as Long);
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.auth_service = reader.int32() as any;
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.network_type = reader.int32();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.status = longToBigint(reader.int64() as Long);
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.client_event.push(ClientEvent.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      domain: isSet(object.domain) ? globalThis.String(object.domain) : "",
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      resource: isSet(object.resource) ? globalThis.String(object.resource) : "",
      auth_token: isSet(object.auth_token) ? globalThis.String(object.auth_token) : "",
      device_id: isSet(object.device_id) ? globalThis.String(object.device_id) : "",
      last_rmq_id: isSet(object.last_rmq_id) ? BigInt(object.last_rmq_id) : BigInt("0"),
      setting: globalThis.Array.isArray(object?.setting) ? object.setting.map((e: any) => Setting.fromJSON(e)) : [],
      received_persistent_id: globalThis.Array.isArray(object?.received_persistent_id)
        ? object.received_persistent_id.map((e: any) => globalThis.String(e))
        : [],
      adaptive_heartbeat: isSet(object.adaptive_heartbeat) ? globalThis.Boolean(object.adaptive_heartbeat) : false,
      heartbeat_stat: isSet(object.heartbeat_stat) ? HeartbeatStat.fromJSON(object.heartbeat_stat) : undefined,
      use_rmq2: isSet(object.use_rmq2) ? globalThis.Boolean(object.use_rmq2) : false,
      account_id: isSet(object.account_id) ? BigInt(object.account_id) : BigInt("0"),
      auth_service: isSet(object.auth_service) ? loginRequestAuthServiceFromJSON(object.auth_service) : -1,
      network_type: isSet(object.network_type) ? globalThis.Number(object.network_type) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt("0"),
      client_event: globalThis.Array.isArray(object?.client_event)
        ? object.client_event.map((e: any) => ClientEvent.fromJSON(e))
        : [],
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.domain !== "") {
      obj.domain = message.domain;
    }
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.resource !== "") {
      obj.resource = message.resource;
    }
    if (message.auth_token !== "") {
      obj.auth_token = message.auth_token;
    }
    if (message.device_id !== "") {
      obj.device_id = message.device_id;
    }
    if (message.last_rmq_id !== BigInt("0")) {
      obj.last_rmq_id = message.last_rmq_id.toString();
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => Setting.toJSON(e));
    }
    if (message.received_persistent_id?.length) {
      obj.received_persistent_id = message.received_persistent_id;
    }
    if (message.adaptive_heartbeat === true) {
      obj.adaptive_heartbeat = message.adaptive_heartbeat;
    }
    if (message.heartbeat_stat !== undefined) {
      obj.heartbeat_stat = HeartbeatStat.toJSON(message.heartbeat_stat);
    }
    if (message.use_rmq2 === true) {
      obj.use_rmq2 = message.use_rmq2;
    }
    if (message.account_id !== BigInt("0")) {
      obj.account_id = message.account_id.toString();
    }
    if (message.auth_service !== -1) {
      obj.auth_service = loginRequestAuthServiceToJSON(message.auth_service);
    }
    if (message.network_type !== 0) {
      obj.network_type = Math.round(message.network_type);
    }
    if (message.status !== BigInt("0")) {
      obj.status = message.status.toString();
    }
    if (message.client_event?.length) {
      obj.client_event = message.client_event.map((e) => ClientEvent.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(base?: I): LoginRequest {
    return LoginRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.id = object.id ?? "";
    message.domain = object.domain ?? "";
    message.user = object.user ?? "";
    message.resource = object.resource ?? "";
    message.auth_token = object.auth_token ?? "";
    message.device_id = object.device_id ?? "";
    message.last_rmq_id = object.last_rmq_id ?? BigInt("0");
    message.setting = object.setting?.map((e) => Setting.fromPartial(e)) || [];
    message.received_persistent_id = object.received_persistent_id?.map((e) => e) || [];
    message.adaptive_heartbeat = object.adaptive_heartbeat ?? false;
    message.heartbeat_stat = (object.heartbeat_stat !== undefined && object.heartbeat_stat !== null)
      ? HeartbeatStat.fromPartial(object.heartbeat_stat)
      : undefined;
    message.use_rmq2 = object.use_rmq2 ?? false;
    message.account_id = object.account_id ?? BigInt("0");
    message.auth_service = object.auth_service ?? -1;
    message.network_type = object.network_type ?? 0;
    message.status = object.status ?? BigInt("0");
    message.client_event = object.client_event?.map((e) => ClientEvent.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLoginResponse(): LoginResponse {
  return {
    id: "",
    jid: "",
    error: undefined,
    setting: [],
    stream_id: 0,
    last_stream_id_received: 0,
    heartbeat_config: undefined,
    server_timestamp: BigInt("0"),
  };
}

export const LoginResponse = {
  encode(message: LoginResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.jid !== "") {
      writer.uint32(18).string(message.jid);
    }
    if (message.error !== undefined) {
      ErrorInfo.encode(message.error, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.setting) {
      Setting.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.stream_id !== 0) {
      writer.uint32(40).int32(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      writer.uint32(48).int32(message.last_stream_id_received);
    }
    if (message.heartbeat_config !== undefined) {
      HeartbeatConfig.encode(message.heartbeat_config, writer.uint32(58).fork()).ldelim();
    }
    if (message.server_timestamp !== BigInt("0")) {
      if (BigInt.asIntN(64, message.server_timestamp) !== message.server_timestamp) {
        throw new globalThis.Error("value provided for field message.server_timestamp of type int64 too large");
      }
      writer.uint32(64).int64(message.server_timestamp.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.jid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.error = ErrorInfo.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.setting.push(Setting.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.stream_id = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.last_stream_id_received = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.heartbeat_config = HeartbeatConfig.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.server_timestamp = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginResponse {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      jid: isSet(object.jid) ? globalThis.String(object.jid) : "",
      error: isSet(object.error) ? ErrorInfo.fromJSON(object.error) : undefined,
      setting: globalThis.Array.isArray(object?.setting) ? object.setting.map((e: any) => Setting.fromJSON(e)) : [],
      stream_id: isSet(object.stream_id) ? globalThis.Number(object.stream_id) : 0,
      last_stream_id_received: isSet(object.last_stream_id_received)
        ? globalThis.Number(object.last_stream_id_received)
        : 0,
      heartbeat_config: isSet(object.heartbeat_config) ? HeartbeatConfig.fromJSON(object.heartbeat_config) : undefined,
      server_timestamp: isSet(object.server_timestamp) ? BigInt(object.server_timestamp) : BigInt("0"),
    };
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.jid !== "") {
      obj.jid = message.jid;
    }
    if (message.error !== undefined) {
      obj.error = ErrorInfo.toJSON(message.error);
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => Setting.toJSON(e));
    }
    if (message.stream_id !== 0) {
      obj.stream_id = Math.round(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      obj.last_stream_id_received = Math.round(message.last_stream_id_received);
    }
    if (message.heartbeat_config !== undefined) {
      obj.heartbeat_config = HeartbeatConfig.toJSON(message.heartbeat_config);
    }
    if (message.server_timestamp !== BigInt("0")) {
      obj.server_timestamp = message.server_timestamp.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginResponse>, I>>(base?: I): LoginResponse {
    return LoginResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(object: I): LoginResponse {
    const message = createBaseLoginResponse();
    message.id = object.id ?? "";
    message.jid = object.jid ?? "";
    message.error = (object.error !== undefined && object.error !== null)
      ? ErrorInfo.fromPartial(object.error)
      : undefined;
    message.setting = object.setting?.map((e) => Setting.fromPartial(e)) || [];
    message.stream_id = object.stream_id ?? 0;
    message.last_stream_id_received = object.last_stream_id_received ?? 0;
    message.heartbeat_config = (object.heartbeat_config !== undefined && object.heartbeat_config !== null)
      ? HeartbeatConfig.fromPartial(object.heartbeat_config)
      : undefined;
    message.server_timestamp = object.server_timestamp ?? BigInt("0");
    return message;
  },
};

function createBaseStreamErrorStanza(): StreamErrorStanza {
  return { type: "", text: "" };
}

export const StreamErrorStanza = {
  encode(message: StreamErrorStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.text !== "") {
      writer.uint32(18).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamErrorStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamErrorStanza();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.text = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamErrorStanza {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      text: isSet(object.text) ? globalThis.String(object.text) : "",
    };
  },

  toJSON(message: StreamErrorStanza): unknown {
    const obj: any = {};
    if (message.type !== "") {
      obj.type = message.type;
    }
    if (message.text !== "") {
      obj.text = message.text;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamErrorStanza>, I>>(base?: I): StreamErrorStanza {
    return StreamErrorStanza.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamErrorStanza>, I>>(object: I): StreamErrorStanza {
    const message = createBaseStreamErrorStanza();
    message.type = object.type ?? "";
    message.text = object.text ?? "";
    return message;
  },
};

function createBaseClose(): Close {
  return {};
}

export const Close = {
  encode(_: Close, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Close {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClose();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Close {
    return {};
  },

  toJSON(_: Close): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Close>, I>>(base?: I): Close {
    return Close.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Close>, I>>(_: I): Close {
    const message = createBaseClose();
    return message;
  },
};

function createBaseExtension(): Extension {
  return { id: 0, data: new Uint8Array(0) };
}

export const Extension = {
  encode(message: Extension, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Extension {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtension();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.data = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Extension {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: Extension): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Extension>, I>>(base?: I): Extension {
    return Extension.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Extension>, I>>(object: I): Extension {
    const message = createBaseExtension();
    message.id = object.id ?? 0;
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

function createBaseIqStanza(): IqStanza {
  return {
    rmq_id: BigInt("0"),
    type: 0,
    id: "",
    from: "",
    to: "",
    error: undefined,
    extension: undefined,
    persistent_id: "",
    stream_id: 0,
    last_stream_id_received: 0,
    account_id: BigInt("0"),
    status: BigInt("0"),
  };
}

export const IqStanza = {
  encode(message: IqStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rmq_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.rmq_id) !== message.rmq_id) {
        throw new globalThis.Error("value provided for field message.rmq_id of type int64 too large");
      }
      writer.uint32(8).int64(message.rmq_id.toString());
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.id !== "") {
      writer.uint32(26).string(message.id);
    }
    if (message.from !== "") {
      writer.uint32(34).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(42).string(message.to);
    }
    if (message.error !== undefined) {
      ErrorInfo.encode(message.error, writer.uint32(50).fork()).ldelim();
    }
    if (message.extension !== undefined) {
      Extension.encode(message.extension, writer.uint32(58).fork()).ldelim();
    }
    if (message.persistent_id !== "") {
      writer.uint32(66).string(message.persistent_id);
    }
    if (message.stream_id !== 0) {
      writer.uint32(72).int32(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      writer.uint32(80).int32(message.last_stream_id_received);
    }
    if (message.account_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.account_id) !== message.account_id) {
        throw new globalThis.Error("value provided for field message.account_id of type int64 too large");
      }
      writer.uint32(88).int64(message.account_id.toString());
    }
    if (message.status !== BigInt("0")) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new globalThis.Error("value provided for field message.status of type int64 too large");
      }
      writer.uint32(96).int64(message.status.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IqStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIqStanza();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.rmq_id = longToBigint(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.id = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.from = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.to = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.error = ErrorInfo.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.extension = Extension.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.persistent_id = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.stream_id = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.last_stream_id_received = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.account_id = longToBigint(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.status = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IqStanza {
    return {
      rmq_id: isSet(object.rmq_id) ? BigInt(object.rmq_id) : BigInt("0"),
      type: isSet(object.type) ? iqStanzaIqTypeFromJSON(object.type) : 0,
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      from: isSet(object.from) ? globalThis.String(object.from) : "",
      to: isSet(object.to) ? globalThis.String(object.to) : "",
      error: isSet(object.error) ? ErrorInfo.fromJSON(object.error) : undefined,
      extension: isSet(object.extension) ? Extension.fromJSON(object.extension) : undefined,
      persistent_id: isSet(object.persistent_id) ? globalThis.String(object.persistent_id) : "",
      stream_id: isSet(object.stream_id) ? globalThis.Number(object.stream_id) : 0,
      last_stream_id_received: isSet(object.last_stream_id_received)
        ? globalThis.Number(object.last_stream_id_received)
        : 0,
      account_id: isSet(object.account_id) ? BigInt(object.account_id) : BigInt("0"),
      status: isSet(object.status) ? BigInt(object.status) : BigInt("0"),
    };
  },

  toJSON(message: IqStanza): unknown {
    const obj: any = {};
    if (message.rmq_id !== BigInt("0")) {
      obj.rmq_id = message.rmq_id.toString();
    }
    if (message.type !== 0) {
      obj.type = iqStanzaIqTypeToJSON(message.type);
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.from !== "") {
      obj.from = message.from;
    }
    if (message.to !== "") {
      obj.to = message.to;
    }
    if (message.error !== undefined) {
      obj.error = ErrorInfo.toJSON(message.error);
    }
    if (message.extension !== undefined) {
      obj.extension = Extension.toJSON(message.extension);
    }
    if (message.persistent_id !== "") {
      obj.persistent_id = message.persistent_id;
    }
    if (message.stream_id !== 0) {
      obj.stream_id = Math.round(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      obj.last_stream_id_received = Math.round(message.last_stream_id_received);
    }
    if (message.account_id !== BigInt("0")) {
      obj.account_id = message.account_id.toString();
    }
    if (message.status !== BigInt("0")) {
      obj.status = message.status.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IqStanza>, I>>(base?: I): IqStanza {
    return IqStanza.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IqStanza>, I>>(object: I): IqStanza {
    const message = createBaseIqStanza();
    message.rmq_id = object.rmq_id ?? BigInt("0");
    message.type = object.type ?? 0;
    message.id = object.id ?? "";
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.error = (object.error !== undefined && object.error !== null)
      ? ErrorInfo.fromPartial(object.error)
      : undefined;
    message.extension = (object.extension !== undefined && object.extension !== null)
      ? Extension.fromPartial(object.extension)
      : undefined;
    message.persistent_id = object.persistent_id ?? "";
    message.stream_id = object.stream_id ?? 0;
    message.last_stream_id_received = object.last_stream_id_received ?? 0;
    message.account_id = object.account_id ?? BigInt("0");
    message.status = object.status ?? BigInt("0");
    return message;
  },
};

function createBaseAppData(): AppData {
  return { key: "", value: "" };
}

export const AppData = {
  encode(message: AppData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AppData {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: AppData): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AppData>, I>>(base?: I): AppData {
    return AppData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppData>, I>>(object: I): AppData {
    const message = createBaseAppData();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDataMessageStanza(): DataMessageStanza {
  return {
    id: "",
    from: "",
    to: "",
    category: "",
    token: "",
    app_data: [],
    from_trusted_server: false,
    persistent_id: "",
    stream_id: 0,
    last_stream_id_received: 0,
    reg_id: "",
    device_user_id: BigInt("0"),
    ttl: 0,
    sent: BigInt("0"),
    queued: 0,
    status: BigInt("0"),
    raw_data: new Uint8Array(0),
    immediate_ack: false,
  };
}

export const DataMessageStanza = {
  encode(message: DataMessageStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.from !== "") {
      writer.uint32(26).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(34).string(message.to);
    }
    if (message.category !== "") {
      writer.uint32(42).string(message.category);
    }
    if (message.token !== "") {
      writer.uint32(50).string(message.token);
    }
    for (const v of message.app_data) {
      AppData.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.from_trusted_server === true) {
      writer.uint32(64).bool(message.from_trusted_server);
    }
    if (message.persistent_id !== "") {
      writer.uint32(74).string(message.persistent_id);
    }
    if (message.stream_id !== 0) {
      writer.uint32(80).int32(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      writer.uint32(88).int32(message.last_stream_id_received);
    }
    if (message.reg_id !== "") {
      writer.uint32(106).string(message.reg_id);
    }
    if (message.device_user_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.device_user_id) !== message.device_user_id) {
        throw new globalThis.Error("value provided for field message.device_user_id of type int64 too large");
      }
      writer.uint32(128).int64(message.device_user_id.toString());
    }
    if (message.ttl !== 0) {
      writer.uint32(136).int32(message.ttl);
    }
    if (message.sent !== BigInt("0")) {
      if (BigInt.asIntN(64, message.sent) !== message.sent) {
        throw new globalThis.Error("value provided for field message.sent of type int64 too large");
      }
      writer.uint32(144).int64(message.sent.toString());
    }
    if (message.queued !== 0) {
      writer.uint32(152).int32(message.queued);
    }
    if (message.status !== BigInt("0")) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new globalThis.Error("value provided for field message.status of type int64 too large");
      }
      writer.uint32(160).int64(message.status.toString());
    }
    if (message.raw_data.length !== 0) {
      writer.uint32(170).bytes(message.raw_data);
    }
    if (message.immediate_ack === true) {
      writer.uint32(192).bool(message.immediate_ack);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataMessageStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataMessageStanza();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.from = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.to = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.category = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.token = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.app_data.push(AppData.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.from_trusted_server = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.persistent_id = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.stream_id = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.last_stream_id_received = reader.int32();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.reg_id = reader.string();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.device_user_id = longToBigint(reader.int64() as Long);
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.ttl = reader.int32();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.sent = longToBigint(reader.int64() as Long);
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.queued = reader.int32();
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.status = longToBigint(reader.int64() as Long);
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.raw_data = reader.bytes();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.immediate_ack = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DataMessageStanza {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      from: isSet(object.from) ? globalThis.String(object.from) : "",
      to: isSet(object.to) ? globalThis.String(object.to) : "",
      category: isSet(object.category) ? globalThis.String(object.category) : "",
      token: isSet(object.token) ? globalThis.String(object.token) : "",
      app_data: globalThis.Array.isArray(object?.app_data) ? object.app_data.map((e: any) => AppData.fromJSON(e)) : [],
      from_trusted_server: isSet(object.from_trusted_server) ? globalThis.Boolean(object.from_trusted_server) : false,
      persistent_id: isSet(object.persistent_id) ? globalThis.String(object.persistent_id) : "",
      stream_id: isSet(object.stream_id) ? globalThis.Number(object.stream_id) : 0,
      last_stream_id_received: isSet(object.last_stream_id_received)
        ? globalThis.Number(object.last_stream_id_received)
        : 0,
      reg_id: isSet(object.reg_id) ? globalThis.String(object.reg_id) : "",
      device_user_id: isSet(object.device_user_id) ? BigInt(object.device_user_id) : BigInt("0"),
      ttl: isSet(object.ttl) ? globalThis.Number(object.ttl) : 0,
      sent: isSet(object.sent) ? BigInt(object.sent) : BigInt("0"),
      queued: isSet(object.queued) ? globalThis.Number(object.queued) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt("0"),
      raw_data: isSet(object.raw_data) ? bytesFromBase64(object.raw_data) : new Uint8Array(0),
      immediate_ack: isSet(object.immediate_ack) ? globalThis.Boolean(object.immediate_ack) : false,
    };
  },

  toJSON(message: DataMessageStanza): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.from !== "") {
      obj.from = message.from;
    }
    if (message.to !== "") {
      obj.to = message.to;
    }
    if (message.category !== "") {
      obj.category = message.category;
    }
    if (message.token !== "") {
      obj.token = message.token;
    }
    if (message.app_data?.length) {
      obj.app_data = message.app_data.map((e) => AppData.toJSON(e));
    }
    if (message.from_trusted_server === true) {
      obj.from_trusted_server = message.from_trusted_server;
    }
    if (message.persistent_id !== "") {
      obj.persistent_id = message.persistent_id;
    }
    if (message.stream_id !== 0) {
      obj.stream_id = Math.round(message.stream_id);
    }
    if (message.last_stream_id_received !== 0) {
      obj.last_stream_id_received = Math.round(message.last_stream_id_received);
    }
    if (message.reg_id !== "") {
      obj.reg_id = message.reg_id;
    }
    if (message.device_user_id !== BigInt("0")) {
      obj.device_user_id = message.device_user_id.toString();
    }
    if (message.ttl !== 0) {
      obj.ttl = Math.round(message.ttl);
    }
    if (message.sent !== BigInt("0")) {
      obj.sent = message.sent.toString();
    }
    if (message.queued !== 0) {
      obj.queued = Math.round(message.queued);
    }
    if (message.status !== BigInt("0")) {
      obj.status = message.status.toString();
    }
    if (message.raw_data.length !== 0) {
      obj.raw_data = base64FromBytes(message.raw_data);
    }
    if (message.immediate_ack === true) {
      obj.immediate_ack = message.immediate_ack;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DataMessageStanza>, I>>(base?: I): DataMessageStanza {
    return DataMessageStanza.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DataMessageStanza>, I>>(object: I): DataMessageStanza {
    const message = createBaseDataMessageStanza();
    message.id = object.id ?? "";
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.category = object.category ?? "";
    message.token = object.token ?? "";
    message.app_data = object.app_data?.map((e) => AppData.fromPartial(e)) || [];
    message.from_trusted_server = object.from_trusted_server ?? false;
    message.persistent_id = object.persistent_id ?? "";
    message.stream_id = object.stream_id ?? 0;
    message.last_stream_id_received = object.last_stream_id_received ?? 0;
    message.reg_id = object.reg_id ?? "";
    message.device_user_id = object.device_user_id ?? BigInt("0");
    message.ttl = object.ttl ?? 0;
    message.sent = object.sent ?? BigInt("0");
    message.queued = object.queued ?? 0;
    message.status = object.status ?? BigInt("0");
    message.raw_data = object.raw_data ?? new Uint8Array(0);
    message.immediate_ack = object.immediate_ack ?? false;
    return message;
  },
};

function createBaseStreamAck(): StreamAck {
  return {};
}

export const StreamAck = {
  encode(_: StreamAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): StreamAck {
    return {};
  },

  toJSON(_: StreamAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamAck>, I>>(base?: I): StreamAck {
    return StreamAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamAck>, I>>(_: I): StreamAck {
    const message = createBaseStreamAck();
    return message;
  },
};

function createBaseSelectiveAck(): SelectiveAck {
  return { id: [] };
}

export const SelectiveAck = {
  encode(message: SelectiveAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.id) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SelectiveAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSelectiveAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SelectiveAck {
    return { id: globalThis.Array.isArray(object?.id) ? object.id.map((e: any) => globalThis.String(e)) : [] };
  },

  toJSON(message: SelectiveAck): unknown {
    const obj: any = {};
    if (message.id?.length) {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SelectiveAck>, I>>(base?: I): SelectiveAck {
    return SelectiveAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SelectiveAck>, I>>(object: I): SelectiveAck {
    const message = createBaseSelectiveAck();
    message.id = object.id?.map((e) => e) || [];
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToBigint(long: Long) {
  return BigInt(long.toString());
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
