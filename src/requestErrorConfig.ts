import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { getCommonAdditionHeaders } from './utils';

// 与后端约定的响应数据格式
interface ResponseStructure {
  data: any;
  error?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { data, error, errorMessage } = res as unknown as ResponseStructure;
      if (error !== undefined && error !== 0) {
        const errorInfo: any = new Error(errorMessage ?? '未知错误');
        errorInfo.name = 'BizError';
        errorInfo.info = { errorCode: 400, errorMessage, data };
        throw errorInfo; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage } = errorInfo;
          message.error(errorMessage);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
        console.log(error);
        if (error.response.data?.errorMessage) {
          message.error(`error message:${error.response.data.errorMessage}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      if (config.url?.indexOf('www.tideswing.fun') != -1) {
        return {
          ...config,
          headers: {
            ...config.headers,
            ...getCommonAdditionHeaders(),
          },
        };
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.success === false) {
        message.error('请求失败！');
      }
      response.data = data?.result ?? data;
      return response;
    },
  ],
};
