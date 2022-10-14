<template>
  <vue-horizontal responsive>
    <section v-for="(server, i) in serverStore.serverList.servers">
      <SingleServerCard
        :key="server.uuid"
        :uuid="server.uuid"
      ></SingleServerCard>
    </section>
  </vue-horizontal>
</template>
<script setup lang="ts">
import SingleServerCard from "@/components/blocks/SingleServerCard.vue";
import { useServerStore } from "@/stores/useServerStore";
import VueHorizontal from "vue-horizontal";

import { NSpace } from "naive-ui";

const serverStore = useServerStore();
</script>
<style scoped>
section {
  padding: 16px 24px;
  background: #f3f3f3;
}
</style>
