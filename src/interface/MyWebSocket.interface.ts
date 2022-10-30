// 未來可以將方程式從 string type 轉換成 Function type 的 magicMethod
// https://stackoverflow.com/questions/62446219/typescript-javascript-call-function-by-string-name

// 未來需要將websocket 儲存在 pinia 的擴展，初始階段直接使用 websocket 的 lib 即可
// https://juejin.cn/post/7055469205759459336

// first version
export class WsInstance {
  info: wsInfo;
  mode: "direct" | "broadcast" = "broadcast"; // direct 是模組直連; broadcast 是透過網頁轉接
  ws: WebSocket;

  constructor(info: wsInfo, mode?: "direct" | "broadcast") {
    this.info = info;
    if (mode !== undefined) this.mode = mode;
    this.ws = new WebSocket(info.url);

    // setting callback

    this.ws.onopen =
      this.info.opt?.onOpenCallback != undefined
        ? this.info.opt?.onOpenCallback
        : null;

    this.ws.onclose =
      this.info?.opt?.onCloseCallback != undefined
        ? this.info?.opt?.onCloseCallback
        : null;

    this.ws.onmessage =
      this.info.opt?.onMsgCallback != undefined
        ? this.info.opt?.onMsgCallback
        : null;

    this.ws.onerror =
      this.info.opt?.onErrorCallback != undefined
        ? this.info.opt?.onErrorCallback
        : null;
  }

  send(data: any) {
    this.ws.send(data);
  }
}

export interface wsInfo {
  readonly url: string;
  mid?: string; // machine uid
  opt?: wsOpt;
}

export interface wsOpt {
  onOpenCallback?: () => void;
  onErrorCallback?: (ev: Event) => void;
  onMsgCallback?: (ev: MessageEvent) => void;
  onCloseCallback?: (ev: CloseEvent) => void;
}
