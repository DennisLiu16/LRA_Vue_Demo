<script setup lang="ts">
import ModulesBlock from "@/components/blocks/ModulesBlock.vue";
import ServerBlock from "@/components/blocks/ServersBlock.vue";
</script>

<template>
  <main>
    <ServerBlock />
    <ModulesBlock />
  </main>
</template>

<style scoped>
main {
  padding: 12px 12px;
}
</style>
