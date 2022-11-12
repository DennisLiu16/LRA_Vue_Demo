// for data store
export interface ILraModuleData {
  uuid:string
  realtime: IRealtimeData;
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

interface IDrvInfo {
  freq: IPoint,
  rtp: IPoint
}

interface IDrv {
  x:IDrvInfo,
  y:IDrvInfo,
  z:IDrvInfo
}

interface IAcc {
  x:IPoint[],
  y:IPoint[],
  z:IPoint[]
}

interface IPoint {
  x:number,
  y:number
}

interface IRealtimeData {
  acc:IAcc,
  drv:IDrv
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
