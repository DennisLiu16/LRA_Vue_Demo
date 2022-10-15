<template lang="">
  <div>
    <n-card>
      <n-button
        strong
        secondary
        circle
        type="error"
        style="float: right"
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

      <p style="float: right">
        <n-button
          strong
          round
          type="primary"
          @click="modifyCallBack"
          v-if="!btnModifyState"
        >
          修改
        </n-button>
        <n-button
          strong
          round
          type="error"
          @click="cancelCallBack"
          v-if="btnModifyState"
        >
          取消
        </n-button>
        <n-button
          strong
          round
          type="primary"
          @click="confirmCallBack"
          v-if="btnModifyState"
        >
          確認
        </n-button>

        <!-- TODO: add button loading state -->
        <n-button
          v-if="!btnEnableState"
          strong
          secondary
          round
          type="info"
          :disabled="!enableCheck()"
          @click="enableCallBack"
        >
          傳輸
        </n-button>

        <n-button
          strong
          round
          type="info"
          @click="enableCallBack"
          v-if="btnEnableState"
        >
          終止
        </n-button>
      </p>
    </n-card>
    <br />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
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

const enableCheck = () => {
  return (
    serverStore.getServerName(moduleStore.getModuleInfo(props.mid).server) !==
    serverStore.invalidName
  );
};

const addNewServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  console.log(serverinfo);
  serverStore.serverList.servers.push(serverinfo);
  console.log(serverStore.serverList.servers);

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};
</script>

<style lang="css">
.right {
  position: absolute;
  right: 0px;
  width: 300px;
  padding: 10px;
}
</style>
