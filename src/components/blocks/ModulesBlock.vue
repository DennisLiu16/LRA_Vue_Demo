<template>
  <div class="add-button-on-top">
    <n-button
      secondary
      class="btn-region"
      circle
      type="info"
      @click="addModule"
    >
      <Icon :size="20"> <AddFilled /> </Icon
    ></n-button>
  </div>

  <!-- 排版的關鍵 -->
  <div style="display: flex; flex-wrap: wrap">
    <SingleModuleCard
      class="card-region"
      v-for="(module, i) in moduleStore.moduleList.modules"
      :key="module.mid"
      :mid="module.mid"
    />
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { Icon } from "@vicons/utils";
import { useModuleStore } from "@/stores/useModuleStore";
import { Module } from "@/interface/module.interface";
import { v4 as uuidv4 } from "uuid";
import { AddFilled } from "@vicons/material";

import SingleModuleCard from "@/components/blocks/SingleModuleCard.vue";

const moduleStore = useModuleStore();
debugOnly();

function debugOnly() {
  console.log(moduleStore.moduleList.modules);
}

const addModule = () => {
  // create a module instance
  const module = new Module({
    mid: uuidv4(),
    name: "Default",
    ip: "192.0.0.0",
    port: 8787,
    server: "None",
  });

  // hit api and get module's information

  // update module info await and loading

  // if success -> addmodule, else abort

  moduleStore.addModule(module);
  debugOnly();
};
</script>

<style scoped>
.add-button-on-top {
  position: absoulte;
  z-index: 1;
}

.card-region {
  margin: 2%;
}

.btn-region {
  margin: 5px;
}
</style>
