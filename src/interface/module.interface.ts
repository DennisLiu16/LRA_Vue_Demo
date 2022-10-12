import { useModuleStore } from "@/stores/useModuleStore";

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


  connectState: "ON" | "OFF" | "UNKNOWN"; // connection led state
  enable: "ON" | "OFF"; // enable button state
  onProgram: String[]; // record programs running in module

  constructor(init: IModuleInfo) {
    this.mid = init.mid;
    this.name = init.name;
    this.ip = init.ip;
    this.port = init.port;
    this.server = init.server;
    this.connectState = "OFF";
    this.enable = "OFF";
    this.onProgram = [];
  }
}
