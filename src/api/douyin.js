import request from "@/utils/request";
// account
export function getAccountList(params) {
  return request({
    url: "ck/douyinPage",
    method: "get",
    params
  });
}



export function changeDouyinAble(params) {
  return request({
    url: "ck/douyinAble",
    method: "get",
    params
  });
}

//  

export function uploadFile(formData) {
  return request({
    url: `ck/uploadDy`,
    method: 'post',
    data: formData,
    isFormData: true,
    headers: {
      'Content-Type': 'multipartt/form-data'
    }
  })
}
