import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";
import { v4 as uuidv4 } from "uuid"

import type { IServerInfo } from '@/interface/server.interface'
import selection from "naive-ui/es/_internal/selection";
import { NoEncryptionFilled } from "@vicons/material";

export const useServerStore = defineStore('useServerStore', () => {

  const invalidName:string = "Not-found";

  const serverList = reactive<{ servers: IServerInfo[] }>({ servers: [] });

  // make a select list of servers
  const serverSelect = computed(() => {

    let selection:Array<any> = [{label: "None", value: "None"}];

    for (let server of serverList.servers) {
      const disableVal = server.alive ? false : true;
      selection.push({
        label: server.name,
        value: server.uuid,
        disable: disableVal
      });
    }
    return selection;
  })

  initCheck();

  function initCheck() {
    if (serverList.servers.find(el => el.name == "MainServer") == undefined) {
      const uuid = uuidv4();
      const localServer = {
        uuid: uuid,
        name: "MainServer",
        ip: window.location.hostname,
        port: parseInt(window.location.port)
      } as IServerInfo;
      serverList.servers.push(localServer);
    }
  }

  const getServerName = (uuid: string) => {
    const candidate = serverList.servers.find(el => el.uuid === uuid);
    if (candidate != undefined)
      return candidate.name;
    return invalidName;
  }

  return {
    serverList,
    serverSelect,
    invalidName,
    getServerName
  };

}, {
  persist: {
    storage: sessionStorage,
    serializer: {
      deserialize: parse,
      serialize: stringify,
    },
    debug: true,
  },
})