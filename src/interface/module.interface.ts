export interface IModuleInfo {
  name: String, 
  ip: String, 
  port: Number, 
  server:String
};

export class Module {
  static _mid = 0;

  name: String;
  ip: String;
  port: Number;
  server: String;
  mid: Number;

  connectState: "ON" | "OFF" | "UNKNOWN"; // connection led state
  enable: "ON" | "OFF"; // enable button state
  onProgram: String[]; // record programs running in module

  constructor(init: IModuleInfo) {
    this.mid = Module._mid++;
    this.name = init.name;
    this.ip = init.ip;
    this.port = init.port;
    this.server = init.server;
    this.connectState = "OFF";
    this.enable = "OFF";
    this.onProgram = [];
  }
};