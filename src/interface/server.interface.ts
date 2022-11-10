export interface IServerInfo {
  uuid: string,
  name: string;
  ip: string;
  port: number;
  alive: boolean; // FIXME: should be removed
  loadingState: "disconnect" | "connected" | "loading"
}