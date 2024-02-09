/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { AndroidCheckinProto } from "./android-checkin";
import Long = require("long");

export const protobufPackage = "checkin_proto";

/** A concrete name/value pair sent to the device's Gservices database. */
export interface GservicesSetting {
  name: Uint8Array;
  value: Uint8Array;
}

/** Devices send this every few hours to tell us how they're doing. */
export interface AndroidCheckinRequest {
  /**
   * IMEI (used by GSM phones) is sent and stored as 15 decimal
   * digits; the 15th is a check digit.
   */
  imei: string;
  /**
   * MEID (used by CDMA phones) is sent and stored as 14 hexadecimal
   * digits (no check digit).
   */
  meid: string;
  /**
   * MAC address (used by non-phone devices).  12 hexadecimal digits;
   * no separators (eg "0016E6513AC2", not "00:16:E6:51:3A:C2").
   */
  mac_addr: string[];
  /**
   * An array parallel to mac_addr, describing the type of interface.
   * Currently accepted values: "wifi", "ethernet", "bluetooth".  If
   * not present, "wifi" is assumed.
   */
  mac_addr_type: string[];
  /**
   * Serial number (a manufacturer-defined unique hardware
   * identifier).  Alphanumeric, case-insensitive.
   */
  serial_number: string;
  /** Older CDMA networks use an ESN (8 hex digits) instead of an MEID. */
  esn: string;
  /** Android device ID, not logged */
  id: bigint;
  /** Pseudonymous logging ID for Sawmill */
  logging_id: bigint;
  /** Digest of device provisioning, not logged. */
  digest: string;
  /** Current locale in standard (xx_XX) format */
  locale: string;
  checkin:
    | AndroidCheckinProto
    | undefined;
  /** DEPRECATED, see AndroidCheckinProto.requested_group */
  desired_build: string;
  /** Blob of data from the Market app to be passed to Market API server */
  market_checkin: string;
  /** SID cookies of any google accounts stored on the phone.  Not logged. */
  account_cookie: string[];
  /** Time zone.  Not currently logged. */
  time_zone: string;
  /**
   * Security token used to validate the checkin request.
   * Required for android IDs issued to Froyo+ devices, not for legacy IDs.
   */
  security_token: bigint;
  /**
   * Version of checkin protocol.
   *
   * There are currently two versions:
   *
   * - version field missing: android IDs are assigned based on
   *   hardware identifiers.  unsecured in the sense that you can
   *   "unregister" someone's phone by sending a registration request
   *   with their IMEI/MEID/MAC.
   *
   * - version=2: android IDs are assigned randomly.  The device is
   *   sent a security token that must be included in all future
   *   checkins for that android id.
   *
   * - version=3: same as version 2, but the 'fragment' field is
   *   provided, and the device understands incremental updates to the
   *   gservices table (ie, only returning the keys whose values have
   *   changed.)
   *
   * (version=1 was skipped to avoid confusion with the "missing"
   * version field that is effectively version 1.)
   */
  version: number;
  /**
   * OTA certs accepted by device (base-64 SHA-1 of cert files).  Not
   * logged.
   */
  ota_cert: string[];
  /**
   * A single CheckinTask on the device may lead to multiple checkin
   * requests if there is too much log data to upload in a single
   * request.  For version 3 and up, this field will be filled in with
   * the number of the request, starting with 0.
   */
  fragment: number;
  /**
   * For devices supporting multiple users, the name of the current
   * profile (they all check in independently, just as if they were
   * multiple physical devices).  This may not be set, even if the
   * device is using multiuser.  (checkin.user_number should be set to
   * the ordinal of the user.)
   */
  user_name: string;
  /**
   * For devices supporting multiple user profiles, the serial number
   * for the user checking in.  Not logged.  May not be set, even if
   * the device supportes multiuser.  checkin.user_number is the
   * ordinal of the user (0, 1, 2, ...), which may be reused if users
   * are deleted and re-created.  user_serial_number is never reused
   * (unless the device is wiped).
   */
  user_serial_number: number;
}

/** The response to the device. */
export interface AndroidCheckinResponse {
  /** Whether statistics were recorded properly. */
  stats_ok: boolean;
  /** Time of day from server (Java epoch). */
  time_msec: bigint;
  /**
   * Provisioning is sent if the request included an obsolete digest.
   *
   * For version <= 2, 'digest' contains the digest that should be
   * sent back to the server on the next checkin, and 'setting'
   * contains the entire gservices table (which replaces the entire
   * current table on the device).
   *
   * for version >= 3, 'digest' will be absent.  If 'settings_diff'
   * is false, then 'setting' contains the entire table, as in version
   * 2.  If 'settings_diff' is true, then 'delete_setting' contains
   * the keys to delete, and 'setting' contains only keys to be added
   * or for which the value has changed.  All other keys in the
   * current table should be left untouched.  If 'settings_diff' is
   * absent, don't touch the existing gservices table.
   */
  digest: string;
  settings_diff: boolean;
  delete_setting: string[];
  setting: GservicesSetting[];
  /** If Market got the market_checkin data OK. */
  market_ok: boolean;
  /** From the request, or newly assigned */
  android_id: bigint;
  /** The associated security token */
  security_token: bigint;
  /** NEXT TAG: 12 */
  version_info: string;
}

function createBaseGservicesSetting(): GservicesSetting {
  return { name: new Uint8Array(0), value: new Uint8Array(0) };
}

export const GservicesSetting = {
  encode(message: GservicesSetting, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name.length !== 0) {
      writer.uint32(10).bytes(message.name);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GservicesSetting {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGservicesSetting();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GservicesSetting {
    return {
      name: isSet(object.name) ? bytesFromBase64(object.name) : new Uint8Array(0),
      value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array(0),
    };
  },

  toJSON(message: GservicesSetting): unknown {
    const obj: any = {};
    if (message.name.length !== 0) {
      obj.name = base64FromBytes(message.name);
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GservicesSetting>, I>>(base?: I): GservicesSetting {
    return GservicesSetting.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GservicesSetting>, I>>(object: I): GservicesSetting {
    const message = createBaseGservicesSetting();
    message.name = object.name ?? new Uint8Array(0);
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAndroidCheckinRequest(): AndroidCheckinRequest {
  return {
    imei: "",
    meid: "",
    mac_addr: [],
    mac_addr_type: [],
    serial_number: "",
    esn: "",
    id: BigInt("0"),
    logging_id: BigInt("0"),
    digest: "",
    locale: "",
    checkin: undefined,
    desired_build: "",
    market_checkin: "",
    account_cookie: [],
    time_zone: "",
    security_token: BigInt("0"),
    version: 0,
    ota_cert: [],
    fragment: 0,
    user_name: "",
    user_serial_number: 0,
  };
}

export const AndroidCheckinRequest = {
  encode(message: AndroidCheckinRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.imei !== "") {
      writer.uint32(10).string(message.imei);
    }
    if (message.meid !== "") {
      writer.uint32(82).string(message.meid);
    }
    for (const v of message.mac_addr) {
      writer.uint32(74).string(v!);
    }
    for (const v of message.mac_addr_type) {
      writer.uint32(154).string(v!);
    }
    if (message.serial_number !== "") {
      writer.uint32(130).string(message.serial_number);
    }
    if (message.esn !== "") {
      writer.uint32(138).string(message.esn);
    }
    if (message.id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.id) !== message.id) {
        throw new globalThis.Error("value provided for field message.id of type int64 too large");
      }
      writer.uint32(16).int64(message.id.toString());
    }
    if (message.logging_id !== BigInt("0")) {
      if (BigInt.asIntN(64, message.logging_id) !== message.logging_id) {
        throw new globalThis.Error("value provided for field message.logging_id of type int64 too large");
      }
      writer.uint32(56).int64(message.logging_id.toString());
    }
    if (message.digest !== "") {
      writer.uint32(26).string(message.digest);
    }
    if (message.locale !== "") {
      writer.uint32(50).string(message.locale);
    }
    if (message.checkin !== undefined) {
      AndroidCheckinProto.encode(message.checkin, writer.uint32(34).fork()).ldelim();
    }
    if (message.desired_build !== "") {
      writer.uint32(42).string(message.desired_build);
    }
    if (message.market_checkin !== "") {
      writer.uint32(66).string(message.market_checkin);
    }
    for (const v of message.account_cookie) {
      writer.uint32(90).string(v!);
    }
    if (message.time_zone !== "") {
      writer.uint32(98).string(message.time_zone);
    }
    if (message.security_token !== BigInt("0")) {
      if (BigInt.asUintN(64, message.security_token) !== message.security_token) {
        throw new globalThis.Error("value provided for field message.security_token of type fixed64 too large");
      }
      writer.uint32(105).fixed64(message.security_token.toString());
    }
    if (message.version !== 0) {
      writer.uint32(112).int32(message.version);
    }
    for (const v of message.ota_cert) {
      writer.uint32(122).string(v!);
    }
    if (message.fragment !== 0) {
      writer.uint32(160).int32(message.fragment);
    }
    if (message.user_name !== "") {
      writer.uint32(170).string(message.user_name);
    }
    if (message.user_serial_number !== 0) {
      writer.uint32(176).int32(message.user_serial_number);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAndroidCheckinRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.imei = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.meid = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.mac_addr.push(reader.string());
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.mac_addr_type.push(reader.string());
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.serial_number = reader.string();
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.esn = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.id = longToBigint(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.logging_id = longToBigint(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.digest = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.locale = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.checkin = AndroidCheckinProto.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.desired_build = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.market_checkin = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.account_cookie.push(reader.string());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.time_zone = reader.string();
          continue;
        case 13:
          if (tag !== 105) {
            break;
          }

          message.security_token = longToBigint(reader.fixed64() as Long);
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.version = reader.int32();
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.ota_cert.push(reader.string());
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.fragment = reader.int32();
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.user_name = reader.string();
          continue;
        case 22:
          if (tag !== 176) {
            break;
          }

          message.user_serial_number = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AndroidCheckinRequest {
    return {
      imei: isSet(object.imei) ? globalThis.String(object.imei) : "",
      meid: isSet(object.meid) ? globalThis.String(object.meid) : "",
      mac_addr: globalThis.Array.isArray(object?.mac_addr) ? object.mac_addr.map((e: any) => globalThis.String(e)) : [],
      mac_addr_type: globalThis.Array.isArray(object?.mac_addr_type)
        ? object.mac_addr_type.map((e: any) => globalThis.String(e))
        : [],
      serial_number: isSet(object.serial_number) ? globalThis.String(object.serial_number) : "",
      esn: isSet(object.esn) ? globalThis.String(object.esn) : "",
      id: isSet(object.id) ? BigInt(object.id) : BigInt("0"),
      logging_id: isSet(object.logging_id) ? BigInt(object.logging_id) : BigInt("0"),
      digest: isSet(object.digest) ? globalThis.String(object.digest) : "",
      locale: isSet(object.locale) ? globalThis.String(object.locale) : "",
      checkin: isSet(object.checkin) ? AndroidCheckinProto.fromJSON(object.checkin) : undefined,
      desired_build: isSet(object.desired_build) ? globalThis.String(object.desired_build) : "",
      market_checkin: isSet(object.market_checkin) ? globalThis.String(object.market_checkin) : "",
      account_cookie: globalThis.Array.isArray(object?.account_cookie)
        ? object.account_cookie.map((e: any) => globalThis.String(e))
        : [],
      time_zone: isSet(object.time_zone) ? globalThis.String(object.time_zone) : "",
      security_token: isSet(object.security_token) ? BigInt(object.security_token) : BigInt("0"),
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      ota_cert: globalThis.Array.isArray(object?.ota_cert) ? object.ota_cert.map((e: any) => globalThis.String(e)) : [],
      fragment: isSet(object.fragment) ? globalThis.Number(object.fragment) : 0,
      user_name: isSet(object.user_name) ? globalThis.String(object.user_name) : "",
      user_serial_number: isSet(object.user_serial_number) ? globalThis.Number(object.user_serial_number) : 0,
    };
  },

  toJSON(message: AndroidCheckinRequest): unknown {
    const obj: any = {};
    if (message.imei !== "") {
      obj.imei = message.imei;
    }
    if (message.meid !== "") {
      obj.meid = message.meid;
    }
    if (message.mac_addr?.length) {
      obj.mac_addr = message.mac_addr;
    }
    if (message.mac_addr_type?.length) {
      obj.mac_addr_type = message.mac_addr_type;
    }
    if (message.serial_number !== "") {
      obj.serial_number = message.serial_number;
    }
    if (message.esn !== "") {
      obj.esn = message.esn;
    }
    if (message.id !== BigInt("0")) {
      obj.id = message.id.toString();
    }
    if (message.logging_id !== BigInt("0")) {
      obj.logging_id = message.logging_id.toString();
    }
    if (message.digest !== "") {
      obj.digest = message.digest;
    }
    if (message.locale !== "") {
      obj.locale = message.locale;
    }
    if (message.checkin !== undefined) {
      obj.checkin = AndroidCheckinProto.toJSON(message.checkin);
    }
    if (message.desired_build !== "") {
      obj.desired_build = message.desired_build;
    }
    if (message.market_checkin !== "") {
      obj.market_checkin = message.market_checkin;
    }
    if (message.account_cookie?.length) {
      obj.account_cookie = message.account_cookie;
    }
    if (message.time_zone !== "") {
      obj.time_zone = message.time_zone;
    }
    if (message.security_token !== BigInt("0")) {
      obj.security_token = message.security_token.toString();
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.ota_cert?.length) {
      obj.ota_cert = message.ota_cert;
    }
    if (message.fragment !== 0) {
      obj.fragment = Math.round(message.fragment);
    }
    if (message.user_name !== "") {
      obj.user_name = message.user_name;
    }
    if (message.user_serial_number !== 0) {
      obj.user_serial_number = Math.round(message.user_serial_number);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AndroidCheckinRequest>, I>>(base?: I): AndroidCheckinRequest {
    return AndroidCheckinRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinRequest>, I>>(object: I): AndroidCheckinRequest {
    const message = createBaseAndroidCheckinRequest();
    message.imei = object.imei ?? "";
    message.meid = object.meid ?? "";
    message.mac_addr = object.mac_addr?.map((e) => e) || [];
    message.mac_addr_type = object.mac_addr_type?.map((e) => e) || [];
    message.serial_number = object.serial_number ?? "";
    message.esn = object.esn ?? "";
    message.id = object.id ?? BigInt("0");
    message.logging_id = object.logging_id ?? BigInt("0");
    message.digest = object.digest ?? "";
    message.locale = object.locale ?? "";
    message.checkin = (object.checkin !== undefined && object.checkin !== null)
      ? AndroidCheckinProto.fromPartial(object.checkin)
      : undefined;
    message.desired_build = object.desired_build ?? "";
    message.market_checkin = object.market_checkin ?? "";
    message.account_cookie = object.account_cookie?.map((e) => e) || [];
    message.time_zone = object.time_zone ?? "";
    message.security_token = object.security_token ?? BigInt("0");
    message.version = object.version ?? 0;
    message.ota_cert = object.ota_cert?.map((e) => e) || [];
    message.fragment = object.fragment ?? 0;
    message.user_name = object.user_name ?? "";
    message.user_serial_number = object.user_serial_number ?? 0;
    return message;
  },
};

function createBaseAndroidCheckinResponse(): AndroidCheckinResponse {
  return {
    stats_ok: false,
    time_msec: BigInt("0"),
    digest: "",
    settings_diff: false,
    delete_setting: [],
    setting: [],
    market_ok: false,
    android_id: BigInt("0"),
    security_token: BigInt("0"),
    version_info: "",
  };
}

export const AndroidCheckinResponse = {
  encode(message: AndroidCheckinResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stats_ok === true) {
      writer.uint32(8).bool(message.stats_ok);
    }
    if (message.time_msec !== BigInt("0")) {
      if (BigInt.asIntN(64, message.time_msec) !== message.time_msec) {
        throw new globalThis.Error("value provided for field message.time_msec of type int64 too large");
      }
      writer.uint32(24).int64(message.time_msec.toString());
    }
    if (message.digest !== "") {
      writer.uint32(34).string(message.digest);
    }
    if (message.settings_diff === true) {
      writer.uint32(72).bool(message.settings_diff);
    }
    for (const v of message.delete_setting) {
      writer.uint32(82).string(v!);
    }
    for (const v of message.setting) {
      GservicesSetting.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.market_ok === true) {
      writer.uint32(48).bool(message.market_ok);
    }
    if (message.android_id !== BigInt("0")) {
      if (BigInt.asUintN(64, message.android_id) !== message.android_id) {
        throw new globalThis.Error("value provided for field message.android_id of type fixed64 too large");
      }
      writer.uint32(57).fixed64(message.android_id.toString());
    }
    if (message.security_token !== BigInt("0")) {
      if (BigInt.asUintN(64, message.security_token) !== message.security_token) {
        throw new globalThis.Error("value provided for field message.security_token of type fixed64 too large");
      }
      writer.uint32(65).fixed64(message.security_token.toString());
    }
    if (message.version_info !== "") {
      writer.uint32(90).string(message.version_info);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAndroidCheckinResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stats_ok = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.time_msec = longToBigint(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.digest = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.settings_diff = reader.bool();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.delete_setting.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.setting.push(GservicesSetting.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.market_ok = reader.bool();
          continue;
        case 7:
          if (tag !== 57) {
            break;
          }

          message.android_id = longToBigint(reader.fixed64() as Long);
          continue;
        case 8:
          if (tag !== 65) {
            break;
          }

          message.security_token = longToBigint(reader.fixed64() as Long);
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.version_info = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AndroidCheckinResponse {
    return {
      stats_ok: isSet(object.stats_ok) ? globalThis.Boolean(object.stats_ok) : false,
      time_msec: isSet(object.time_msec) ? BigInt(object.time_msec) : BigInt("0"),
      digest: isSet(object.digest) ? globalThis.String(object.digest) : "",
      settings_diff: isSet(object.settings_diff) ? globalThis.Boolean(object.settings_diff) : false,
      delete_setting: globalThis.Array.isArray(object?.delete_setting)
        ? object.delete_setting.map((e: any) => globalThis.String(e))
        : [],
      setting: globalThis.Array.isArray(object?.setting)
        ? object.setting.map((e: any) => GservicesSetting.fromJSON(e))
        : [],
      market_ok: isSet(object.market_ok) ? globalThis.Boolean(object.market_ok) : false,
      android_id: isSet(object.android_id) ? BigInt(object.android_id) : BigInt("0"),
      security_token: isSet(object.security_token) ? BigInt(object.security_token) : BigInt("0"),
      version_info: isSet(object.version_info) ? globalThis.String(object.version_info) : "",
    };
  },

  toJSON(message: AndroidCheckinResponse): unknown {
    const obj: any = {};
    if (message.stats_ok === true) {
      obj.stats_ok = message.stats_ok;
    }
    if (message.time_msec !== BigInt("0")) {
      obj.time_msec = message.time_msec.toString();
    }
    if (message.digest !== "") {
      obj.digest = message.digest;
    }
    if (message.settings_diff === true) {
      obj.settings_diff = message.settings_diff;
    }
    if (message.delete_setting?.length) {
      obj.delete_setting = message.delete_setting;
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => GservicesSetting.toJSON(e));
    }
    if (message.market_ok === true) {
      obj.market_ok = message.market_ok;
    }
    if (message.android_id !== BigInt("0")) {
      obj.android_id = message.android_id.toString();
    }
    if (message.security_token !== BigInt("0")) {
      obj.security_token = message.security_token.toString();
    }
    if (message.version_info !== "") {
      obj.version_info = message.version_info;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AndroidCheckinResponse>, I>>(base?: I): AndroidCheckinResponse {
    return AndroidCheckinResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinResponse>, I>>(object: I): AndroidCheckinResponse {
    const message = createBaseAndroidCheckinResponse();
    message.stats_ok = object.stats_ok ?? false;
    message.time_msec = object.time_msec ?? BigInt("0");
    message.digest = object.digest ?? "";
    message.settings_diff = object.settings_diff ?? false;
    message.delete_setting = object.delete_setting?.map((e) => e) || [];
    message.setting = object.setting?.map((e) => GservicesSetting.fromPartial(e)) || [];
    message.market_ok = object.market_ok ?? false;
    message.android_id = object.android_id ?? BigInt("0");
    message.security_token = object.security_token ?? BigInt("0");
    message.version_info = object.version_info ?? "";
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
