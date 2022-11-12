<template>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref, onBeforeMount, onBeforeUnmount, onMounted, toRaw } from "vue";
import { NButton, NInput } from "naive-ui";
import { Icon } from "@vicons/utils";
import VueHorizontal from "vue-horizontal";
import VueApexCharts from "vue3-apexcharts";

import { useRoute } from "vue-router";
import { useWebSocketStore } from "@/stores/useWebSocketStore";

import { lightningChart } from '@arction/lcjs';

const route = useRoute();
const wsStore = useWebSocketStore();
const myuuid = route.params.uuid;

// create chart
const chart = lightningChart().ChartXY();
chart.setTitle('LRA Real Time Data - Acc X')

const acc_x = chart.addLineSeries();
acc_x.setStrokeStyle((style) => style.setThickness(5));

const append_new_data = () => {
  const idx = wsStore.getLraDataIndex(myuuid.toString(), "module");
  if (idx != -1) {
    // get data
    // console.log(toRaw(wsStore.moduledata.data[idx].realtime.acc));
    acc_x.add(wsStore.moduledata.data[idx].realtime.acc.x);
    // const len = wsStore.moduledata.data[idx].realtime.acc.x.length;
    // const x_max = wsStore.moduledata.data[idx].realtime.acc.x[len-1].x;
  }
  
};

setInterval(append_new_data, 10);

// store
// import { useServerStore } from "@/stores/useServerStore";

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
// const props = defineProps({});

// const emits = defineEmits({});

onBeforeMount(() => {
});

onMounted(() => {
  
}),

onBeforeUnmount(() => {
  chart.dispose();
});


</script>

<style scoped></style>
