import { TSMsgType } from '@/models/TSSocket';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Button, Input, List } from 'antd';
import React, { useEffect, useState } from 'react';

const Login: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const [inputText,setInputText] = useState<string>("")
    const { commentsMap } = initialState ?? {}
    const params = useParams();
    console.log(params)
    const commentTag = params.comment_tag ?? ""
    const comments = commentsMap?.get(commentTag) ?? []
    const {sendMessage} = useModel("TSSocket")
    useEffect(()=>{
        sendMessage({
            msgType: TSMsgType.EnterConversationReq,
            content: {
                commentTag,
                timestamp: new Date().getMilliseconds()
            }
        })
    })
    return (
        <PageContainer>
            <List
                bordered
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item>
                        <p>{item.commentContent ?? "未知内容"}</p>
                    </List.Item>
                )}
            />
            <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} value={inputText ?? ""} onChange={(e) => {setInputText(e.target.value)}} />
                <Button style={{ width: "200px" }} type="primary" onClick={()=>{

                }}>发送</Button>
            </Input.Group>
        </PageContainer>
    );
};

export default Login;
