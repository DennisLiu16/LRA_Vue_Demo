<template>
  <div>
    <n-button strong secondary circle type="info" @click="showModal = true">
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
      title="修改伺服器"
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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
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
import { AppsList20Filled } from "@vicons/fluent";

import type { IServerInfo } from "@/interface/server.interface";
import { useServerStore } from "@/stores/useServerStore";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(["formModified"]);

const formRef = ref<FormInst | null>(null);

const showModal = ref(false);
const serverStore = useServerStore();

const localServerInfo = ref(serverStore.getServerInfo(props.uuid));

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

const CancelCallBack = () => {
  showModal.value = false;
};

// style region
const bodyStyle = { width: "600px" };
const segmented = { content: "soft", footer: "soft" };
</script>
<style scoped></style>
