import { useCallback, useEffect, useState } from 'react';
import WebSocket from '@/libs/websocket';
import { useModel } from '@umijs/max';
import { getCommonAdditionHeaders, logFactory } from '@/utils';

export enum TSMsgType {
  EnterConversationReq = 106,
  EnterConversationRsp = 104,

  SendMsgReq = 105,
  SendMsgRsp = 26,
}
const allValidMsgTypes = Object.values(TSMsgType).filter((item) => !Number.isNaN(Number(item)));

const log = logFactory('TSSocket');
interface TSSocketMsgBaseModel {
  msgType?: number;
  id?: string;
  timestamp?: number;
  content: any;
}
interface TSSocketMsgSendModel extends TSSocketMsgBaseModel {
  sendCount?: number;
  taskName?: string;
  commentTag?: string;
}
interface TSSocketMsgReceiveModel extends TSSocketMsgBaseModel {
  status: number;
}
interface TSSocketListener {
  (msg: TSSocketMsgReceiveModel): void;
}

export default () => {
  const { initialState } = useModel('@@initialState');
  const [TSSocket, setTSSocket] = useState<WebSocket | undefined>(undefined);
  const [listeners] = useState<Map<string, TSSocketListener>>(new Map());
  const addListener = useCallback(
    (bussinessID: string, listener: TSSocketListener) => {
      listeners.set(bussinessID, listener);
    },
    [listeners],
  );
  const [sendMsgCallbacks] = useState<Map<string, TSSocketListener>>(new Map());

  const sendMessage = useCallback(
    (msg: TSSocketMsgSendModel) => {
      const uuid = crypto.randomUUID();
      msg.id = uuid;
      msg.timestamp = new Date().getTime();

      log(`send msg: ${JSON.stringify(msg)}`);
      TSSocket?.send(JSON.stringify(msg));
      return new Promise<TSSocketMsgReceiveModel>((resolve) => {
        sendMsgCallbacks.set(uuid, (receiveMsg: TSSocketMsgReceiveModel) => {
          resolve(receiveMsg);
        });
      });
    },
    [TSSocket, sendMsgCallbacks],
  );
  useEffect(() => {
    const initWS = async () => {
      log('register WS Socket');
      const ws = await WebSocket.connect(
        'wss://im2.tideswing.fun/v1/websocket',
        {},
        getCommonAdditionHeaders(),
      );
      ws.addListener((msg) => {
        log(`Received Message: ${JSON.stringify(msg)}`);
        switch (msg.type) {
          case 'Close':
            {
              log('WS closed');
              setTSSocket(undefined);
            }
            break;
          case 'Text':
            {
              const receiveMsg: TSSocketMsgReceiveModel = JSON.parse(msg.data) ?? {};
              const msgID = receiveMsg.id ?? '';
              const callback: TSSocketListener | undefined = sendMsgCallbacks.get(msgID);
              if (callback !== undefined) {
                callback(receiveMsg);
                sendMsgCallbacks.delete(msgID);
              }
              for (const listener of listeners.values()) {
                listener(receiveMsg);
              }
              if (
                receiveMsg.msgType !== undefined &&
                allValidMsgTypes.indexOf(receiveMsg.msgType) === -1
              ) {
                console.error(`unknown message!`);
              }
            }
            break;
          default:
            console.error(`unknown message`);
            break;
        }
      });
      setTSSocket(ws);
    };
    if (initialState?.currentUser !== undefined) {
      if (TSSocket === undefined) {
        initWS();
      }
    } else {
      TSSocket?.disconnect();
      setTSSocket(undefined);
    }
  }, [TSSocket, initialState?.currentUser, listeners, sendMsgCallbacks]);

  return {
    sendMessage,
    addListener,
  };
};
