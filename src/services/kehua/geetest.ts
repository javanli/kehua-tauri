// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 极验证注册 GET /geetest/register */
export async function getGeetestRegister(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGeetestRegisterParams,
  options?: { [key: string]: any },
) {
  return request<API.GeeTestRegisterResult>(`https://www.tideswing.fun/v1/api/geetest/register`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
