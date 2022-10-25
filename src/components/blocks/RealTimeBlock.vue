<template>
  <VueApexCharts :options="options" :series="series"></VueApexCharts>
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

const thedata = reactive([1, 2, 3, 4]);

const series = [
  {
    name: "test",
    data: thedata,
  },
];

const options = {
  chart: {
    id: "vuechart-example",
    height: 350,
    width: 500,
    type: "line",
    animations: {
      enabled: false,
      easing: "linear",
      dynamicAnimation: {
        speed: 1000,
      },
    },
    stroke: {
      curve: "smooth",
    },
  },
  xaxis: {
    datetime: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
  dataLabels: {
    enabled: false,
  },
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

setInterval(() => {
  thedata.push(getRandomInt(100));
  if (thedata.length > 30) {
    thedata.shift();
  }
}, 50);
</script>

<style scoped></style>
