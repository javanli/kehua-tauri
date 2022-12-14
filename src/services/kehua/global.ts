// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取应用全局配置 GET /app-config */
export async function getAppConfig(options?: { [key: string]: any }) {
  return request<API.ConfigResponse>(`https://www.tideswing.fun/v1/api/app-config`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取APP最新版本信息 GET /maker/app/version/latest */
export async function getMakerAppVersionLatest(options?: { [key: string]: any }) {
  return request<API.AppVersionResponse>(
    `https://www.tideswing.fun/v1/api/maker/app/version/latest`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
