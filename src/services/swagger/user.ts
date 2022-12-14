// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Create user This can only be done by the logged in user. POST /user */
export async function createUser(body: API.User, options?: { [key: string]: any }) {
  return request<API.User>(`https://petstore3.swagger.io/api/v3/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get user by user name GET /user/${param0} */
export async function getUserByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByNameParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.User>(`https://petstore3.swagger.io/api/v3/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Update user This can only be done by the logged in user. PUT /user/${param0} */
export async function updateUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserParams,
  body: API.User,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<any>(`https://petstore3.swagger.io/api/v3/user/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Delete user This can only be done by the logged in user. DELETE /user/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<any>(`https://petstore3.swagger.io/api/v3/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Creates list of users with given input array Creates list of users with given input array POST /user/createWithList */
export async function createUsersWithListInput(body: API.User[], options?: { [key: string]: any }) {
  return request<any>(`https://petstore3.swagger.io/api/v3/user/createWithList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Logs user into the system GET /user/login */
export async function loginUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loginUserParams,
  options?: { [key: string]: any },
) {
  return request<string>(`https://petstore3.swagger.io/api/v3/user/login`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Logs out current logged in user session GET /user/logout */
export async function logoutUser(options?: { [key: string]: any }) {
  return request<any>(`https://petstore3.swagger.io/api/v3/user/logout`, {
    method: 'GET',
    ...(options || {}),
  });
}
