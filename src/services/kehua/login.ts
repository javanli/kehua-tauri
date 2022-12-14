// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /account/login */
export async function postAccountLogin(body: API.LoginRequest, options?: { [key: string]: any }) {
  return request<API.LoginResult>(`https://www.tideswing.fun/v1/api/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 GET /account/sms */
export async function getAccountSms(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAccountSmsParams,
  options?: { [key: string]: any },
) {
  return request<string>(`https://www.tideswing.fun/v1/api/account/sms`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
