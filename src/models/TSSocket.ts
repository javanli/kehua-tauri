import { useCallback, useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import WebSocket from '@/libs/websocket'

export enum TSMsgType {
    EnterConversationReq = 106,
    EnterConversationRsp = 104
}

interface TSSocketMsgBaseModel {
    msgType?: number,
    id?: string,
    timestamp?: number,
    content: any
}
interface TSSocketMsgSendModel extends TSSocketMsgBaseModel {
    sendCount?: number
}
interface TSSocketMsgReceiveModel extends TSSocketMsgBaseModel {
    status: number,
}
interface TSSocketListener {
    (msg: TSSocketMsgReceiveModel): void;
}

export default () => {
    // const { initialState } = useModel('@@initialState');
    const [TSSocket, setTSSocket] = useState<WebSocket>()
    const [listeners] = useState<Map<string,TSSocketListener>>(new Map())
    const addListener = useCallback((bussinessID: string, listener: TSSocketListener) => {
        listeners.set(bussinessID,listener)
    },[listeners])
    const [sendMsgCallbacks] = useState<Map<string,TSSocketListener>>(new Map())

    const sendMessage = useCallback((msg: TSSocketMsgSendModel) => {
        const uuid = uniqueId()
        msg.id = uuid
        TSSocket?.send(JSON.stringify(msg))
        return new Promise<TSSocketMsgReceiveModel>((resolve) => {
            sendMsgCallbacks.set(uuid,(receiveMsg: TSSocketMsgReceiveModel) => {
                resolve(receiveMsg)
            })
        })
    },[TSSocket, sendMsgCallbacks])
    useEffect(() => {
        console.log('register WS Socket')
        const initWS = async () => {
            const ws = await WebSocket.connect("wss://im2.tideswing.fun/v1/websocket")
            ws.addListener((msg)=>{
                console.log("Received Message: " + msg);
                // const receiveMsg: TSSocketMsgReceiveModel = JSON.parse(evt.data) ?? {}
                // const msgID = receiveMsg.id ?? "";
                // const callback: TSSocketListener|undefined = sendMsgCallbacks.get(msgID)
                // if (callback !== undefined) {
                //     callback(receiveMsg)
                //     sendMsgCallbacks.delete(msgID)
                // }
                // for (const listener of listeners.values()) {
                //     listener(receiveMsg)
                // }
            })
            setTSSocket(ws)
        }
        initWS()
    }, [listeners, sendMsgCallbacks])

    return {
        sendMessage,
        addListener
    };
};
