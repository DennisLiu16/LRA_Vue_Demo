<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref } from "vue";
import { NButton, NInput } from "naive-ui";
import { Icon } from "@vicons/utils";
import { RouterLink, RouterView } from 'vue-router'
import VueHorizontal from "vue-horizontal";

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

<style scoped></style>
