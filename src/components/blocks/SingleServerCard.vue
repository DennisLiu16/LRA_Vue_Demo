<template>
  <n-card>
    <div>
      <div>
        <n-button
          class="btn-region"
          strong
          secondary
          circle
          type="error"
          @click="serverStore.removeServer(props.uuid)"
        >
          <Icon :size="20"> <DeleteForeverRound /> </Icon
        ></n-button>
      </div>
      <div class="btn-region">
        <ServerModifyForm :uuid="props.uuid" @form-modified="modifyServerCallBack" />
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
import { ref, computed } from "vue";
import { NButton, NCard, NSpace } from "naive-ui";
import { useServerStore } from "@/stores/useServerStore";
import { Icon } from "@vicons/utils";
import { DeleteForeverRound } from "@vicons/material";
import { AppsList20Filled } from "@vicons/fluent";
import ServerModifyForm from "@/components/form/ServerModifyForm.vue";

import type { IServerInfo } from "@/interface/server.interface";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});

const serverStore = useServerStore();

const tryToGetResponsiveServerInfo = computed(() => {
  // use index instead getInfo
  // will throw error if not found
  const idx = serverStore.getServerIndex(props.uuid);
  console.log("this should appear if server info being modified");
  return serverStore.serverList.servers[idx];
});

const modifyServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  serverStore.updateServerInfo(props.uuid, serverinfo);
  console.log(serverStore.serverList.servers);

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};
</script>

<style scoped>
.btn-region {
  float: right;
  margin-right: 2px;
}
</style>
