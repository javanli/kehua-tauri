// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发布动态 POST /activities */
export async function postActivities(body: API.Activity, options?: { [key: string]: any }) {
  return request<{ activitiesId?: number; activitiesState?: string }>(
    `https://www.tideswing.fun/v2/api/activities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
