// import { useEffect } from 'react';
// import * as IM from '@rongcloud/imlib-next';
// import { RongAPPKey } from '@/utils';
// import { useModel } from '@umijs/max';
// import { getFriendsToken } from '@/services/kehua/im';

export default () => {
  // const { initialState } = useModel('@@initialState');
  // useEffect(() => {
  //   console.log('RongIM register');
  //   IM.init({ appkey: RongAPPKey });
  //   // 添加事件监听
  //   const Events = IM.Events;

  //   IM.addEventListener(Events.CONNECTING, () => {
  //     console.log('RongIM 正在链接服务器');
  //   });

  //   IM.addEventListener(Events.CONNECTED, () => {
  //     console.log('RongIM 已经链接到服务器');
  //   });

  //   IM.addEventListener(Events.MESSAGES, (evt) => {
  //     console.log('RongIM ', evt.messages);
  //   });
  // }, []);
  // useEffect(() => {
  //   const handleConnect = async () => {
  //     const token = await getFriendsToken();
  //     const res = await IM.connect(token);
  //     if (res.code === IM.ErrorCode.SUCCESS) {
  //       console.log('RongIM 链接成功, 链接用户 id 为: ', res.data?.userId);
  //     } else {
  //       console.warn('RongIM 链接失败, code:', res.code);
  //     }
  //   };
  //   const handleDisConnect = () => {
  //     IM.disconnect();
  //   };
  //   const connectStatus = IM.getConnectionStatus();
  //   console.log(`RongIM current connect status = ${connectStatus}`);
  //   const isLogin = initialState?.currentUser !== undefined && initialState?.currentUser !== null;
  //   if (isLogin && connectStatus === IM.ConnectionStatus.DISCONNECTED) {
  //     handleConnect();
  //   } else if (
  //     !isLogin &&
  //     (connectStatus === IM.ConnectionStatus.CONNECTED ||
  //       connectStatus === IM.ConnectionStatus.DISCONNECTED)
  //   ) {
  //     handleDisConnect();
  //   }
  // });
  return {};
};
