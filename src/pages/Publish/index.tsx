import { PageContainer } from '@ant-design/pro-components';
import React, { Dispatch, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Row, Switch, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import TextArea from 'antd/lib/input/TextArea';
import { getUploadAuth } from '@/services/kehua/publish';
import { useModel } from '@umijs/max';
import { logFactory } from '@/utils';
import md5 from 'md5';
import type { UploadRequestOption } from 'rc-upload/es/interface';
import { Body, getClient } from '@tauri-apps/api/http';
import { postActivities } from '@/services/kehuaV2/activities';
// const md5 = (input: string) => input
const log = logFactory('Publish');

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const getArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });
const imageSize = (url: string): Promise<{ width: number; height: number }> => {
  const img = document.createElement('img');

  const promise = new Promise<{ width: number; height: number }>((resolve, reject) => {
    img.onload = () => {
      // Natural size is the actual image size regardless of rendering.
      // The 'normal' `width`/`height` are for the **rendered** size.
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Resolve promise with the width and height
      resolve({ width, height });
    };

    // Reject promise on error
    img.onerror = reject;
  });

  // Setting the source makes it start downloading and eventually call `onload`
  img.src = url;

  return promise;
};
const customAsyncUpload = async (option: UploadRequestOption) => {
  const { Authorization, FileName, contentMd5, contentType } = option.data as {
    Authorization: string;
    FileName: string;
    contentMd5: string;
    contentType: string;
  };
  try {
    const client = await getClient({
      maxRedirections: 0,
    });
    const binary = await getArrayBuffer(option.file as File);
    const body = Body.bytes(new Uint8Array(binary));
    const result = await client.put(
      `http://tideswing-storehouse.cn-bj.ufileos.com/images%2F${FileName}`,
      body,
      {
        headers: {
          Authorization,
          'Content-MD5': contentMd5,
          UserAgent: 'UFile iOS/3.0.5',
          'Content-Type': contentType,
        },
      },
    );
    if (option.onSuccess) {
      option.onSuccess(result);
    }
  } catch (error) {
    console.log(error);
    if (option.onError) {
      option.onError(error as Error);
    }
  }
};
const customUpload = (option: UploadRequestOption) => {
  customAsyncUpload(option);
};

interface UploadAreaProperties {
  fileList: UploadFile[];
  setFileList: Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}
const UploadArea: React.FC<UploadAreaProperties> = ({ fileList, setFileList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const initialState = useModel('@@initialState', (data) => {
    return {
      currentUser: data.initialState?.currentUser,
      appConfig: data.initialState?.appConfig,
    };
  });
  const { currentUser, appConfig } = initialState;

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept="image/png, image/jpeg"
        action="http://tideswing-storehouse.cn-bj.ufileos.com"
        customRequest={customUpload}
        data={async (file: UploadFile) => {
          const suffix = file.name.slice(file.name.lastIndexOf('.'));
          const originFileObj = new File([file as unknown as BlobPart], file.name, {
            type: file.type,
          });
          const binary = await getArrayBuffer(originFileObj);
          const md5Content = md5(new Uint8Array(binary));
          const fileName = crypto.randomUUID();
          const saveKey = `/images/${fileName}${suffix}`;
          file.url = `${appConfig?.uCloudPublicStoreUrl}${saveKey}`;
          const uid = currentUser?.userId ?? '';
          const authKey = md5(`${uid}${saveKey}`);
          log(
            `get upload auth with ${JSON.stringify({
              md5Content,
              uploadType: file.type ?? 'image/jpeg',
              saveKey,
              authKey,
            })}`,
          );
          const { signature } = await getUploadAuth({
            md5Content,
            uploadType: file.type ?? 'image/jpeg',
            saveKey,
            authKey,
          });
          // const FileName = `images/${md5Content}${suffix}`;

          return {
            Authorization: signature,
            FileName: `${fileName}${suffix}`,
            contentMd5: md5Content,
            contentType: file.type ?? 'image/jpeg',
          };
        }}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

const Welcome: React.FC = () => {
  const [textContent, setTextContent] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  return (
    <PageContainer>
      <TextArea
        rows={15}
        value={textContent}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setTextContent(e.target.value);
        }}
      />
      <br />
      <br />
      <UploadArea fileList={fileList} setFileList={setFileList} />
      <br />
      <br />
      <Row>
        <p>仅自己可见 </p>
        <Switch checked={isPrivate} onChange={(checked) => setIsPrivate(checked)} />
      </Row>
      <br />
      <Button
        style={{ width: '200px' }}
        type="primary"
        onClick={async () => {
          if (textContent.length === 0) {
            message.error('请输入内容');
            return;
          }
          const hasUploading = fileList.filter((file) => file.status === 'uploading').length > 0;
          if (hasUploading) {
            message.info('上传中，请稍候再试');
            return;
          }
          const successList = fileList.filter(
            (file) => file.status === 'success' || file.status === 'done',
          );
          const urlList = successList.map((file) => {
            const fileName = file.url?.split('/').pop() ?? '';
            return `/images/${fileName}`;
          });
          const imgInfoList = [];
          for (const img of successList) {
            const base64 = await getBase64(img.originFileObj as RcFile);
            const { width, height } = await imageSize(base64);
            imgInfoList.push({
              width,
              height,
            });
          }
          const content = textContent;
          postActivities({
            activitiesText: content ?? '',
            activitiesState: isPrivate ? '1' : '0',
            activitiesImages: urlList,
            activitiesImageInfo: imgInfoList,
            activitiesType: urlList.length > 0 ? '3' : '1',
          }).then(() => {
            message.success('发布成功');
            setTextContent('');
            setFileList([]);
            setIsPrivate(false);
          });
        }}
      >
        发送
      </Button>
    </PageContainer>
  );
};

export default Welcome;
