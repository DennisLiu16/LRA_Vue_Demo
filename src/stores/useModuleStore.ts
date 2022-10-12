import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { stringify, parse } from 'zipson'

import type { Module } from '@/interface/module.interface';

export const useModuleStore = defineStore('useModuleStore', () => {
  const moduleList = reactive<{ modules: Module[] }>({ modules: [] });

  const addModule = (obj: Module) => {
    moduleList.modules.push(obj);
  }

  // mid: module id
  const removeModule = (mid: Number) => {
    const idx = getModuleIndex(mid);
    if (idx !== undefined) {
      moduleList.modules.splice(idx, 1);
    }
  }

  const getModuleIndex = (mid: Number) => {
    const fitMid = (el: Module) => el.mid === mid;

    // TODO: protect
    return moduleList.modules.findIndex(fitMid);
  }

  return { moduleList, addModule, removeModule };
}, {
  persist: {
    storage: sessionStorage,
    paths: ['moduleList'],
    serializer: {
      deserialize: parse,
      serialize: stringify
    },
    debug: true
  }
})