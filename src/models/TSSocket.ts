import { useCallback, useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import WebSocket from '@/libs/websocket';
import { useModel } from '@umijs/max';
import { getCommonAdditionHeaders } from '@/utils';

export enum TSMsgType {
  EnterConversationReq = 106,
  EnterConversationRsp = 104,
}

interface TSSocketMsgBaseModel {
  msgType?: number;
  id?: string;
  timestamp?: number;
  content: any;
}
interface TSSocketMsgSendModel extends TSSocketMsgBaseModel {
  sendCount?: number;
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
      const uuid = uniqueId();
      msg.id = uuid;
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
      console.log('register WS Socket');
      const ws = await WebSocket.connect(
        'wss://im2.tideswing.fun/v1/websocket',
        {},
        getCommonAdditionHeaders(),
      );
      ws.addListener((msg) => {
        console.log('Received Message: ' + msg);
        switch (msg.type) {
          case 'Close':
            {
              console.log('WS closed');
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
            }
            break;
          default:
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
