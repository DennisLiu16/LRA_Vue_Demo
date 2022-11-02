<template>
  <n-card>
    <div>
      <div>
        <!-- TODO: removeServer 改成 local， 跳出警告視窗 -->
        <n-button
          class="btn-region"
          strong
          secondary
          circle
          type="error"
          :disabled="isMainServer"
          @click="removeServerCard"
        >
          <Icon :size="20"> <DeleteForeverRound /> </Icon
        ></n-button>
      </div>
      <div class="btn-region">
        <ServerModifyForm
          :uuid="props.uuid"
          :disabled="isMainServer"
          @form-modified="modifyServerCallBack"
        />
      </div>
    </div>

    <n-space vertical>
      <p>
        <label for="uuid"> UUID: </label>
        {{ props.uuid }}
      </p>

      <p>
        <label for="name"> Name: </label>
        {{ tryToGetResponsiveServerInfo.name }}
      </p>

      <p>
        <label for="ip"> IP: </label>
        {{ tryToGetResponsiveServerInfo.ip }}
      </p>

      <p>
        <label for="port"> Port: </label>
        {{ tryToGetResponsiveServerInfo.port }}
      </p>

      <!-- TODO: change to led form -->
      <p>
        <label for="alive"> Alive: </label>
        {{ tryToGetResponsiveServerInfo.alive }}
      </p>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NButton, NCard, NSpace } from "naive-ui";
import { useServerStore } from "@/stores/useServerStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { Icon } from "@vicons/utils";
import { DeleteForeverRound } from "@vicons/material";
import { AppsList20Filled } from "@vicons/fluent";
import ServerModifyForm from "@/components/form/ServerModifyForm.vue";

import type { IServerInfo } from "@/interface/server.interface";
import { WsInstance } from "@/interface/myWebSocket.interface";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});

const serverStore = useServerStore();
const wsStore = useWebSocketStore();

const loadingIconShow = ref(false);

const isMainServer = computed(() => {
  return serverStore.getServerInfo(props.uuid).name === "MainServer";
});

const tryToGetResponsiveServerInfo = computed(() => {
  // use index instead getInfo
  // will throw error if not found
  const idx = serverStore.getServerIndex(props.uuid);
  return serverStore.serverList.servers[idx];
});

const removeServerCard = () => {
  serverStore.removeServer(props.uuid);
  wsStore.removeServerWs(props.uuid);
}

const modifyServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  serverStore.updateServerInfo(props.uuid, serverinfo);

  // TODO: update serverWs.ws info also reconnect
  console.log(serverStore.serverList.servers);

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};

// ws related
async function asyncConnect() {
  loadingIconShow.value = true;
  let ws = tryToGetWsInstance(props.uuid);
  try {
    const wsConnectState = await ws?.connectWs();
    if (wsConnectState === WsInstance.OPEN) {
      serverStore.switchServerAlive(props.uuid);
      console.log(`server: ${tryToGetResponsiveServerInfo.value.name} succesfully connected`);
    }
  } catch (err) {
    // do something in call back already
  } finally {
    loadingIconShow.value = false;
  }
}

const tryToGetWsInstance = (uuid: string) => {
  return wsStore.getServerWs(uuid);
};

// callbacks



onMounted(() => {
  // get ws if serverWs exists, or create a new connection
});
</script>

<style scoped>
.btn-region {
  float: right;
  margin: 5px;
}
</style>
