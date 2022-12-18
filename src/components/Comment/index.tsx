import { useModel } from '@umijs/max';
import { Image } from 'antd';

export enum TSCommentType {
    text = "1",
    image = "2",
    sticker = "3",
    light = "4",
    activity = "6",
}
function limitSize(size: number, min: number, max: number) {
    return Math.min(Math.max(size, min), max)
}
const Comment: React.FC<{ comment: API.CommentContent, peerUser: API.BriefUser }> = ({ comment,peerUser }) => {
    const { appConfig } = useModel('@@initialState', (ret) => ({
        appConfig: ret?.initialState?.appConfig
    }));
    let contentItem;
    const isSelf = comment.commentUser === "1"
    let justifyContent = isSelf ? "flex-end" : "flex-start"
    switch (comment.commentType) {
        case TSCommentType.text:
            contentItem = <p>{comment.commentContent ?? "未知内容"}</p>
            break;
        case TSCommentType.image:
            contentItem = <Image
                width={200}
                src={`${appConfig?.uCloudPrivateStoreUrl ?? "https://private-image.tideswing.fun"}${comment.commentContent}`}
            />
            break;
        case TSCommentType.sticker:
            contentItem = <Image
                width={limitSize(comment.stickerWidth ?? 0, 20, 200)}
                height={limitSize(comment.stickerHeight ?? 0, 20, 200)}
                src={`${appConfig?.uCloudPublicStoreUrl ?? "https://private-image.tideswing.fun"}${comment.commentContent}`}
            />
            break;
        case TSCommentType.light:
            contentItem = <p>{isSelf ? `你点亮了 ${peerUser.nickname ?? ""}` : `${peerUser.nickname ?? ""} 点亮了你`}</p>
            justifyContent = "center"
            break;
        case TSCommentType.activity: {
            justifyContent = "center"
            const activity: API.Activity = JSON.parse(comment.commentContent ?? "{}")
            contentItem = <div>
                <p>TA的这条动态共鸣到了你</p>
                <p>{activity.activitiesText}</p>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    {activity.activitiesImages?.map((imagePath) => {
                        <Image
                            width={200}
                            height={200}
                            src={`${appConfig?.uCloudPublicStoreUrl ?? "https://private-image.tideswing.fun"}${imagePath}`}
                        />
                    })}
                </div>
            </div>
            break;
        }
        default:
            contentItem = <p>{`未知类型：${comment.commentType} 内容：${comment.commentContent}`}</p>
            break;
    }
    return <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: justifyContent,
        flex: "1"
    }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: justifyContent,
            width: "60%"
        }}>
            {contentItem}
        </div>
    </div>
};

export default Comment;
