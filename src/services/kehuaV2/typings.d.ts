declare namespace API {
  type Activity = {
    activitiesId?: number;
    activitiesState?: string;
    createTime?: string;
    activitiesText?: string;
    activitiesImages?: any[];
    activitiesUser?: string;
    activitiesType?: string;
    video?: {
      cdn?: string;
      path?: string;
      token?: string;
      imagePath?: string;
      imageCdn?: string;
      duration?: number;
      width?: number;
      height?: number;
      videoUserId?: string;
    };
    activitiesImageInfo?: any[];
  };

  type BriefUser = {
    userId?: string;
    avatarName?: string;
    nickname?: string;
  };

  type Comment = {
    msgType?: number;
    id?: string;
    timestamp?: number;
    content?: CommentContent;
  };

  type CommentContent = {
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

  type CommentListResp = {
    data?: Comment[];
    readTimes?: {
      b5f98e29519923166a0fdbd31a2b8066?: number;
      systemReadTime?: number;
      friendReadTime?: number;
    };
  };

  type Conversation = {
    commentTag?: string;
    updateTime?: number;
    activitiesId?: number;
    peerUserId?: string;
    lightNumber?: number;
    readTime?: number;
  };

  type ConversationsResp = {
    conversations?: Conversation[];
    activities?: Activity[];
    users?: BriefUser[];
    comments?: Record<string, any>;
  };

  type getImMessageCommentTimelineParams = {
    /** timeStamp */
    timeStamp: number;
  };
}
