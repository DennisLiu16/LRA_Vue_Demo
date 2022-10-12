import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";

import type { IModuleInfo, Module } from "@/interface/module.interface";

export const useModuleStore = defineStore(
  "useModuleStore",
  () => {
    const moduleList = reactive<{ modules: Module[] }>({ modules: [] });

    const addModule = (obj: Module) => {
      moduleList.modules.push(obj);
    };

    // mid: module id
    const removeModule = (mid: string) => {
      const idx = getModuleIndex(mid);
      if (idx !== undefined) {
        moduleList.modules.splice(idx, 1);
      }
    };

    const getModuleIndex = (mid: string) => {
      const fitMid = (el: Module) => el.mid === mid;

      // TODO: protect
      return moduleList.modules.findIndex(fitMid);
    };

    const getModuleInfo = (mid: string) => {
      const idx = getModuleIndex(mid);
      const info = {} as IModuleInfo;
      if (idx !== undefined) {
        info.ip = moduleList.modules[idx].ip;
        info.name = moduleList.modules[idx].name;
        info.port = moduleList.modules[idx].port;
        info.server = moduleList.modules[idx].server;
      }
      return info;
    };

    const updateModule = (mid: string, obj: IModuleInfo) => {
      const idx = getModuleIndex(mid);
      if (idx !== undefined) {
        moduleList.modules[idx].ip = obj.ip;
        moduleList.modules[idx].name = obj.name;
        moduleList.modules[idx].port = obj.port;
        moduleList.modules[idx].server = obj.server;
      }
    };

    return {
      moduleList,
      addModule,
      removeModule,
      updateModule,
      getModuleInfo,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      // paths: ["moduleList"],
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
      debug: true,
    },
  }
);
