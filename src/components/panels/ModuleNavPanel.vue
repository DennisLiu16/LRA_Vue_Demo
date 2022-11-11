<!-- Module 右滑的 Panel -->
<!-- TODO: 改用 naive ui Menu 來做 disable link -->
<template>
  <n-card>
    <nav>
      <router-link :to="{name: 'registers', params: {uuid: props.uuid}}" >Register</router-link>
      <n-divider/>
      <RouterLink :to="{name: 'real-time-plot', params: {uuid: props.uuid}}">RT Plot</RouterLink>
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

const isDisabled = computed(() => {
  return false;
});

// store
// import { useServerStore } from "@/stores/useServerStore";

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
const props = defineProps({
  uuid: {
    // module id
    type: String,
    required: true,
  },
});

// const emits = defineEmits([]);
</script>

<style scoped></style>
