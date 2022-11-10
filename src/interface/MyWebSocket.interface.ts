// 未來可以將方程式從 string type 轉換成 Function type 的 magicMethod
// https://stackoverflow.com/questions/62446219/typescript-javascript-call-function-by-string-name

// 未來需要將websocket 儲存在 pinia 的擴展，初始階段直接使用 websocket 的 lib 即可
// https://juejin.cn/post/7055469205759459336

// first version
export class WsInstance {
  static readonly OPEN = "onopen";
  static readonly CLOSE = "onclose";
  static readonly MESSAGE = "onmessage";
  static readonly ERROR = "onerror";

  info: wsInfo;
  mode: "direct" | "broadcast" = "broadcast"; // direct 是模組直連; broadcast 是透過網頁轉接
  target: "server" | "module" = "module"; // connection target
  private _ws: WebSocket | null = null;

  constructor(
    info: wsInfo,
    mode?: "direct" | "broadcast",
    target?: "server" | "module"
  ) {
    this.info = info;
    if (mode !== undefined) this.mode = mode;
    if (target !== undefined) this.target = target;
  }

  send(data: any) {
    if (this._ws !== null) {
      data = JSON.stringify(data);
      this._ws.send(data); // non-block
    } else {
      console.error(
        `_ws: ${this.info.url} hasn't built yet! Please call reconnecWs() first!`
      );
    }
  }

  // close WsInstance.ws, and assign to null
  // TODO: also
  closeWs() {
    if (this._ws !== null) {
      this._ws.close();
      this._ws = null;
    }
  }

  connectWs() {
    return this.reconnectWs();
  }

  // TODO: 參考這個修改: https://cloud.tencent.com/developer/article/1623173
  // TODO: 改名
  reconnectWs() {
    this.closeWs();
    return new Promise((resolve, reject) => {
      this._ws = new WebSocket(this.info.url);
      this.updateCallbacks(resolve, reject);
    });
  }

  getWsReadyState() {
    if (this._ws !== null) {
      return this._ws.readyState;
    } else {
      return null;
    }
  }

  updateUrl(newUrl: string) {
    if (this._ws === null) this.info.url = newUrl;
    else
      console.error(
        "You should not update WsInstance url when _ws is not null"
      );
  }

  updateCallbacks(resolve?: any, reject?: any) {
    if (this._ws === null) {
      console.error(
        `_ws in WsInstance: ${this.info.mid} is null, call reconnect() first`
      );
      return;
    }

    this._ws.onopen = () => {
      resolve?.(WsInstance.OPEN);
      this.info.opt?.onOpenCallback?.();
    };

    this._ws.onclose = (ev: CloseEvent) => {
      resolve?.(WsInstance.CLOSE);
      this.info.opt?.onCloseCallback?.(ev);
    };

    this._ws.onmessage = (ev: MessageEvent) => {
      resolve?.(WsInstance.MESSAGE);
      this.info.opt?.onMsgCallback?.(ev);
    };

    this._ws.onerror = (ev: Event) => {
      reject(WsInstance.ERROR);
      this.info.opt?.onErrorCallback?.(ev);
    };
  }
}

export interface wsInfo {
  url: string;
  mid: string; // machine uid
  opt?: wsOpt;
}

export interface wsOpt {
  onOpenCallback?: () => void;
  onErrorCallback?: (ev: Event) => void;
  onMsgCallback?: (ev: MessageEvent) => void;
  onCloseCallback?: (ev: CloseEvent) => void;
}
