import request from "@/utils/request";
// account
export function getAccountList(params) {
  return request({
    url: "ck/douyinDeviceIdPage",
    method: "get",
    params
  });
}



export function changeDouyinAble(params) {
  return request({
    url: "ck/douyinDeviceEnAble",
    method: "get",
    params
  });
}


export function addDevice(data) {
  return request({
    url: "ck/adddeviceIdAndIid",
    method: "post",
    data
  });
}

