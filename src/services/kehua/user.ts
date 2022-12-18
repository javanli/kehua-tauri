// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 当前用户数据 GET /account/data */
export async function getAccountData(options?: { [key: string]: any }) {
  return request<API.MyInfo>(`https://www.tideswing.fun/v1/api/account/data`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 好友列表 GET /friends/list */
export async function getFriendsList(options?: { [key: string]: any }) {
  return request<API.FriendsRsp>(`https://www.tideswing.fun/v1/api/friends/list`, {
    method: 'GET',
    ...(options || {}),
  });
}
