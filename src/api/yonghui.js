import request from "@/utils/request";
// account
export function getAccountList(params) {
  return request({
    url: "ck/douyinYonghuiPage",
    method: "get",
    params
  });
}



export function changeDouyinAble(params) {
  return request({
    url: "ck/douyinYonghuiAble",
    method: "get",
    params
  });
}

//  

export function uploadFile(formData) {
  return request({
    url: `ck/uploadYonghui`,
    method: 'post',
    data: formData,
    isFormData: true,
    headers: {
      'Content-Type': 'multipartt/form-data'
    }
  })
}
