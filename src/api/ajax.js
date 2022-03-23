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
export function uploadtxt(url, params) {
  console.log("params", params);
  return axios.post(url, params, {
    headers: { "content-type": "multipart/form-data" }
  });
}
