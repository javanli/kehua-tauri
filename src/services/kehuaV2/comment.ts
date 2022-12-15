// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 评论数据 GET /im/message/comment/conversations */
export async function getConversations(options?: { [key: string]: any }) {
  return request<API.ConversationsResp>(
    `https://www.tideswing.fun/v2/api/im/message/comment/conversations`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 评论数据 GET /im/message/comment/timeline */
export async function getTimeline(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTimelineParams,
  options?: { [key: string]: any },
) {
  return request<API.CommentListResp>(
    `https://www.tideswing.fun/v2/api/im/message/comment/timeline`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
