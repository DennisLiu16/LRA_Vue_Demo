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
      <div class="btn-region"><ServerModifyForm :uuid="props.uuid" /></div>
      <!-- TODO: Move to ServerModifyForm and verify console log in useServerStore -->
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
</script>

<style scoped>
.btn-region {
  float: right;
  margin-right: 2px;
}
</style>
