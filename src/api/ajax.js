/*
 * @Author: your name
 * @Date: 2022-03-23 11:26:45
 * @LastEditTime: 2022-03-29 23:00:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\api\ajax.js
 */
import request from "@/utils/request";
// 获取ck列表

export function getckList(params) {
  return request({
    url: "/ck",
    method: "get",
    params
  });
}
// 条件查询ck
export function searchCkList(params) {
  return request({
    url: "/ck",
    method: "get",
    params: params
  });
}
// 封装文件上传
// export function uploadtxt(url, params) {
//   console.log("params", params);
//   return axios.post(url, params, {
//     headers: { "content-type": "multipart/form-data" }
//   });
// }

// sku
export function searchskuList(params) {
  return request({
    url: "/ck/jd_app_store_config",
    method: "get",
    params: params
  });
}
// address
export function getAddress(params) {
  return request({
    url: "/ck/jd_local_url",
    method: "get",
    params: params
  });
}
// 代理
export function getdaili(params) {
  return request({
    url: "/ck/proxy_address_product",
    method: "get",
    params: params
  });
}
// ip
export function getip(params) {
  return request({
    url: "/ck/jd_proxy_ip_port",
    method: "get",
    params: params
  });
}

// jd_client_order
export function getclient_order(params) {
  return request({
    url: "/ck/jd_client_order",
    method: "get",
    params: params
  });
}

// jd_tenant

export function getjd_tenant(params) {
  return request({
    url: "/ck/jd_tenant",
    method: "get",
    params: params
  });
}
// skuid 增加库存
export function addskuid(params) {
  return request({
    url: "/ck/product_sku_id",
    method: "get",
    params: params
  });
}
// stock

export function getstock(params) {
  return request({
    url: "/ck/stock",
    method: "get",
    params: params
  });
}
// flowing_water
export function getflowing_water(params) {
  return request({
    url: "/ck/flowing_water",
    method: "get",
    params: params
  });
}
