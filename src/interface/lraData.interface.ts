// for data store
export interface ILraModuleData {
  info: ITargetInfo;
  realtime: IRealtimeData[];
  reg: IReg[];
}

export interface ILraServerData {
  info: ITargetInfo;
  data: any;
}

interface ITargetInfo {
  type: "module" | "server";
  uuid: string,
}

interface IRealtimeData {
  time: number | Date;
  acc: IThreeAxis;
  freq: IThreeAxis;
  cmd: IThreeAxis;
}

interface IReg {
  name: string;
  value: number;
}

interface IThreeAxis {
  x: number;
  y: number;
  z: number;
}
