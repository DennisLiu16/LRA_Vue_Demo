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
          :loading="btnEnableLoading"
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
import {
  ref,
  reactive,
  computed,
  onUnmounted,
  onMounted,
  onBeforeUnmount,
  type Ref,
} from "vue";
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

import { useModuleStore } from "@/stores/useModuleStore";
import { useServerStore } from "@/stores/useServerStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";

import ServerForm from "@/components/form/ServerForm.vue";
import ModuleNavPanel from "@/components/panels/ModuleNavPanel.vue";
import type { IServerInfo } from "@/interface/server.interface";
import {
  WsInstance,
  type wsInfo,
  type wsOpt,
} from "@/interface/myWebSocket.interface";

import { makeWsUrl } from "@/composables/wsUtil";

const props = defineProps({
  mid: {
    // module id
    type: String,
    required: true,
  },
});

// Note that WsInstance is not WebSocket, it's a wrapper for WebSocket

const moduleStore = useModuleStore();
const serverStore = useServerStore();
const wsStore = useWebSocketStore();

const localModuleInfo = reactive<IModuleInfo>(
  moduleStore.getModuleInfo(props.mid)
);

// ref to localInfo, bug: won't update when serverinfo update by user
// const serverName = computed(() => {
//   return serverStore.getServerName(localModuleInfo.server);
// });

const btnModifyState = ref(false);
const btnEnableState = ref(moduleStore.getModuleEnableState(props.mid));
const btnAddNewServer = ref(false);
const btnEnableLoading = ref(false);

// module websocket related
// 透過在 local 創建 ws 可以拿到 module card 的資訊，同時在 local 創建 callback 可保有一致性且能拿到 ws 實例的 public 參數

const wsProtocol: "ws" | "wss" = "ws";

const wsOnOpenCallback = () => {
  console.log(
    `${localModuleInfo.name} creates a new websocket to: ${
      tryToGetWsInstance(props.mid)?.info.url
    } successfully`
  );

  // TODO: send server's info to module, module will create a websocket client to the server
  // if(ws.mode === "direct") ...
  // TODO: send a request to get registers' value
};

const wsOnCloseCallback = (ev: CloseEvent) => {
  console.log(
    `Module: ${localModuleInfo.name} cancel websocket to: ${
      tryToGetWsInstance(props.mid)?.info.url
    } owing to: ${ev}`
  );
};

const wsOnMsgCallback = (ev: MessageEvent) => {
  // TODO: disable
  console.log(`${localModuleInfo.name} get msg: \n ${ev.data}`);
};

const wsOnErrorCallback = (ev: Event) => {
  console.error(`${localModuleInfo.name} get error: \n ${ev}`);
};

// module websocket related

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const modifyBooleanState = (refbool: Ref<boolean>) => {
  refbool.value = !refbool.value;
};

// callbacks //

const removeModuleCallback = () => {
  moduleStore.removeModule(props.mid);
  wsStore.removeModuleWs(props.mid);
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
  const info = moduleStore.getModuleInfo(props.mid);

  let needReconnect = isCriticalModify(info, localModuleInfo);

  if (needReconnect) {
    console.log(
      `module changes info`,
      `Origin: ${info}`,
      `New: ${localModuleInfo}`
    );

    let wsIns = tryToGetWsInstance(props.mid);
    if (wsIns !== null) {
      // 本來就是連接的，先關
      if (btnEnableState.value === true) {
        // TODO: make a function on modify to handle all modify case?
        {
          wsIns.closeWs();
          // update url
          wsIns.info.url = makeWsUrl(
            wsProtocol,
            localModuleInfo.ip,
            localModuleInfo.port
          );
          // TODO: server critical change: do ??

          // TODO: async reconnect and loading
          asyncConnect();
        }
      } else {
        wsIns.info.url = makeWsUrl(
          wsProtocol,
          localModuleInfo.ip,
          localModuleInfo.port
        );
      }
    }
  }

  moduleStore.updateModule(props.mid, localModuleInfo);
  modifyBooleanState(btnModifyState);
};

async function asyncConnect() {
  // TODO: add loading state
  modifyBooleanState(btnEnableState);
  btnEnableLoading.value = true;
  let ws = tryToGetWsInstance(props.mid);
  try {
    const wsConnectState = await ws?.connectWs();
    console.log(wsConnectState);
    if (wsConnectState === WsInstance.OPEN) {
      modifyBooleanState(btnEnableState);
    }
  } catch (err) {
    // do something in call back already
  } finally {
    btnEnableLoading.value = false;
  }
}

const enableCallBack = () => {
  modifyBooleanState(btnEnableState); // decided by asyncConnect now

  // close or reconnect the websocket async and loading mark on btn
  // TODO: async close with asyncClose();
  if (btnEnableState.value === false) tryToGetWsInstance(props.mid)?.closeWs();
  else {
    asyncConnect();
  }
};

// if server is alive -> enable to connect, start 按鈕會不會亮的檢查程式
const enableCheck = () => {
  const serveruuid = moduleStore.getModuleInfo(props.mid).server;
  // if not default value: "None"
  if (serveruuid !== "None")
    // BUG: 等下記得開起來
    return true;
    // return serverStore.getServerInfo(serveruuid).alive === true;
  return false;
};

const addNewServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  serverStore.serverList.servers.push(serverinfo);

  // TODO: create a new websocket instance here if info valid (ws_tmp)

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};

const tryToGetWsInstance = (mid: string) => {
  return wsStore.getModuleWs(mid);
};

/** Verify or generate valid WsInstance and get the instance back.
 Make sure tryToGetWsInstance() always valid after onMounted*/
const verifyWsInstance = (mid: string) => {
  const tmpWs = tryToGetWsInstance(mid);
  if (tmpWs === null) {
    return createWsInstance();
  } else if (!(tmpWs instanceof WsInstance)) {
    wsStore.removeModuleWs(mid);
    return createWsInstance();
  } // else { do nothing }
  return tmpWs;
};

/** critical modify for websocket */
const isCriticalModify = (
  storeInfo: IModuleInfo,
  localInfo: IModuleInfo
): boolean => {
  const directServerChanged: boolean =
    storeInfo.server !== localInfo.server &&
    tryToGetWsInstance(props.mid)?.mode === "direct";
  const ipChanged: boolean = storeInfo.ip !== localInfo.ip;
  const portChanged: boolean = storeInfo.port !== localInfo.port;
  // TODO: Callbacks Change
  return directServerChanged || ipChanged || portChanged;
};

////////////////////////////////////////
function createWsInstance() {
  const _opt: wsOpt = {
    onOpenCallback: wsOnOpenCallback,
    onCloseCallback: wsOnCloseCallback,
    onMsgCallback: wsOnMsgCallback,
    onErrorCallback: wsOnErrorCallback,
  };

  const _info: wsInfo = {
    url: makeWsUrl(wsProtocol, localModuleInfo.ip, localModuleInfo.port),
    mid: props.mid,
    opt: _opt,
  };

  return wsStore.addModuleWs(_wsCreate(_info, "broadcast", "module"));
}

/**  should not use directly */
function _wsCreate(
  info: wsInfo,
  mode: "broadcast" | "direct",
  target: "server" | "module"
): WsInstance {
  return new WsInstance(info, mode, target);
}

onMounted(() => {
  const ws = verifyWsInstance(props.mid);
  if (btnEnableState.value === true && ws?.getWsReadyState() === null) {
    // TODO: WebSocket is null then reconnect async and loading
    ws?.reconnectWs();
  }
});

onBeforeUnmount(() => {
  // update enablestate to store
  moduleStore.updateModuleEnableState(props.mid, btnEnableState.value);
});

onUnmounted(() => {});
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
