<template>
  <!-- 讓兩個 card 水平排列 -->
  <div style="display: flex">
    <n-card class="card-main">
      <n-button
        strong
        secondary
        circle
        type="error"
        class="btn-region"
        @click="moduleStore.removeModule(props.mid)"
      >
        <Icon :size="20">
          <DeleteForeverRound />
        </Icon>
      </n-button>

      <n-space vertical>
        <label for="mid">MID: {{ props.mid }}</label>

        <n-space horizontal>
          <label for="name">Name: </label>
          <p v-if="btnModifyState">
            <n-input
              v-model:value="localModuleInfo.name"
              type="text"
              name=""
              id="name"
            />
          </p>
          <p v-else>
            {{ moduleStore.getModuleInfo(props.mid).name }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="ip">IP: </label>
          <p v-if="btnModifyState">
            <n-input
              v-model:value="localModuleInfo.ip"
              type="text"
              name=""
              id="ip"
            />
          </p>
          <p v-else>
            {{ moduleStore.getModuleInfo(props.mid).ip }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="port">Port: </label>
          <p v-if="btnModifyState">
            <n-input-number
              v-model:value="localModuleInfo.port"
              name=""
              id="port"
            />
          </p>
          <p v-else>
            {{ moduleStore.getModuleInfo(props.mid).port }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="server">Server: </label>
          <p v-if="btnModifyState">
            <n-select
              :consistent-menu-width="false"
              v-model:value="localModuleInfo.server"
              :options="serverStore.serverSelect"
              id="server"
            />
          </p>
          <!-- 新增伺服器的表單 -->
          <ServerForm
            v-if="btnModifyState"
            @form-submit="addNewServerCallBack"
          />
          <p v-else>
            {{
              serverStore.getServerName(
                moduleStore.getModuleInfo(props.mid).server
              )
            }}
          </p>
        </n-space>
      </n-space>

      <p>
        <n-button
          v-if="!btnEnableState"
          class="btn-region"
          strong
          secondary
          round
          type="info"
          :disabled="enableCheck()"
          @click="enableCallBack"
        >
          Start
        </n-button>

        <n-button
          class="btn-region"
          strong
          round
          type="info"
          @click="enableCallBack"
          v-if="btnEnableState"
        >
          Stop
        </n-button>
      </p>

      <p>
        <n-button
          class="btn-region"
          strong
          round
          type="primary"
          @click="modifyCallBack"
          v-if="!btnModifyState"
        >
          Modify
        </n-button>

        <n-button
          class="btn-region"
          strong
          round
          type="primary"
          @click="confirmCallBack"
          v-if="btnModifyState"
        >
          Confirm
        </n-button>

        <n-button
          strong
          class="btn-region"
          round
          type="error"
          @click="cancelCallBack"
          v-if="btnModifyState"
        >
          Cancel
        </n-button>

        <!-- TODO: add button loading state -->
      </p>
    </n-card>
    <ModuleNavPanel class="card-sub" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from "vue";
import {
  NButton,
  NInput,
  NCard,
  NSpace,
  NSelect,
  NInputNumber,
} from "naive-ui";
import { Icon } from "@vicons/utils";
import { DeleteForeverRound } from "@vicons/material";

import type { IModuleInfo, Module } from "@/interface/module.interface";
import type { Ref } from "vue";

import { useModuleStore } from "@/stores/useModuleStore";
import { useServerStore } from "@/stores/useServerStore";

import ServerForm from "@/components/form/ServerForm.vue";
import ModuleNavPanel from "@/components/panels/ModuleNavPanel.vue";
import type { IServerInfo } from "@/interface/server.interface";

const props = defineProps({
  mid: {
    // module id
    type: String,
    required: true,
  },
});

const moduleStore = useModuleStore();
const serverStore = useServerStore();

const localModuleInfo = reactive<IModuleInfo>(
  moduleStore.getModuleInfo(props.mid)
);

// ref to localInfo, bug: won't update when serverinfo update by user
// const serverName = computed(() => {
//   return serverStore.getServerName(localModuleInfo.server);
// });

const btnModifyState = ref(false);
const btnEnableState = ref(false);
const btnAddNewServer = ref(false);

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const modifyBooleanState = (refbool: Ref<boolean>) => {
  refbool.value = !refbool.value;
};

const modifyCallBack = () => {
  modifyBooleanState(btnModifyState);
};

const cancelCallBack = () => {
  const info = moduleStore.getModuleInfo(props.mid);
  // TODO: change to class method
  localModuleInfo.ip = info.ip;
  localModuleInfo.name = info.name;
  localModuleInfo.port = info.port;
  localModuleInfo.server = info.server;
  modifyBooleanState(btnModifyState);
};

const confirmCallBack = () => {
  moduleStore.updateModule(props.mid, localModuleInfo);
  modifyBooleanState(btnModifyState);
};

const enableCallBack = () => {
  modifyBooleanState(btnEnableState);
  /* TODO: Do something else here according to new state */
};

// if server is alive -> enable to connect
const enableCheck = () => {
  const serveruuid = moduleStore.getModuleInfo(props.mid).server;
  // if not default value: "None"
  if (serveruuid !== "None")
    return serverStore.getServerInfo(serveruuid).alive === true;
  return false;
};

const addNewServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  serverStore.serverList.servers.push(serverinfo);

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};

onUnmounted(() => {
  console.log('Module unmounted: ' + props.mid);
});

</script>

<style scoped>
.card-main {
  z-index: 100;
  max-height: 300px;
  width: 450px;
  position: relative; /*可疊加*/
}

.card-sub {
  z-index: 99;
  max-height: 300px;
  width: 100px;
  position: relative; /*可疊加*/
}

.btn-region {
  float: right;
  margin: 5px;
  margin-top: 15px;
}
</style>
