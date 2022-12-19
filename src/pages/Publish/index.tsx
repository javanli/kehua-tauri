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
// const md5 = (input: string) => input
const log = logFactory('Publish');

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
// interface UploadRequestOption{
//     onProgress: (event: { percent: number }) => void,
//     onError: (event: Error, body?: any) => void
//     onSuccess: (body: any) => void
//     data: any
//     filename: string
//     file: File
//     withCredentials: boolean
//     action: string
//     headers: any
// }
// const customUpload = (option: UploadRequestOption) => {
//     // eslint-disable-next-line no-undef
//     const xhr = new XMLHttpRequest();

//     if (option.onProgress && xhr.upload) {
//         xhr.upload.onprogress = function progress(e: UploadProgressEvent) {
//             if (e.total > 0) {
//                 e.percent = (e.loaded / e.total) * 100;
//             }
//             option.onProgress(e);
//         };
//     }

//     // eslint-disable-next-line no-undef
//     const formData = new FormData();

//     if (option.data) {
//         any.keys(option.data).forEach(key => {
//             const value = option.data[key];
//             // support key-value array data
//             if (Array.isArray(value)) {
//                 value.forEach(item => {
//                     // { list: [ 11, 22 ] }
//                     // formData.append('list[]', 11);
//                     formData.append(`${key}[]`, item);
//                 });
//                 return;
//             }

//             formData.append(key, value as string | Blob);
//         });
//     }

//     // eslint-disable-next-line no-undef
//     if (option.file instanceof Blob) {
//         formData.append(option.filename, option.file, (option.file as any).name);
//     } else {
//         formData.append(option.filename, option.file);
//     }

//     xhr.onerror = function error(e) {
//         option.onError(e);
//     };

//     xhr.onload = function onload() {
//         // allow success when 2xx status
//         // see https://github.com/react-component/upload/issues/34
//         if (xhr.status < 200 || xhr.status >= 300) {
//             return option.onError(getError(option, xhr), getBody(xhr));
//         }

//         return option.onSuccess(getBody(xhr), xhr);
//     };

//     xhr.open(option.method, option.action, true);

//     // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
//     if (option.withCredentials && 'withCredentials' in xhr) {
//         xhr.withCredentials = true;
//     }

//     const headers = option.headers || {};

//     // when set headers['X-Requested-With'] = null , can close default XHR header
//     // see https://github.com/react-component/upload/issues/33
//     if (headers['X-Requested-With'] !== null) {
//         xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     }

//     any.keys(headers).forEach(h => {
//         if (headers[h] !== null) {
//             xhr.setRequestHeader(h, headers[h]);
//         }
//     });

//     xhr.send(formData);

//     return {
//         abort() {
//             xhr.abort();
//         },
//     };
// }
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
        action="http://tideswing-storehouse.cn-bj.ufileos.com/"
        data={async (file: UploadFile) => {
          const suffix = file.name.slice(file.name.lastIndexOf('.'));
          console.log(file);
          const originFileObj = new File([file as unknown as BlobPart], file.name, {
            type: file.type,
          });
          console.log(file);
          const base64 = await getBase64(originFileObj as RcFile);
          const md5Content = md5(base64);
          const saveKey = `/images/${md5Content}${suffix}`;
          const uid = currentUser?.userId ?? '';
          const authKey = md5(`${uid}${saveKey}`);
          log(
            `get upload auth with ${JSON.stringify({
              md5Content,
              uploadType: 'image/jpeg',
              saveKey: `${md5Content}${suffix}`,
              authKey,
            })}`,
          );
          const Authorization = await getUploadAuth({
            md5Content,
            uploadType: 'image/jpeg',
            saveKey: `${md5Content}${suffix}`,
            authKey,
          });
          const anyName = `images/${md5Content}${suffix}`;

          return {
            Authorization,
            anyName,
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
