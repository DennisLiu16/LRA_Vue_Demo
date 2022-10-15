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
import SingleServerCard from "@/components/blocks/SingleServerCard.vue";
import { useServerStore } from "@/stores/useServerStore";
import VueHorizontal from "vue-horizontal";

const serverStore = useServerStore();
</script>

<style scoped>
section {
  padding: 16px 24px;
  background: #f3f3f3;
}
</style>
