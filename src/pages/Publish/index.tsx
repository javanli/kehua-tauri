import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import TextArea from 'antd/lib/input/TextArea';
import { getUploadAuth } from '@/services/kehua/publish';
import { useModel } from '@umijs/max';
import { logFactory } from '@/utils';
import md5 from 'md5';
import type { UploadRequestOption } from 'rc-upload/es/interface';
import { Body, getClient } from '@tauri-apps/api/http';
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
const customAsyncUpload = async (option: UploadRequestOption) => {
  const { Authorization, FileName, contentMd5 } = option.data as {
    Authorization: string;
    FileName: string;
    contentMd5: string;
  };
  try {
    const client = await getClient({
      maxRedirections: 0,
    });
    const binary = await getArrayBuffer(option.file as File);
    const body = Body.bytes(new Uint8Array(binary));
    const result = await client.put(
      `http://tideswing-storehouse.cn-bj.ufileos.com${FileName}`,
      body,
      {
        headers: {
          Authorization,
          'Content-MD5': contentMd5,
          UserAgent: 'UFile iOS/3.0.5',
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
const UploadArea: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const initialState = useModel('@@initialState', (data) => {
    return {
      currentUser: data.initialState?.currentUser,
    };
  });
  const { currentUser } = initialState;

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
          const saveKey = `/images/${md5Content}${suffix}`;
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
            FileName: `/images/${md5Content}${suffix}`,
            contentMd5: md5Content,
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
  return (
    <PageContainer>
      <TextArea
        rows={15}
        value={textContent}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setTextContent(e.target.value);
        }}
      />
      <UploadArea />
    </PageContainer>
  );
};

export default Welcome;
