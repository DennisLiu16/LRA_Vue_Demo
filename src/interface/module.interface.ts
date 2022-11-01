export interface IModuleInfo {
  mid: string,
  name: string;
  ip: string;
  port: number;
  server: string;
}

export class Module implements IModuleInfo {
  mid: string;
  name: string;
  ip: string;
  port: number;
  server: string;

  // connectState: "ON" | "OFF" | "UNKNOWN"; TODO: maintain by websocket.readystate?
  enableState: boolean; // enable button state
  onProgram: String[]; // record programs running in module

  // registers: Object; // move to useWebSStore

  constructor(init: IModuleInfo) {
    this.mid = init.mid;
    this.name = init.name;
    this.ip = init.ip;
    this.port = init.port;
    this.server = init.server;
    this.enableState = false;
    this.onProgram = [];
  }
}
