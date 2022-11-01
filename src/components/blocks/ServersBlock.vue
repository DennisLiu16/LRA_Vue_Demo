<template>
  <vue-horizontal responsive scroll>
    <section
      v-for="server in serverStore.serverList.servers"
      :key="server.uuid"
    >
      <SingleServerCard :uuid="server.uuid"></SingleServerCard>
    </section>
  </vue-horizontal>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import SingleServerCard from "@/components/blocks/SingleServerCard.vue";
import { useServerStore } from "@/stores/useServerStore";
import VueHorizontal from "vue-horizontal";
import { v4 as uuidv4 } from "uuid";

import type { IServerInfo } from "@/interface/server.interface";

const serverStore = useServerStore();

// init once

function confirmMainServerExists() {
  const hasMainServer = serverStore.serverList.servers.some(
    (el) => el.name === "MainServer"
  );

  if (hasMainServer === false) {
    // create Mainserver
    const mainServer = {
      uuid: uuidv4(),
      name: "MainServer",
      ip:
        window.location.hostname === "localhost"
          ? "127.0.0.1"
          : window.location.hostname,
      port: 8765, // parseInt(window.location.port),
      alive: false,
    } as IServerInfo;

    serverStore.addServer(mainServer);
  }
}

onMounted(() => {
  confirmMainServerExists();
});
</script>

<style scoped>
section {
  padding: 16px 24px;
  background: #f3f3f3;
}
</style>
