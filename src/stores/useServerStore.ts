import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";
import { v4 as uuidv4 } from "uuid";

import type { IServerInfo } from "@/interface/server.interface";

export const useServerStore = defineStore(
  "useServerStore",
  () => {
    const substitudeName: string = "Not-found";
    const serverBanNameList: string[] = ["None", substitudeName, "MainServer"];

    const serverList = reactive<{ servers: IServerInfo[] }>({ servers: [] });

    // make a select list of servers
    const serverSelect = computed(() => {
      let selection: Array<any> = [{ label: "None", value: "None" }]; // default setting, no this server exists

      for (let server of serverList.servers) {
        const disableVal = server.alive ? false : true;
        selection.push({
          label: server.name,
          value: server.uuid,
          disable: disableVal,
        });
      }
      return selection;
    });

    const getServerName = (uuid: string) => {
      const candidate = serverList.servers.find((el) => el.uuid === uuid);
      if (candidate != undefined) return candidate.name;
      return substitudeName;
    };

    const getServerIndex = (uuid: string) => {
      const idx = serverList.servers.findIndex((el) => el.uuid === uuid);
      if (idx !== -1) return idx;
      else {
        console.log("Index of server can't find");
        throw new Error("Index of server can't find");
      }
    };

    // TODO: check correct or not
    const getServerInfo = (uuid: string) => {
      const idx = getServerIndex(uuid);
      const info = {} as IServerInfo;
      info.name = serverList.servers[idx].name;
      info.ip = serverList.servers[idx].ip;
      info.port = serverList.servers[idx].port;
      info.alive = serverList.servers[idx].alive;
      info.loadingState = serverList.servers[idx].loadingState;
      return info;
    };

    const addServer = (obj: IServerInfo) => {
      serverList.servers.push(obj);
    };

    /* You should check serverWs by yourself! */
    const removeServer = (uuid: string) => {
      // if not found, getServerIndex throw internal error
      const idx = getServerIndex(uuid);
      serverList.servers.splice(idx, 1);
    };

    const updateServerInfo = (uuid: string, info: IServerInfo) => {
      const idx = getServerIndex(uuid);

      serverList.servers[idx].name = info.name;

      // XXX
      if (serverList.servers[idx].ip !== info.ip || serverList.servers[idx].port !== info.port) {
        serverList.servers[idx].alive = info.alive;
        serverList.servers[idx].loadingState = info.loadingState;
      }

      serverList.servers[idx].ip = info.ip;
      // serverList.servers[idx].alive = false;

      serverList.servers[idx].port = info.port;
      // serverList.servers[idx].alive = false;
    };

    const updateServerLoadingState = (
      uuid: string,
      state: "disconnect" | "connected" | "loading"
    ) => {
      const idx = getServerIndex(uuid);
      serverList.servers[idx].loadingState = state;
    };

    // 再想想吧
    const switchServerAlive = (uuid: string, state?: boolean) => {
      const idx = getServerIndex(uuid);
      const _state =
        state !== undefined ? state : !serverList.servers[idx].alive;
      serverList.servers[idx].alive = _state;
    };

    return {
      serverList,
      serverSelect,
      substitudeName,
      serverBanNameList,
      getServerIndex,
      getServerInfo,
      getServerName,
      addServer,
      removeServer,
      updateServerInfo,

      // should be aborted
      switchServerAlive,
      updateServerLoadingState,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
      debug: true,
    },
  }
);
