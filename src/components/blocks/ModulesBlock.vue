<template lang="">
  <div>
    <p>
      <n-button round type="success" @click="addModule">新增模組</n-button>
    </p>

    <p>
      <SingleModuleCard
        v-for="(module, i) in moduleStore.moduleList.modules"
        :key="module.mid"
        :mid="module.mid"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useModuleStore } from "@/stores/useModuleStore";
import { Module } from "@/interface/module.interface";

import SingleModuleCard from "@/components/blocks/SingleModuleCard.vue";

const moduleStore = useModuleStore();

const addModule = () => {
  // create a module instance
  const module = new Module({
    name: "Default",
    ip: "192.0.0.0",
    port: 8787,
    server: "None",
  });

  moduleStore.addModule(module);
};
</script>

<style lang="css">
.right {
  position: absolute;
  right: 0px;
  width: 300px;
  padding: 10px;
}
</style>
