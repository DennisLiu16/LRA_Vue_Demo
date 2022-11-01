// 未來可以將方程式從 string type 轉換成 Function type 的 magicMethod
// https://stackoverflow.com/questions/62446219/typescript-javascript-call-function-by-string-name

// 未來需要將websocket 儲存在 pinia 的擴展，初始階段直接使用 websocket 的 lib 即可
// https://juejin.cn/post/7055469205759459336

// first version
export class WsInstance {
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
    if (this._ws !== null)
      this._ws.send(data);
    else {
      console.error(`_ws: ${this.info.url} hasn't built yet! Please call reconnecWs() first!`);
    }
  }

  // close WsInstance.ws, and assign to null
  closeWs() {
    if(this._ws !== null){
      this._ws.close();
      this._ws = null;
    }
  }

  connectWs() {
    this.reconnectWs();
  }

  reconnectWs() {
    this._ws = new WebSocket(this.info.url);
    this.updateCallbacks();
  }

  getWsReadyState() {
    if(this._ws !== null) {
      return this._ws.readyState;
    } else {
      return null;
    }
  }

  updateCallbacks(){
    if (this._ws === null) {
      console.error(`_ws in WsInstance: ${this.info.mid} is null, call reconnect() first`);
      return;
    }

    if(this.info.opt?.onOpenCallback !== undefined){
      this._ws.onopen = this.info.opt.onOpenCallback;
    }

    if(this.info.opt?.onCloseCallback !== undefined){
      this._ws.onclose = this.info.opt.onCloseCallback;
    }

    if(this.info.opt?.onMsgCallback !== undefined){
      this._ws.onmessage = this.info.opt.onMsgCallback;
    }

    if(this.info.opt?.onErrorCallback !== undefined){
      this._ws.onerror = this.info.opt.onErrorCallback;
    }
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
