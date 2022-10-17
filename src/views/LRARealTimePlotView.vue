<template>
  <div>
    <RealTimeBlock />
  </div>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref } from "vue";
import { NButton, NInput } from "naive-ui";
import { Icon } from "@vicons/utils";
import VueHorizontal from "vue-horizontal";

import RealTimeBlock from "@/components/blocks/RealTimeBlock.vue";

// store
// import { useServerStore } from "@/stores/useServerStore";

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
// const props = defineProps({

// });

// const emits = defineEmits({

// });
</script>

<style scoped>
@media (min-width: 1024px) {
  .real-time-plot {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
