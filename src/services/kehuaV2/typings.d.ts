declare namespace API {
  type Comment = {
    msgType?: number;
    id?: string;
    timestamp?: number;
    content?: {
      activitiesId?: number;
      msgId?: string;
      commentContent?: string;
      commentUser?: string;
      fromUserId?: string;
      commentTag?: string;
      commentType?: string;
      createTime?: number;
      messageState?: string;
      reviewState?: string;
      stickerHeight?: number;
      stickerWidth?: number;
      audioDuration?: number;
      recall?: number;
    };
  };

  type CommentListResp = {
    data?: Comment[];
    readTimes?: {
      b5f98e29519923166a0fdbd31a2b8066?: number;
      systemReadTime?: number;
      friendReadTime?: number;
    };
  };

  type getImMessageCommentTimelineParams = {
    /** timeStamp */
    timeStamp: number;
  };
}
