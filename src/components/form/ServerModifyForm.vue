<template>
  <div>
    <n-button
      strong
      secondary
      circle
      type="info"
      :disabled="props.disabled"
      @click="showModal = true"
    >
      <Icon :size="20">
        <AppsList20Filled />
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
      :on-after-leave="LeaveCallBack"
      title="Modify Server's Information"
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
          :disabled="disableConfirmButton"
          type="primary"
          @click="ValidateCallBack"
          style="float: right"
          class="btn-region"
        >
          Confirm
        </n-button>
        <n-button
          strong
          secondary
          round
          type="error"
          @click="LeaveCallBack"
          style="float: right"
          class="btn-region"
        >
          Cancel
        </n-button>
      </template>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
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
import { AppsList20Filled } from "@vicons/fluent";

import type { IServerInfo } from "@/interface/server.interface";
import { useServerStore } from "@/stores/useServerStore";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
});
const emits = defineEmits(["formModified"]);

const formRef = ref<FormInst | null>(null);

const showModal = ref(false);
const serverStore = useServerStore();

const localServerInfo = ref(serverStore.getServerInfo(props.uuid));

// TODO: 放進統一檔案內
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

const ValidateCallBack = () => {
  if (formRef.value?.validate === undefined) {
    // no validate rule
    emits("formModified", localServerInfo.value);
    showModal.value = false;
  } else {
    formRef.value?.validate((errors) => {
      if (!errors) {
        // send local info back to father
        emits("formModified", localServerInfo.value);
        showModal.value = false;
      } else {
        console.log("failed");
      }
    });
  }
};

const LeaveCallBack = () => {
  showModal.value = false;

  // resume info
  const data = serverStore.getServerInfo(props.uuid);
  localServerInfo.value.name = data.name;
  localServerInfo.value.ip = data.ip;
  localServerInfo.value.port = data.port;
};

// style region
const bodyStyle = { width: "600px" };
const segmented = { content: "soft", footer: "soft" };
</script>
<style scoped>
.btn-region {
  float: right;
  margin: 5px;
}
</style>
