<template>
  <n-button strong secondary circle type="info" @click="showModal = true">
    <Icon :size="20">
      <AddFilled />
    </Icon>
  </n-button>

  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :mask-closable="false"
    :segmented="segmented"
    :bordered="false"
    title="新增伺服器"
    size="huge"
  >
    <template #header-extra></template>
    <n-form
      ref=""
      :model="localServerInfo"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
    >
      <n-form-item label="Name :" path="name">
        <n-input v-model:value="localServerInfo.name" />
      </n-form-item>

      <n-form-item label="IP :" path="ip">
        <n-input v-model:value="localServerInfo.ip" />
      </n-form-item>

      <n-form-item label="Port :" path="port">
        <n-input-number v-model:value="localServerInfo.port" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button
        strong
        secondary
        round
        type="primary"
        @click="ValidateCallBack"
        style="float: right"
      >
        確認
      </n-button>
      <n-button
        strong
        secondary
        round
        type="error"
        @click="CancelCallBack"
        style="float: right"
      >
        取消
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onBeforeUnmount } from "vue";
import {
  NModal,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  type FormInst,
} from "naive-ui";
import { Icon } from "@vicons/utils";
import { AddFilled } from "@vicons/material";
import { v4 as uuidv4 } from "uuid";

import type { IServerInfo } from "@/interface/server.interface";

const emit = defineEmits(["formSubmit"]);

// TODO: https://juejin.cn/post/7101144285763862565, 可以改成多一層封裝

const showModal = ref(false);
const formRef = ref<FormInst | null>(null);

const localServerInfo = ref<IServerInfo>(createNewTmpServer());

function createNewTmpServer() {
  const server: IServerInfo = {
    uuid: uuidv4(),
    name: "DefaultServer",
    ip: "192.0.0.1",
    port: 8787,
    alive: false,
  };
  return server;
}

// TODO: Add validate condition, ref to form naive-ui
const ValidateCallBack = () => {
  console.log(formRef.value?.validate);
  if (formRef.value?.validate === undefined) {
    // no validate rule
    emit("formSubmit", localServerInfo.value);
    showModal.value = false;
  } else {
    formRef.value?.validate((errors) => {
      if (!errors) {
        // send local info back to father
        console.log("good");
        emit("formSubmit", localServerInfo.value);
        showModal.value = false;
      } else {
        console.log("failed");
      }
    });
  }
};

const CancelCallBack = () => {
  showModal.value = false;
};

// style region
const bodyStyle = { width: "600px" };
const segmented = { content: "soft", footer: "soft" };
</script>

<style lang="scss" scoped></style>
