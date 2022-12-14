import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";
import { v4 as uuidv4 } from "uuid";

import type { IServerInfo } from "@/interface/server.interface";
import selection from "naive-ui/es/_internal/selection";
import { NoEncryptionFilled } from "@vicons/material";

export const useServerStore = defineStore(
  "useServerStore",
  () => {
    const substitudeName: string = "Not-found";
    const serverBanNameList:string[] = ["None", substitudeName, "MainServer"];

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

    initCheck();

    function initCheck() {
      if (
        serverList.servers.find((el) => el.name == "MainServer") == undefined
      ) {
        const uuid = uuidv4();
        /* TODO: 要將 ip 和 port 改成之後 django 的設置 */
        const localServer = {
          uuid: uuid,
          name: "MainServer",
          ip: window.location.hostname,
          port: parseInt(window.location.port),
          alive: false,
        } as IServerInfo;
        serverList.servers.push(localServer);
      } else {
        // TODO: Hit API to test django state
      }
    }

    const getServerName = (uuid: string) => {
      const candidate = serverList.servers.find((el) => el.uuid === uuid);
      if (candidate != undefined) return candidate.name;
      return substitudeName;
    };

    const getServerIndex = (uuid: string) => {
      const idx = serverList.servers.findIndex((el) => el.uuid === uuid);
      if (idx != undefined) return idx;
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
      return info;
    };

    const removeServer = (uuid: string) => {
      // if not found, throw internal error
      const idx = getServerIndex(uuid);
      serverList.servers.splice(idx, 1);
    };

    const updateServerInfo = (uuid: string, info: IServerInfo) => {
      const idx = getServerIndex(uuid);
      if (info.name !== serverList.servers[idx].name)
        serverList.servers[idx].name = info.name;

      if (info.ip !== serverList.servers[idx].ip) {
        serverList.servers[idx].ip = info.ip;
        serverList.servers[idx].alive = false;
      }

      if (info.port !== serverList.servers[idx].port) {
        serverList.servers[idx].port = info.port;
        serverList.servers[idx].alive = false;
      }
    };

    return {
      serverList,
      serverSelect,
      substitudeName,
      serverBanNameList,
      getServerIndex,
      getServerInfo,
      getServerName,
      removeServer,
      updateServerInfo,
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
