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
