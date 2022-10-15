<!-- The form is for adding server to serverlist -->

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
      :rules="rules"
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
        :disabled="disableConfirmButton"
        @click="validateCallBack"
        style="float: right"
      >
        Confirm
      </n-button>
      <n-button
        strong
        secondary
        round
        type="error"
        @click="cancelCallBack"
        style="float: right"
      >
        Cancel
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
  type FormItemRule,
  type FormRules,
} from "naive-ui";
import { Icon } from "@vicons/utils";
import { AddFilled } from "@vicons/material";
import { v4 as uuidv4 } from "uuid";

import type { IServerInfo } from "@/interface/server.interface";
import { useServerStore } from "@/stores/useServerStore";

const emit = defineEmits(["formSubmit"]);

// TODO: https://juejin.cn/post/7101144285763862565, 可以改成多一層封裝

const showModal = ref(false);
const formRef = ref<FormInst | null>(null);

const serverStore = useServerStore();

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

// Need to send back type IServerInfo, not typeof(Ref<IServerInfo>.value)
// Leading uuid error
const emitSubmit = () => {
  const info: IServerInfo = {
    uuid: localServerInfo.value.uuid,
    name: localServerInfo.value.name,
    ip: localServerInfo.value.ip,
    port: localServerInfo.value.port,
    alive: localServerInfo.value.alive,
  };

  emit("formSubmit", info);
  showModal.value = false;
  // create new uuid for next new server
  localServerInfo.value.uuid = uuidv4();
};

// TODO: Add validate condition, ref to form naive-ui
const validateCallBack = () => {
  if (formRef.value?.validate === undefined) {
    // no validate rule
    emitSubmit();
  } else {
    formRef.value?.validate((errors) => {
      if (!errors) {
        // send local info back to father
        emitSubmit();
      } else {
      }
    });
  }
};

const cancelCallBack = () => {
  showModal.value = false;
};

// TODO: 可以移到檢查資料夾
const disableConfirmButton = computed(() => {
  const isNull =
    localServerInfo.value.name === null ||
    localServerInfo.value.ip === null ||
    localServerInfo.value.port === null;

  const nameNotValid: boolean = serverStore.serverBanNameList.includes(
    localServerInfo.value.name
  );

  const portOutOfRange = () => {
    const port = localServerInfo.value.port;
    return port <= 0 || port > 65535;
  };

  const ipIsNotIPv4 = () => {
    const regExpOfIPv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    return !regExpOfIPv4.test(localServerInfo.value.ip);
  };

  return isNull || nameNotValid || portOutOfRange() || ipIsNotIPv4();
});

const rules: FormRules = {
  name: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) return new Error("Name is required");
        else if (serverStore.serverBanNameList.includes(value)) {
          return new Error("Name can't be ' " + value + " '");
        }
      },
      trigger: ["input", "blur"],
    },
  ],

  port: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) return new Error("Port is required");
        else if (Number(value) <= 0 || Number(value) > 65535) {
          return new Error("Port should be within 1 ~ 65535");
        }
      },
      trigger: ["input", "blur"],
    },
  ],

  ip: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const regExpOfIPv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
        if (!value) return new Error("IP is required");
        else if (!regExpOfIPv4.test(value)) {
          return new Error("use IPv4 form");
        }
      },
      trigger: ["input", "blur"],
    },
  ],
};

// style region
const bodyStyle = { width: "600px" };
const segmented = { content: "soft", footer: "soft" };
</script>

<style lang="scss" scoped></style>
