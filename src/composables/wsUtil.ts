import { isPortOutOfRange } from "./netUtil";

const wsLraMsgRequestType = [
  // only type in json
  "regAllRequire",
  "regDrvRequire",
  "regAdxlRequire",
  "dataNewestRequire",
  "dataRealTimeRequire",
  "dataRealTimeStop",
  "moduleInfo",
] as const;

const wsLraMsgUpdateType = [
  // type and data in json
  "regAllUpdate",
  "regDrvUpdate",
  "regAdxlUpdate",
  "drvCmdUpdate",
] as const;

type WsLraMsgRequestType = typeof wsLraMsgRequestType[number];
type WsLraMsgUpdateType = typeof wsLraMsgUpdateType[number];

export type WSLraMsgType =
  | typeof wsLraMsgRequestType[number]
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
  _type: WSLraMsgType,
  _data?: object
): object | never {
  if (isRequestType(_type)) {
    return {
      type: _type,
    };
  } else if (isUpdateType(_type) && typeof _data !== undefined) {
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
  return (wsLraMsgRequestType as readonly string[]).includes(type);
}

function isUpdateType(type: string): type is WsLraMsgUpdateType {
  return (wsLraMsgUpdateType as readonly string[]).includes(type);
}