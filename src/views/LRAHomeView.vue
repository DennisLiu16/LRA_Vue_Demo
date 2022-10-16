<script setup lang="ts">
import ModulesBlock from "@/components/blocks/ModulesBlock.vue";
import ServerBlock from "@/components/blocks/ServersBlock.vue";

import { NDivider } from "naive-ui";
</script>

<template>
  <main>
    <n-divider dashed> Servers </n-divider>

    <div class="block-region">
      <ServerBlock />
    </div>

    <n-divider dashed> Modules </n-divider>

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
  margin: 2%;
}
</style>
