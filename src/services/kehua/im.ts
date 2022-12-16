// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 聊天token GET /friends/token */
export async function getFriendsToken(options?: { [key: string]: any }) {
  return request<string>(`https://www.tideswing.fun/v1/api/friends/token`, {
    method: 'GET',
    ...(options || {}),
  });
}
