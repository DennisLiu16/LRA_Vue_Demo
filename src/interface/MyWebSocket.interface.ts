// ref to https://github.com/likaia/vue-native-websocket-vue3
// https://stackoverflow.com/questions/68811762/access-class-method-via-vue-3-vuex-state-typescript
// 是不是 interface 可以當作有沒有 activate 的根據? No
// 暫時 Abort -> websocket-ts

interface WebSocketInfo<T = any> {
  belongTo: {
    type: "server" | "module";
    uuid: string;
  };
  format: string;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  connectManually?: boolean;
  store?: T;
  protocol?: string;
  webSocket?: WebSocket | undefined;
}

export interface IMyWebSocket {
  readonly format: string;
  readonly opt: WebSocketInfo;
  readonly reconnectionAttempts: number;
  readonly reconnectionDelay: number;

  reconnection: boolean;
}

export class MyWebSocket implements IMyWebSocket {
  private connectionUrl: string;
}

// 或許可以定義 websocket 是屬於 server 還是 module
