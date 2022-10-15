<script setup lang="ts">
import ModulesBlock from "@/components/blocks/ModulesBlock.vue";
import ServerBlock from "@/components/blocks/ServersBlock.vue";

import { NSpace } from "naive-ui";
</script>

<template>
  <main>
    <div class="block-region">
      <ServerBlock />
    </div>
    <div class="block-region">
      <ModulesBlock />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 12px 12px;
}

.block-region {
  margin: 5%;
}
</style>
