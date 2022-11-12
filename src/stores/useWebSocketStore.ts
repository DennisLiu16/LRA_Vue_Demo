import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";

import type { WsInstance } from "@/interface/myWebSocket.interface";
import type {
  ILraModuleData,
  ILraServerData,
} from "@/interface/lraData.interface";

export const useWebSocketStore = defineStore("useWebSocketStore", () => {
  // 負責管理 ws 實例
  const serverWs = reactive<{ ws: WsInstance[] }>({ ws: [] });
  const moduleWs = reactive<{ ws: WsInstance[] }>({ ws: [] });

  // 負責管理各 ws 的最新資訊，透過 ws->info->uuid 當作 index
  const serverdata = reactive<{ data: ILraServerData[] }>({ data: [] });
  const moduledata = reactive<{ data: ILraModuleData[] }>({ data: [] });

  const updateModuleNewRtData = (uuid: string, data: any) => {
    // get data or create new
    // data.acc[0] -> t,x,y,z
    // data.drv.x.rtp,

    let realtime: any;
    let acc_obj: object = {};
    let drv: any;

    if (data.acc == null) {
    } else {
      let acc_x_arr: any[] = [];
      let acc_y_arr: any[] = [];
      let acc_z_arr: any[] = [];
      data.acc.forEach((element: any) => {
        // create x, y, z
        acc_x_arr.push({
          x: element.t/1e9,
          y: element.x,
        });

        acc_y_arr.push({
          x: element.t/1e9,
          y: element.y,
        });

        acc_z_arr.push({
          x: element.t/1e9,
          y: element.z,
        });
      });
      Object.assign(acc_obj, { x: acc_x_arr, y: acc_y_arr, z: acc_x_arr });
    }

    drv = {
      x: {
        freq: {
          x: data.drv.t,
          y: data.drv.x.freq,
        },
        rtp: {
          x: data.drv.t,
          y: data.drv.x.rtp,
        },
      },
      y: {
        freq: {
          x: data.drv.t,
          y: data.drv.y.freq,
        },
        rtp: {
          x: data.drv.t,
          y: data.drv.y.rtp,
        },
      },
      z: {
        freq: {
          x: data.drv.t,
          y: data.drv.z.freq,
        },
        rtp: {
          x: data.drv.t,
          y: data.drv.z.rtp,
        },
      },
    };

    realtime = {
      acc: acc_obj,
      drv: drv,
    };

    const index = getLraDataIndex(uuid, "module");
    if (index == -1) {
      // create a new data
      let new_data: ILraModuleData = {
        uuid: uuid,
        realtime: realtime,
        reg: [],
      };
      moduledata.data.push(new_data);
      return getLraDataIndex(uuid, "module");
    } else {
      moduledata.data[index].realtime = realtime;
    }
  };

  const getLraDataIndex = (uuid: string, target: "server" | "module") => {
    if (target === "server")
      return serverdata.data.findIndex((el) => el.info.uuid === uuid);
    else return moduledata.data.findIndex((el) => el.uuid === uuid);
  };

  const getIndex = (mid: string | string[], target: "server" | "module") => {
    if (target === "server")
      return serverWs.ws.findIndex((el) => el.info.mid === mid);
    // 紀錄: 如果用 const findMid 會有問題 => _ws 是 private，看不到
    else return moduleWs.ws.findIndex((el) => el.info.mid === mid);
  };

  const getServerWs = (mid: string | string[]) => {
    const idx = getIndex(mid, "server");
    if (idx !== -1) {
      return serverWs.ws[idx];
    } else {
      // TODO: error handle
      console.warn(`can't find server ws for mid: ${mid}`);
      return null;
    }
  };

  const addServerWs = (wsObj: WsInstance) => {
    serverWs.ws.push(wsObj);
    return getServerWs(wsObj.info.mid);
  };

  /** should be called @ removeServer in SingleServerCard */
  const removeServerWs = (mid: string | string[]) => {
    const idx = getIndex(mid, "server");
    if (idx !== -1) {
      serverWs.ws[idx].closeWs();
      serverWs.ws.splice(idx, 1);
    }
  };

  const getModuleWs = (mid: string | string[]) => {
    const idx = getIndex(mid, "module");
    if (idx !== -1) {
      return moduleWs.ws[idx];
    } else {
      // TODO: error handle
      console.warn(`can't find server ws for mid: ${mid}`);
      return null;
    }
  };

  const addModuleWs = (wsObj: WsInstance) => {
    moduleWs.ws.push(wsObj);
    return getModuleWs(wsObj.info.mid); // 為了 getThisWs 寫的返回值
  };

  // TODO:
  /** should be called @ removeModule in SingleModuleCard or ?? */
  const removeModuleWs = (mid: string | string[]) => {
    const idx = getIndex(mid, "module");
    if (idx !== -1) {
      moduleWs.ws[idx].closeWs();
      moduleWs.ws.splice(idx, 1);
    }
  };

  return {
    serverWs,
    moduleWs,
    serverdata,
    moduledata,
    getServerWs,
    addServerWs,
    removeServerWs,
    getModuleWs,
    addModuleWs,
    removeModuleWs,
    updateModuleNewRtData,
    getLraDataIndex,
  };
});
