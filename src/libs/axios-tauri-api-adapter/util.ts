import { AxiosBasicCredentials, ResponseType as AxiosResponseType } from 'axios';
import { Body, Part, ResponseType as TauriResponseType } from '@tauri-apps/api/http';
import buildUrl, { IQueryParams } from 'build-url-ts';
import URLParse from 'url-parse';
import { Authorization, TauriAxiosRequestConfig } from './type';

export const base64Decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
export const base64Encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export function generateBasicAuthorization(basicCredentials: AxiosBasicCredentials): Authorization {
  const username = basicCredentials.username || '';
  const password = basicCredentials.password ? encodeURIComponent(basicCredentials.password) : '';
  return {
    Authorization: `Basic ${base64Encode(`${username}:${password}`)}`,
  };
}

export function generateJWTAuthorization(jwt: string): Authorization {
  return {
    Authorization: `Bearer ${jwt}`,
  };
}

export function getTauriResponseType(type?: AxiosResponseType): TauriResponseType {
  let responseType = TauriResponseType.JSON;
  if (type !== undefined && type !== null) {
    switch (type.toLowerCase()) {
      case 'json': {
        responseType = TauriResponseType.JSON;
        break;
      }
      case 'text': {
        responseType = TauriResponseType.Text;
        break;
      }
      default: {
        responseType = TauriResponseType.Binary;
      }
    }
  }
  return responseType;
}
const getArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });
export async function getTauriRequestData(data?: any): Promise<Body | undefined> {
  if (data === undefined || data === null) {
    return undefined;
  }
  if (typeof data === 'string') {
    return Body.text(data);
  } else if (data instanceof FormData) {
    const jsonBody: Record<string, Part> = {};
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string') {
        jsonBody[key] = value;
      } else if (value instanceof File) {
        const fileContent = await getArrayBuffer(value);
        jsonBody[key] = {
          file: new Uint8Array(fileContent),
          fileName: value.name,
          mime: value.type,
        };
      }
    }
    return Body.form(jsonBody);
  } else if (typeof data === 'object') {
    return Body.json(data);
  }
  return Body.bytes(data);
}

export const generateUrl = (config: TauriAxiosRequestConfig): string => {
  if (
    (config.baseURL === undefined || config.baseURL === null || config.baseURL.trim() === '') &&
    (config.url === undefined || config.url === null || config.url.trim() === '')
  ) {
    throw new Error('config.baseURL or config.url must be specified');
  }
  if (config.baseURL) {
    return buildUrl(config.baseURL, { path: config.url, queryParams: config.params });
  }
  const url = config.url ? config.url : '';
  const urlObj = URLParse(url, true);
  const path = urlObj.pathname === '/' ? undefined : urlObj.pathname;
  const params = urlObj.query;
  urlObj.set('pathname', '');
  urlObj.set('query', '');
  return buildUrl(urlObj.toString(), {
    path: path,
    queryParams: mergeQueryParams(params, config.params),
  });
};

export function mergeQueryParams(...queryParams: IQueryParams[]): IQueryParams | undefined {
  const params: IQueryParams = {};
  queryParams.forEach((queryParam) => Object.assign(params, queryParam));
  return Object.keys(params).length === 0 ? undefined : params;
}
