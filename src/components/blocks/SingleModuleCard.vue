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
              :style="{ width: '50%' }"
              type="text"
              name=""
              id="name"
            />
          </p>
          <p v-else>
            {{ localModuleInfo.name }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="ip">IP: </label>
          <p v-if="btnModifyState">
            <n-input
              v-model:value="localModuleInfo.ip"
              :style="{ width: '50%' }"
              type="text"
              name=""
              id="ip"
            />
          </p>
          <p v-else>
            {{ localModuleInfo.ip }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="port">Port: </label>
          <p v-if="btnModifyState">
            <n-input
              v-model:value="localModuleInfo.port"
              :style="{ width: '50%' }"
              :allow-input="onlyAllowNumber"
              type="text"
              name=""
              id="port"
            />
          </p>
          <p v-else>
            {{ localModuleInfo.port }}
          </p>
        </n-space>

        <n-space horizontal>
          <label for="server">Server: </label>
          <p v-if="btnModifyState">
            <n-input
              v-model:value="localModuleInfo.server"
              :style="{ width: '50%' }"
              type="text"
              name=""
              id="server"
            />
          </p>
          <p v-else>
            {{ localModuleInfo.server }}
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

        <n-button
          strong
          secondary
          round
          type="info"
          @click="enableCallBack"
          v-if="!btnEnableState"
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
    <br>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { NButton, NInput, NCard, NSpace } from "naive-ui";
import { Icon } from "@vicons/utils";
import { DeleteForeverRound } from "@vicons/material";

import type { IModuleInfo, Module } from "@/interface/module.interface";
import type { Ref } from "vue";

import { useModuleStore } from "@/stores/useModuleStore";

const props = defineProps({
  mid: {
    // module id
    type: Number,
    required: true,
  },
});

const moduleStore = useModuleStore();

const localModuleInfo = reactive<IModuleInfo>(
  moduleStore.getModuleInfo(props.mid)
);
const btnModifyState = ref(false);
const btnEnableState = ref(false);

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
</script>

<style lang="css">
.right {
  position: absolute;
  right: 0px;
  width: 300px;
  padding: 10px;
}
</style>
