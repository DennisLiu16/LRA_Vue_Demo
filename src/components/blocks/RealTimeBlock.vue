<template>
  <VueApexCharts
    width="500"
    type="bar"
    :options="options"
    :series="series"
  ></VueApexCharts>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref } from "vue";
import { NButton, NInput } from "naive-ui";
import { Icon } from "@vicons/utils";
import VueHorizontal from "vue-horizontal";
import VueApexCharts from "vue3-apexcharts";

// store
// import { useServerStore } from "@/stores/useServerStore";

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
// const props = defineProps({});

// const emits = defineEmits({});

const series = [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
];

const options = {
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
};
</script>

<style scoped></style>
