<template>
  <n-card>
    <div>
      <div>
        <!-- TODO: removeServer 改成 local， 跳出警告視窗 -->
        <n-button
          class="btn-region"
          strong
          secondary
          circle
          type="error"
          :disabled="isMainServer"
          @click="removeServerCard"
        >
          <Icon :size="20"> <DeleteForeverRound /> </Icon
        ></n-button>
      </div>
      <div class="btn-region">
        <ServerModifyForm
          :uuid="props.uuid"
          @form-modified="modifyServerCallBack"
        />
      </div>
    </div>

    <n-space vertical>
      <p>
        <label for="uuid"> UUID: </label>
        {{ props.uuid }}
      </p>

      <p>
        <label for="name"> Name: </label>
        {{ getServerInfo.name }}
      </p>

      <p>
        <label for="ip"> IP: </label>
        {{ getServerInfo.ip }}
      </p>

      <p>
        <label for="port"> Port: </label>
        {{ getServerInfo.port }}
      </p>

      <!-- TODO: change to led form -->
      <div>
        <label for="alive"> Alive: </label>

        <Icon
          v-if="loadingState !== 'loading'"
          :size="23"
          :color="aliveLightColor"
          class="alive-icon"
        >
          <Circle24Filled />
        </Icon>
        <n-spin size="small" class="alive-spin" v-else></n-spin>
      </div>
    </n-space>
    <div>
      <n-button
        class="btn-region"
        strong
        secondary
        round
        type="info"
        :loading="loadingState === 'loading'"
        :disabled="loadingState !== 'disconnect'"
        @click="asyncConnect()"
      >
        Reconnect</n-button
      >
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NButton, NCard, NSpace, NSpin } from "naive-ui";
import { useServerStore } from "@/stores/useServerStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";

import ServerModifyForm from "@/components/form/ServerModifyForm.vue";

import type { IServerInfo } from "@/interface/server.interface";
import {
  WsInstance,
  type wsOpt,
  type wsInfo,
} from "@/interface/myWebSocket.interface";
import { makeWsRequest, makeWsUrl, type WsLraServerMsgRequireType, type WsLraServerMsgResponseType } from "@/composables/wsUtil";

// icon
import { Icon } from "@vicons/utils";
import { DeleteForeverRound } from "@vicons/material";
import { AppsList20Filled, Circle24Filled } from "@vicons/fluent";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});

const serverStore = useServerStore();
const wsStore = useWebSocketStore();

const isMainServer = computed(() => {
  return serverStore.getServerInfo(props.uuid).name === "MainServer";
});

const getServerInfo = computed(() => {
  // use index instead getInfo
  // will throw error if not found
  // const idx = serverStore.getServerIndex(props.uuid);
  // return serverStore.serverList.servers[idx];

  // test ok
  return serverStore.getServerInfo(props.uuid);
});

const loadingState = ref<"loading" | "disconnect" | "connected">(
  getServerInfo.value.loadingState
);

const removeServerCard = () => {
  serverStore.removeServer(props.uuid);
  wsStore.removeServerWs(props.uuid);
};

const modifyServerCallBack = (serverinfo: IServerInfo) => {
  // Add to serverList
  const origin = getServerInfo.value;
  if (serverinfo.ip !== origin.ip || serverinfo.port !== origin.port) {
    serverinfo.alive = false;
    serverinfo.loadingState = "disconnect";
    loadingState.value = "disconnect";

    // update WsInstance information
    let ws = wsStore.getServerWs(props.uuid);
    ws?.closeWs();
    ws?.updateUrl(makeWsUrl(wsProtocol, serverinfo.ip, serverinfo.port));

    // reconnect
    asyncConnect();
  }

  serverStore.updateServerInfo(props.uuid, serverinfo);

  // FIXME: 如何通知建立連線的 Module 們?

  // TODO: hit api to check alive, modify data in serverList, not local var
  // if success -> modify localserver to target server
  // if fail -> remove from list, ansyc function
};

// 

const aliveLightColor = computed(() => {
  if (loadingState.value === "connected") return "green";
  else if (loadingState.value === "disconnect") return "red";
});

// ws related

const wsProtocol: "ws" | "wss" = "ws";
const wsMode: "broadcast" | "direct" = "broadcast";

const wsOnOpenCallback = () => {
  console.log(
    `${getServerInfo.value.name} creates a new websocket to: ${
      tryToGetWsInstance(props.uuid)?.info.url
    } successfully`
  );
  serverStore.switchServerAlive(props.uuid, true);
  loadingState.value = "connected";
  serverStore.updateServerLoadingState(props.uuid, loadingState.value);

  // require server info
  const msg = {
    type: "serverInfoRequire",
    uuid: props.uuid,
  }

  tryToGetWsInstance(props.uuid)?.send(msg)

  // TODO: send server's info to module, module will create a websocket client to the server
  // if(ws.mode === "direct") ...
  // TODO: send a request to get registers' value
};

const wsOnCloseCallback = (ev: CloseEvent) => {
  const msg = `Module: '${getServerInfo.value.name}' cancel websocket to: ${
    tryToGetWsInstance(props.uuid)?.info.url
  } owing to: `;

  if (ev.code === 1000) console.log(msg); // normal close
  else console.warn(msg, ev);

  // state modify
  loadingState.value = "disconnect";
  serverStore.updateServerLoadingState(props.uuid, loadingState.value);
};

const wsOnMsgCallback = (ev: MessageEvent) => {
  // TODO: disable
  // console.log(`${getServerInfo.value.name} ws get msg: \n`, ev.data);
  wsMsgParser(ev.data);
};

const wsOnErrorCallback = (ev: Event) => {
  console.error(`${getServerInfo.value.name} ws get error: \n`, ev);
};

/**wsMsgParser */
const wsMsgParser = (raw_data: any) => {
  // parse
  const data = JSON.parse(raw_data);
  if (data?.type == "serverInfoRequireResponse") {
    console.log("Server info transfer completed", data);

    /** send drvCmdKeepRequire */
    let msg = makeWsRequest("drvCmdKeepRequire");
    Object.assign(msg,{uuid: props.uuid});
    
    tryToGetWsInstance(props.uuid)?.send(msg);

    return;
  } else if (data?.type == "drvCmdKeepRequireResponse") {
    console.log("new data"); // XXX:log usage
  } else if(data?.type == "drvCmdStopRequireResponse") {
    console.log("server stop update cmd");
    
  }
};

async function asyncConnect() {
  loadingState.value = "loading";
  serverStore.updateServerLoadingState(props.uuid, loadingState.value);
  let ws = tryToGetWsInstance(props.uuid);
  console.log(ws);
  try {
    const wsConnectState = await ws?.connectWs();
    if (wsConnectState === WsInstance.OPEN) {
      console.log(`server: ${getServerInfo.value.name} succesfully connected`);
    }
  } catch (err) {
    // do something in call back already
    loadingState.value = "disconnect";
    serverStore.switchServerAlive(props.uuid, false);
    serverStore.updateServerLoadingState(props.uuid, loadingState.value);
  }
}

const tryToGetWsInstance = (uuid: string) => {
  return wsStore.getServerWs(uuid);
};

const verifyWsInstance = (uuid: string) => {
  const tmpWs = tryToGetWsInstance(uuid);
  if (tmpWs === null) {
    return createWsInstance();
  } else if (!(tmpWs instanceof WsInstance)) {
    wsStore.removeServerWs(uuid);
    return createWsInstance();
  } // else { do nothing }
  return tmpWs;
};

function createWsInstance() {
  const _opt: wsOpt = {
    onOpenCallback: wsOnOpenCallback,
    onCloseCallback: wsOnCloseCallback,
    onMsgCallback: wsOnMsgCallback,
    onErrorCallback: wsOnErrorCallback,
  };

  const _info: wsInfo = {
    url: makeWsUrl(
      wsProtocol,
      getServerInfo.value.ip,
      getServerInfo.value.port
    ),
    mid: props.uuid,
    opt: _opt,
  };

  return wsStore.addServerWs(_wsCreate(_info, wsMode, "server"));
}

/**  should not use directly */
function _wsCreate(
  info: wsInfo,
  mode: "broadcast" | "direct",
  target: "server" | "module"
): WsInstance {
  return new WsInstance(info, mode, target);
}

// callbacks

onMounted(() => {
  // get ws if serverWs exists, or create a new connection
  const ws = verifyWsInstance(props.uuid);
  if (ws?.getWsReadyState() === null) {
    asyncConnect();
  }
});
</script>

<style scoped>
.btn-region {
  float: right;
  margin: 4px;
}

.mid-aligner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alive-icon {
  display: inline-block;
  vertical-align: middle;
  margin-top: -10px;
  margin-left: 5px;
}

.alive-spin {
  display: inline-block;
  vertical-align: middle;
  margin-top: 5px;
  margin-left: 5px;
}
</style>
