<!-- Module 右滑的 Panel -->
<!-- TODO: 改用 naive ui Menu 來做 disable link -->
<template>
  <n-card>
    <nav>
      <RouterLink to="/base/registers">Register</RouterLink>
      <n-divider/>
      <RouterLink to="/base/real-time-plot">RT Plot</RouterLink>
    </nav>
  </n-card>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref } from "vue";
import { NButton, NInput, NCard, NDivider } from "naive-ui";
import { Icon } from "@vicons/utils";
import VueHorizontal from "vue-horizontal";

import { RouterLink, RouterView } from "vue-router";

// store
// import { useServerStore } from "@/stores/useServerStore";

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
// const props = defineProps({});

// const emits = defineEmits({});
</script>

<style scoped></style>
