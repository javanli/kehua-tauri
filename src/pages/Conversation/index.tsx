import { TSMsgType } from '@/models/TSSocket';
import { logFactory } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Button, Input, List } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import Comment, { TSCommentType } from '@/components/Comment';
import { Image } from 'antd';

const log = logFactory("Conversation")
const Conversation: React.FC = () => {
    const params = useParams();
    const commentTag = params.comment_tag ?? ""
    const { initialState } = useModel('@@initialState')
    const { comments, conversation, activity, appConfig, peerUser } = useMemo(() => {
        const { commentsMap, conversations, activities, userMap } = initialState ?? {};
        const _comments = commentsMap?.get(commentTag) ?? [];
        const _conversation = conversations?.find((item) => item.commentTag === commentTag);
        const _activity: API.Activity | undefined = activities?.find((item): boolean => item.activitiesId === _conversation?.activitiesId)
        const _peerUser = userMap?.get(_conversation?.peerUserId ?? "")
        return {
            comments: _comments,
            conversation: _conversation,
            activity: _activity,
            peerUser: _peerUser,
            appConfig: initialState?.appConfig
        }
    }, [commentTag, initialState])
    const [inputText, setInputText] = useState<string>("")

    const { sendMessage } = useModel("TSSocket")
    useEffect(() => {
        log(`param:${JSON.stringify(params)}`)
        sendMessage({
            msgType: TSMsgType.EnterConversationReq,
            content: {
                commentTag,
                timestamp: new Date().getTime()
            }
        })
    }, [commentTag, params, sendMessage])
    return (
        <PageContainer>
            {
                activity !== undefined ?
                    <div>
                        {activity.activitiesText?.split('\n').map((str) => {
                            return <p key={str}>{str}</p>
                        })}
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {activity.activitiesImages?.map((imagePath) => {
                                <Image
                                    width={200}
                                    height={200}
                                    src={`${appConfig?.uCloudPublicStoreUrl ?? "https://private-image.tideswing.fun"}${imagePath}`}
                                />
                            })}
                        </div>
                    </div> : null
            }
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
            }}>
                {
                    (comments.length === 0 || comments[0].commentType !== TSCommentType.light) ? <p >查看更多</p> : null
                }
            </div>
            <List
                bordered
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item>
                        <Comment comment={item} peerUser={peerUser ?? {}} />
                    </List.Item>
                )}
            />
            <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} value={inputText ?? ""} onChange={(e) => { setInputText(e.target.value) }} />
                <Button style={{ width: "200px" }} type="primary" onClick={() => {
                    if (inputText.length === 0) {
                        return
                    }
                    sendMessage({
                        commentTag,
                        taskName: "TSWebSocketTaskNameSendMessage",
                        msgType: TSMsgType.SendMsgReq,
                        content: {
                            activitiesId: conversation?.activitiesId,
                            commentType: "1",
                            commentContent: inputText,
                            source: "my_chat_post_page",
                            toUserId: conversation?.peerUserId,
                            timestamp: new Date().getTime()
                        }
                    })
                    setInputText("")
                }}>发送</Button>
            </Input.Group>
        </PageContainer>
    );
};

export default Conversation;
