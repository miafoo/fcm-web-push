/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import Long = require("long");

export const protobufPackage = "checkin_proto";

/**
 * enum values correspond to the type of device.
 * Used in the AndroidCheckinProto and Device proto.
 */
export enum DeviceType {
  /** DEVICE_ANDROID_OS - Android Device */
  DEVICE_ANDROID_OS = 1,
  /** DEVICE_IOS_OS - Apple IOS device */
  DEVICE_IOS_OS = 2,
  /** DEVICE_CHROME_BROWSER - Chrome browser - Not Chrome OS.  No hardware records. */
  DEVICE_CHROME_BROWSER = 3,
  /** DEVICE_CHROME_OS - Chrome OS */
  DEVICE_CHROME_OS = 4,
  UNRECOGNIZED = -1,
}

export function deviceTypeFromJSON(object: any): DeviceType {
  switch (object) {
    case 1:
    case "DEVICE_ANDROID_OS":
      return DeviceType.DEVICE_ANDROID_OS;
    case 2:
    case "DEVICE_IOS_OS":
      return DeviceType.DEVICE_IOS_OS;
    case 3:
    case "DEVICE_CHROME_BROWSER":
      return DeviceType.DEVICE_CHROME_BROWSER;
    case 4:
    case "DEVICE_CHROME_OS":
      return DeviceType.DEVICE_CHROME_OS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DeviceType.UNRECOGNIZED;
  }
}

export function deviceTypeToJSON(object: DeviceType): string {
  switch (object) {
    case DeviceType.DEVICE_ANDROID_OS:
      return "DEVICE_ANDROID_OS";
    case DeviceType.DEVICE_IOS_OS:
      return "DEVICE_IOS_OS";
    case DeviceType.DEVICE_CHROME_BROWSER:
      return "DEVICE_CHROME_BROWSER";
    case DeviceType.DEVICE_CHROME_OS:
      return "DEVICE_CHROME_OS";
    case DeviceType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Build characteristics unique to the Chrome browser, and Chrome OS */
export interface ChromeBuildProto {
  /** The platform of the device. */
  platform: ChromeBuildProtoPlatform;
  /** The Chrome instance's version. */
  chrome_version: string;
  /** The Channel (build type) of Chrome. */
  channel: ChromeBuildProtoChannel;
}

export enum ChromeBuildProtoPlatform {
  PLATFORM_WIN = 1,
  PLATFORM_MAC = 2,
  PLATFORM_LINUX = 3,
  PLATFORM_CROS = 4,
  PLATFORM_IOS = 5,
  /**
   * PLATFORM_ANDROID - Just a placeholder. Likely don't need it due to the presence of the
   * Android GCM on phone/tablet devices.
   */
  PLATFORM_ANDROID = 6,
  UNRECOGNIZED = -1,
}

export function chromeBuildProtoPlatformFromJSON(object: any): ChromeBuildProtoPlatform {
  switch (object) {
    case 1:
    case "PLATFORM_WIN":
      return ChromeBuildProtoPlatform.PLATFORM_WIN;
    case 2:
    case "PLATFORM_MAC":
      return ChromeBuildProtoPlatform.PLATFORM_MAC;
    case 3:
    case "PLATFORM_LINUX":
      return ChromeBuildProtoPlatform.PLATFORM_LINUX;
    case 4:
    case "PLATFORM_CROS":
      return ChromeBuildProtoPlatform.PLATFORM_CROS;
    case 5:
    case "PLATFORM_IOS":
      return ChromeBuildProtoPlatform.PLATFORM_IOS;
    case 6:
    case "PLATFORM_ANDROID":
      return ChromeBuildProtoPlatform.PLATFORM_ANDROID;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChromeBuildProtoPlatform.UNRECOGNIZED;
  }
}

export function chromeBuildProtoPlatformToJSON(object: ChromeBuildProtoPlatform): string {
  switch (object) {
    case ChromeBuildProtoPlatform.PLATFORM_WIN:
      return "PLATFORM_WIN";
    case ChromeBuildProtoPlatform.PLATFORM_MAC:
      return "PLATFORM_MAC";
    case ChromeBuildProtoPlatform.PLATFORM_LINUX:
      return "PLATFORM_LINUX";
    case ChromeBuildProtoPlatform.PLATFORM_CROS:
      return "PLATFORM_CROS";
    case ChromeBuildProtoPlatform.PLATFORM_IOS:
      return "PLATFORM_IOS";
    case ChromeBuildProtoPlatform.PLATFORM_ANDROID:
      return "PLATFORM_ANDROID";
    case ChromeBuildProtoPlatform.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ChromeBuildProtoChannel {
  CHANNEL_STABLE = 1,
  CHANNEL_BETA = 2,
  CHANNEL_DEV = 3,
  CHANNEL_CANARY = 4,
  /** CHANNEL_UNKNOWN - for tip of tree or custom builds */
  CHANNEL_UNKNOWN = 5,
  UNRECOGNIZED = -1,
}

export function chromeBuildProtoChannelFromJSON(object: any): ChromeBuildProtoChannel {
  switch (object) {
    case 1:
    case "CHANNEL_STABLE":
      return ChromeBuildProtoChannel.CHANNEL_STABLE;
    case 2:
    case "CHANNEL_BETA":
      return ChromeBuildProtoChannel.CHANNEL_BETA;
    case 3:
    case "CHANNEL_DEV":
      return ChromeBuildProtoChannel.CHANNEL_DEV;
    case 4:
    case "CHANNEL_CANARY":
      return ChromeBuildProtoChannel.CHANNEL_CANARY;
    case 5:
    case "CHANNEL_UNKNOWN":
      return ChromeBuildProtoChannel.CHANNEL_UNKNOWN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChromeBuildProtoChannel.UNRECOGNIZED;
  }
}

export function chromeBuildProtoChannelToJSON(object: ChromeBuildProtoChannel): string {
  switch (object) {
    case ChromeBuildProtoChannel.CHANNEL_STABLE:
      return "CHANNEL_STABLE";
    case ChromeBuildProtoChannel.CHANNEL_BETA:
      return "CHANNEL_BETA";
    case ChromeBuildProtoChannel.CHANNEL_DEV:
      return "CHANNEL_DEV";
    case ChromeBuildProtoChannel.CHANNEL_CANARY:
      return "CHANNEL_CANARY";
    case ChromeBuildProtoChannel.CHANNEL_UNKNOWN:
      return "CHANNEL_UNKNOWN";
    case ChromeBuildProtoChannel.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Information sent by the device in a "checkin" request. */
export interface AndroidCheckinProto {
  /** Miliseconds since the Unix epoch of the device's last successful checkin. */
  last_checkin_msec: bigint;
  /** The current MCC+MNC of the mobile device's current cell. */
  cell_operator: string;
  /**
   * The MCC+MNC of the SIM card (different from operator if the
   * device is roaming, for instance).
   */
  sim_operator: string;
  /**
   * The device's current roaming state (reported starting in eclair builds).
   * Currently one of "{,not}mobile-{,not}roaming", if it is present at all.
   */
  roaming: string;
  /**
   * For devices supporting multiple user profiles (which may be
   * supported starting in jellybean), the ordinal number of the
   * profile that is checking in.  This is 0 for the primary profile
   * (which can't be changed without wiping the device), and 1,2,3,...
   * for additional profiles (which can be added and deleted freely).
   */
  user_number: number;
  /**
   * Class of device.  Indicates the type of build proto
   * (IosBuildProto/ChromeBuildProto/AndroidBuildProto)
   * That is included in this proto
   */
  type: DeviceType;
  /**
   * For devices running MCS on Chrome, build-specific characteristics
   * of the browser.  There are no hardware aspects (except for ChromeOS).
   * This will only be populated for Chrome builds/ChromeOS devices
   */
  chrome_build: ChromeBuildProto | undefined;
}

function createBaseChromeBuildProto(): ChromeBuildProto {
  return { platform: 1, chrome_version: "", channel: 1 };
}

export const ChromeBuildProto = {
  encode(message: ChromeBuildProto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platform !== 1) {
      writer.uint32(8).int32(message.platform);
    }
    if (message.chrome_version !== "") {
      writer.uint32(18).string(message.chrome_version);
    }
    if (message.channel !== 1) {
      writer.uint32(24).int32(message.channel);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChromeBuildProto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChromeBuildProto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platform = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chrome_version = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.channel = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChromeBuildProto {
    return {
      platform: isSet(object.platform) ? chromeBuildProtoPlatformFromJSON(object.platform) : 1,
      chrome_version: isSet(object.chrome_version) ? globalThis.String(object.chrome_version) : "",
      channel: isSet(object.channel) ? chromeBuildProtoChannelFromJSON(object.channel) : 1,
    };
  },

  toJSON(message: ChromeBuildProto): unknown {
    const obj: any = {};
    if (message.platform !== 1) {
      obj.platform = chromeBuildProtoPlatformToJSON(message.platform);
    }
    if (message.chrome_version !== "") {
      obj.chrome_version = message.chrome_version;
    }
    if (message.channel !== 1) {
      obj.channel = chromeBuildProtoChannelToJSON(message.channel);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChromeBuildProto>, I>>(base?: I): ChromeBuildProto {
    return ChromeBuildProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChromeBuildProto>, I>>(object: I): ChromeBuildProto {
    const message = createBaseChromeBuildProto();
    message.platform = object.platform ?? 1;
    message.chrome_version = object.chrome_version ?? "";
    message.channel = object.channel ?? 1;
    return message;
  },
};

function createBaseAndroidCheckinProto(): AndroidCheckinProto {
  return {
    last_checkin_msec: BigInt("0"),
    cell_operator: "",
    sim_operator: "",
    roaming: "",
    user_number: 0,
    type: 1,
    chrome_build: undefined,
  };
}

export const AndroidCheckinProto = {
  encode(message: AndroidCheckinProto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.last_checkin_msec !== BigInt("0")) {
      if (BigInt.asIntN(64, message.last_checkin_msec) !== message.last_checkin_msec) {
        throw new globalThis.Error("value provided for field message.last_checkin_msec of type int64 too large");
      }
      writer.uint32(16).int64(message.last_checkin_msec.toString());
    }
    if (message.cell_operator !== "") {
      writer.uint32(50).string(message.cell_operator);
    }
    if (message.sim_operator !== "") {
      writer.uint32(58).string(message.sim_operator);
    }
    if (message.roaming !== "") {
      writer.uint32(66).string(message.roaming);
    }
    if (message.user_number !== 0) {
      writer.uint32(72).int32(message.user_number);
    }
    if (message.type !== 1) {
      writer.uint32(96).int32(message.type);
    }
    if (message.chrome_build !== undefined) {
      ChromeBuildProto.encode(message.chrome_build, writer.uint32(106).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinProto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAndroidCheckinProto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 16) {
            break;
          }

          message.last_checkin_msec = longToBigint(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.cell_operator = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.sim_operator = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.roaming = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.user_number = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.chrome_build = ChromeBuildProto.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AndroidCheckinProto {
    return {
      last_checkin_msec: isSet(object.last_checkin_msec) ? BigInt(object.last_checkin_msec) : BigInt("0"),
      cell_operator: isSet(object.cell_operator) ? globalThis.String(object.cell_operator) : "",
      sim_operator: isSet(object.sim_operator) ? globalThis.String(object.sim_operator) : "",
      roaming: isSet(object.roaming) ? globalThis.String(object.roaming) : "",
      user_number: isSet(object.user_number) ? globalThis.Number(object.user_number) : 0,
      type: isSet(object.type) ? deviceTypeFromJSON(object.type) : 1,
      chrome_build: isSet(object.chrome_build) ? ChromeBuildProto.fromJSON(object.chrome_build) : undefined,
    };
  },

  toJSON(message: AndroidCheckinProto): unknown {
    const obj: any = {};
    if (message.last_checkin_msec !== BigInt("0")) {
      obj.last_checkin_msec = message.last_checkin_msec.toString();
    }
    if (message.cell_operator !== "") {
      obj.cell_operator = message.cell_operator;
    }
    if (message.sim_operator !== "") {
      obj.sim_operator = message.sim_operator;
    }
    if (message.roaming !== "") {
      obj.roaming = message.roaming;
    }
    if (message.user_number !== 0) {
      obj.user_number = Math.round(message.user_number);
    }
    if (message.type !== 1) {
      obj.type = deviceTypeToJSON(message.type);
    }
    if (message.chrome_build !== undefined) {
      obj.chrome_build = ChromeBuildProto.toJSON(message.chrome_build);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AndroidCheckinProto>, I>>(base?: I): AndroidCheckinProto {
    return AndroidCheckinProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinProto>, I>>(object: I): AndroidCheckinProto {
    const message = createBaseAndroidCheckinProto();
    message.last_checkin_msec = object.last_checkin_msec ?? BigInt("0");
    message.cell_operator = object.cell_operator ?? "";
    message.sim_operator = object.sim_operator ?? "";
    message.roaming = object.roaming ?? "";
    message.user_number = object.user_number ?? 0;
    message.type = object.type ?? 1;
    message.chrome_build = (object.chrome_build !== undefined && object.chrome_build !== null)
      ? ChromeBuildProto.fromPartial(object.chrome_build)
      : undefined;
    return message;
  },
};

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
