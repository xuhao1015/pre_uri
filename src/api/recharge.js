import request from "@/utils/request";
// account
export function getAccountList(params) {
  return request({
    url: "ck/douyinPhonePage",
    method: "get",
    params
  });
}



export function changeDouyinAble(params) {
  return request({
    url: "ck/douyinPhoneDelete",
    method: "get",
    params
  });
}

//  

export function uploadFile(formData) {
  return request({
    url: `ck/uploadPhone`,
    method: 'post',
    data: formData,
    isFormData: true,
    headers: {
      'Content-Type': 'multipartt/form-data'
    }
  })
}