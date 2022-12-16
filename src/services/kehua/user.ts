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
