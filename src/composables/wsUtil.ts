import { isPortOutOfRange } from "./netUtil";

// request or update => send type
const wsLraMsgRequireType = [
  // only type in json
  "regAllRequire",
  "regDrvRequire",
  "regAdxlRequire",
  "dataRTNewestRequire",
  "dataRTKeepRequire",
  "dataRTStopRequire",
  "moduleInfoRequire",
] as const;

const wsLraMsgUpdateType = [
  // type and data in json
  "webInfoUpdate",
  "regAllUpdate",
  "regDrvUpdate",
  "regAdxlUpdate",
  "drvCmdUpdate",
] as const;

const wsLraMsgReciveType = [
  "webInfoUpdateRecv",
  "regAllUpdateRecv",
  "regDrvUpdateRecv",
  "regAdxlUpdateRecv",
  "drvCmdUpdateRecv",
] as const;

const wsLraMsgResponseType = [
  "regAllRequireResponse",
  "regDrvRequireResponse",
  "regAdxlRequireResponse",
  "dataRTNewestRequireResponse",
  "dataRTKeepRequireResponse",
  "dataRTStopRequireResponse",
  "moduleInfoRequireResponse",
] as const;

const wsLraMachiningServerMsgRequestType = [
  "serverInfoRequire",
  "drvCmdKeepRequire",
  "drvCmdStopRequire",
] as const;

const wsLraMachiningServerMsgResponseType = [
  "serverInfoRequireResponse",
  "drvCmdKeepRequireResponse",
  "drvCmdStopRequireResponse",
] as const;

type WsLraMsgRequestType = typeof wsLraMsgRequireType[number];
type WsLraMsgUpdateType = typeof wsLraMsgUpdateType[number];

export type wsLraMsgReciveType = typeof wsLraMsgReciveType[number];

export type WSLraMsgSendType =
  | typeof wsLraMsgRequireType[number]
  | typeof wsLraMsgUpdateType[number];

export function makeWsUrl(
  protocol: "ws" | "wss",
  hostname: string, // ip or DNS or localhost
  port: string | number
): string | never {
  if (isPortOutOfRange(port))
    throw new Error("Port: " + port + " Out of range");
  return protocol + "://" + hostname + ":" + port;
}

export function makeWsRequest(
  _type: WSLraMsgSendType,
  _data?: object
): object | never {
  if (isRequestType(_type)) {
    return {
      type: _type,
    };
  } else if (isUpdateType(_type) && typeof _data !== "undefined") {
    return {
      type: _type,
      data: _data,
    };
  } else {
    throw new Error("makeWsRequest error");
  }
}

// https://stackoverflow.com/questions/57065617/how-to-check-if-string-in-type/57065680#57065680
// 判斷 father type 的變數是否屬於 subtype
function isRequestType(type: string): type is WsLraMsgRequestType {
  return (wsLraMsgRequireType as readonly string[]).includes(type);
}

function isUpdateType(type: string): type is WsLraMsgUpdateType {
  return (wsLraMsgUpdateType as readonly string[]).includes(type);
}
