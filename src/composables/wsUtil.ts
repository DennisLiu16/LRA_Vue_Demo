import { isPortOutOfRange } from "./netUtil";

// FIXME: 重寫!!

// request or update => send type, from maching server or web side
const wsLraMsgRequireType = [
  // only type in json
  "regAllRequire",
  "regDrvRequire",
  "regAdxlRequire",
  "dataRTNewestRequire",
  "dataRTKeepRequire",
  "dataRTStopRequire",
  "moduleInfoRequire",
  "calibrationRequire",
] as const;

const wsLraMsgUpdateType = [
  // type and data in json
  "webInfoUpdate",
  "regAllUpdate", // update register value from web side
  "regDrvUpdate",
  "regAdxlUpdate",
  "drvCmdUpdate",
  "drvDriveUpdate",
] as const;

// 回應 require
const wsLraMsgResponseType = [
  "regAllRequireResponse",
  "regDrvRequireResponse",
  "regAdxlRequireResponse",
  "dataRTNewestRequireResponse",
  "dataRTKeepRequireResponse",
  "dataRTStopRequireResponse",
  "moduleInfoRequireResponse",
  "calibrationRequireResponse",
];

// 回應 update 的訊息
const wsLraMsgReceiveType = [
  // for module only
  // "dataRTReceive",
  "webInfoUpdateRecv",
  "regAllUpdateRecv",
  "regDrvUpdateRecv",
  "regAdxlUpdateRecv",
  "drvCmdUpdateRecv",
  "drvDriveUpdateRecv",

  // for machining server only, only websocket direct mode will use this part
];

const wsLraServerMsgRequireType = [
  "serverInfoRequire",
  "drvCmdKeepRequire",
  "drvCmdStopRequire",
];

const wsLraServerMsgResponseType = [
  "serverInfoRequireResponse",
  "drvCmdKeepRequireResponse",
  "drvCmdStopRequireResponse",
];

type WsLraMsgRequireType = typeof wsLraMsgRequireType[number];
type WsLraMsgUpdateType = typeof wsLraMsgUpdateType[number];

export type WsLraMsgReceiveType = typeof wsLraMsgReceiveType[number];

export type WsLraServerMsgRequireType =
  typeof wsLraServerMsgRequireType[number];
export type WsLraServerMsgResponseType =
  typeof wsLraServerMsgResponseType[number];

export type WSLraMsgSendType =
  | typeof wsLraMsgRequireType[number]
  | typeof wsLraMsgUpdateType[number]
  | typeof wsLraServerMsgRequireType[number];

export function makeWsUrl(
  protocol: "ws" | "wss",
  hostname: string, // ip or DNS or localhost
  port: string | number
): string | never {
  if (isPortOutOfRange(port))
    throw new Error("Port: " + port + " Out of range");
  return protocol + "://" + hostname + ":" + port;
}

// TODO: XXX -> add timestamp
export function makeWsRequest(
  _type: WSLraMsgSendType,
  _data?: object
): object | never {
  const timestamp = new Date().getTime();
  if (isRequestType(_type)) {
    return {
      type: _type,
      timestamp: timestamp.toString(),
    };
  } else if (isUpdateType(_type) && typeof _data !== "undefined") {
    return {
      type: _type,
      data: _data,
      timestamp: timestamp.toString(),
    };
  } else {
    throw new Error("makeWsRequest error");
  }
}

// https://stackoverflow.com/questions/57065617/how-to-check-if-string-in-type/57065680#57065680
// 判斷 father type 的變數是否屬於 subtype
function isRequestType(type: string): type is WsLraMsgRequireType {
  return (
    (wsLraMsgRequireType as readonly string[]).includes(type) ||
    (wsLraServerMsgRequireType as readonly string[]).includes(type)
  );
}

function isUpdateType(type: string): type is WsLraMsgUpdateType {
  return (wsLraMsgUpdateType as readonly string[]).includes(type);
}
