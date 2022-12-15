import {  useModel, useParams } from '@umijs/max';
import { List } from 'antd';
import React from 'react';
import styles from './index.less';

const Login: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { commentsMap} = initialState ?? {}
  const params = useParams();
  console.log(params)
  const comments = commentsMap?.get(params.comment_tag ?? "") ?? []
  return (
    <div className={styles.container}>
            <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={comments}
      renderItem={(item) => (
        <List.Item>
          <p>{item.commentContent ?? "未知内容"}</p>
        </List.Item>
      )}
    />
    </div>
  );
};

export default Login;
