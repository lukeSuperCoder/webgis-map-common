import { Service } from "../plugins/axios";

/**
 * 登录接口(示例)
 * @param params
 */
export function systemLogin(params) {
  return Service({
    url: "/casserver/logout",
    method: "get",
    data: params,
  });
}
/**
 * 获取系统用户信息
 * @param params
 */
export function getUserInfo(params) {
  return Service({
    url: "/query/org/queryByContextAndType",
    method: "get",
    params: params,
  });
}

/**
 * 新增用户
 * @param params
 */
export function addUserInfo(params) {
  return Service({
    url: "/user",
    method: "post",
    data: params,
  });
}
/**
 * 修改用户信息
 * @param params
 */
export function updateUserInfo(params) {
  return Service({
    url: "/user/" + params.userId,
    method: "put",
    data: params,
  });
}
/**
 * 删除用户信息
 * @param params
 */
export function deleteUserInfo(params) {
  return Service({
    url: "/user/" + params.userId,
    method: "delete",
  });
}
/**
 * 新增角色
 * @param params
 */
export function addRoleInfo(params) {
  return Service({
    url: "/role",
    method: "post",
    data: params,
  });
}
/**
 * 更新角色
 * @param params
 */
export function updateRoleInfo(params) {
  return Service({
    url: "/role",
    method: "put",
    data: params,
  });
}
/**
 * 删除角色
 * @param params
 */
export function deleteRoleInfo(params) {
  return Service({
    url: "/role/" + params.roleId,
    method: "delete",
  });
}
/**
 * 获取部门信息
 * @param params
 */
export function getDepartmentInfo() {
  return Service({
    url: "/org",
    method: "get",
  });
}
/**
 * 获取用户角色信息
 * @param params
 */
export function getRoleInfo(params) {
  return Service({
    url: "/role",
    method: "get",
    params: params,
  });
}
