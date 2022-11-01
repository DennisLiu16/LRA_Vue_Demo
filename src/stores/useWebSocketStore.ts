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

  const getIndex = (mid: string, target: "server" | "module") => {
    if (target === "server")
      return serverWs.ws.findIndex(
        (el) => el.info.mid === mid
      ); // 紀錄: 如果用 const findMid 會有問題 => _ws 是 private，看不到
    else return moduleWs.ws.findIndex((el) => el.info.mid === mid);
  };

  const getServerWs = (mid: string) => {
    const idx = getIndex(mid, "server");
    if (idx !== -1) {
      return serverWs.ws[idx];
    } else {
      // TODO: error handle
      return null;
      console.error(`can't find server ws for mid: ${mid}`);
    }
  };

  const addServerWs = (wsObj: WsInstance) => {
    serverWs.ws.push(wsObj);
    return getServerWs(wsObj.info.mid);
  };

  /** should be called @ removeServer in SingleServerCard */
  const removeServerWs = (mid: string) => {
    const idx = getIndex(mid, "server");
    if (idx !== -1) {
      serverWs.ws.splice(idx, 1);
    }
  };

  const getModuleWs = (mid: string) => {
    const idx = getIndex(mid, "module");
    if (idx !== -1) {
      return moduleWs.ws[idx];
    } else {
      // TODO: error handle
      return null;
      console.error(`can't find server ws for mid: ${mid}`);
    }
  };

  const addModuleWs = (wsObj: WsInstance) => {
    moduleWs.ws.push(wsObj);
    return getModuleWs(wsObj.info.mid); // 為了 getThisWs 寫的返回值
  };

  // TODO:
  /** should be called @ removeModule in SingleModuleCard or ?? */
  const removeModuleWs = (mid: string) => {
    const idx = getIndex(mid, "module");
    if (idx !== -1) {
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
  };
});
