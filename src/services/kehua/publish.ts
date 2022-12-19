// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 上传鉴权 GET /upload/auth */
export async function getUploadAuth(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUploadAuthParams,
  options?: { [key: string]: any },
) {
  return request<{ signature?: string }>(`https://www.tideswing.fun/v1/api/upload/auth`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
