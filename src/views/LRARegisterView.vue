<template>
  <main>
    <n-button strong type="primary" @click="sendRequireRegs"
      >SendRegRequire</n-button
    >
    <n-button
      strong
      type="primary"
      color="black"
      @click="SendCalibrationRequire"
      >SendCalibrationRequire</n-button
    >
    <n-divider></n-divider>
    <n-button strong type="info" @click="SendDriveRequire"
      >SendDriveRequire</n-button
    >
    <n-button strong type="error" @click="SendPauseRequire"
      >SendPauseRequire</n-button
    >
    <n-divider></n-divider>
    <n-button strong type="primary" @click="SendRtKeepRequire"
      >SendRtKeepRequire</n-button
    >
    <n-button strong type="error" @click="SendRtStopRequire"
      >SendRtStopRequire</n-button
    >
    <n-divider></n-divider>

    <n-button strong type="primary" @click="SendRtpCmdUpdate"
      >SendRtpCmdUpdate</n-button
    >
    <n-input></n-input>
  </main>
</template>

<script setup lang="ts">
// lib
import { ref, reactive, computed, type Ref, onMounted } from "vue";
import { NButton, NInput, NDivider } from "naive-ui";
import { Icon } from "@vicons/utils";
import VueHorizontal from "vue-horizontal";
import { useRoute } from "vue-router";
import { useWebSocketStore } from "@/stores/useWebSocketStore";

import { makeWsRequest } from "@/composables/wsUtil";

// store
// import { useServerStore } from "@/stores/useServerStore";

// XXX: 需要寫 ws 如果刷新

const route = useRoute();
const wsStore = useWebSocketStore();
const myuuid = route.params.uuid;

const sendRequireRegs = () => {
  const request = makeWsRequest("regAllRequire");
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });
  /* TODO: if is object -> try to connect */

  /* TODO: if fail go back to home with warning*/

  ws?.send(request);
  console.log("sendRequireRegs");
};

// drive with const rtp 0x5a
const SendDriveRequire = () => {
  const request = makeWsRequest("drvDriveUpdate", { run: true });
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendDriveRequire");
};

const SendPauseRequire = () => {
  const request = makeWsRequest("drvDriveUpdate", { run: false });
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendPauseRequire");
};

const SendRtpCmdUpdate = () => {
  // fixed to 0x5a
  const request = makeWsRequest("drvCmdUpdate", { x: 0x5a, y: 0x5a, z: 0x5a });
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendRtpCmdUpdate");
};

const SendCalibrationRequire = () => {
  const request = makeWsRequest("calibrationRequire");
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendCalibrationRequire");
};

const SendRtKeepRequire = () => {
  const request = makeWsRequest("dataRTKeepRequire");
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendRtKeepRequire");
};

const SendRtStopRequire = () => {
  const request = makeWsRequest("dataRTStopRequire");
  const ws = wsStore.getModuleWs(myuuid);
  Object.assign(request, { uuid: myuuid });

  ws?.send(request);
  console.log("SendRtStopRequire");
};

// material
// import { DeleteForeverRound } from "@vicons/material";

// props and emit
// const props = defineProps({

// });

// const emits = defineEmits({

// });
</script>

<style scoped></style>
